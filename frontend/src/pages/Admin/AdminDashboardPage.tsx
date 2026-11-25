import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { LeisureArea, Apartment, Resident, Reservation } from "../../types/models";
import { leisureAreaService } from "../../services/leisureAreaService";
import { apartmentService } from "../../services/apartmentService";
import { residentService } from "../../services/residentService";
import { reservationService } from "../../services/reservationService";
import { isAxiosError } from "axios";

function getLocalDateInputValue(date: Date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
}

function getLocalTimeInputValue(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export const AdminDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<"reservations" | "areas" | "apartments" | "residents">("reservations");
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Busca textual com .filter (Requisito obrigatório da disciplina - Aula 4)
  const [searchTerm, setSearchTerm] = useState("");

  // Dados carregados da API
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [areas, setAreas] = useState<LeisureArea[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);

  // Estados de Criação e Edição no mesmo modal (Requisito obrigatório da disciplina)
  // 1. Áreas de Lazer
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<LeisureArea | null>(null);
  const [newAreaName, setNewAreaName] = useState("");
  const [newAreaDesc, setNewAreaDesc] = useState("");

  // 2. Apartamentos
  const [isAptModalOpen, setIsAptModalOpen] = useState(false);
  const [editingApt, setEditingApt] = useState<Apartment | null>(null);
  const [newAptBlock, setNewAptBlock] = useState("");
  const [newAptNumber, setNewAptNumber] = useState("");

  // 3. Moradores
  const [isResidentModalOpen, setIsResidentModalOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [resFullName, setResFullName] = useState("");
  const [resCpf, setResCpf] = useState("");
  const [resPhone, setResPhone] = useState("");
  const [resAptId, setResAptId] = useState("");
  const [resEmail, setResEmail] = useState("");
  const [resPassword, setResPassword] = useState("");

  // 4. Reservas
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [reservationResidentId, setReservationResidentId] = useState("");
  const [reservationAreaId, setReservationAreaId] = useState("");
  const [reservationDate, setReservationDate] = useState("");
  const [reservationStartTime, setReservationStartTime] = useState("10:00");
  const [reservationEndTime, setReservationEndTime] = useState("12:00");
  const [reservationError, setReservationError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregamento de Dados (useEffect)
  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [resData, areasData, aptsData, residentsData] = await Promise.all([
        reservationService.getAll(),
        leisureAreaService.getAll(),
        apartmentService.getAll(),
        residentService.getAll(),
      ]);
      setReservations(resData);
      setAreas(areasData);
      setApartments(aptsData);
      setResidents(residentsData);
      if (aptsData.length > 0 && !resAptId) {
        setResAptId(aptsData[0].id);
      }
    } catch (err) {
      console.error("Erro ao carregar dados do administrador:", err);
      setFeedback({ type: "error", text: "Erro ao carregar informações da administração." });
    } finally {
      setIsLoading(false);
    }
  }, [resAptId]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // ==========================================
  // Handlers: Áreas de Lazer (Criar e Editar no mesmo modal)
  // ==========================================
  function openCreateArea() {
    setEditingArea(null);
    setNewAreaName("");
    setNewAreaDesc("");
    setIsAreaModalOpen(true);
  }

  function openEditArea(area: LeisureArea) {
    setEditingArea(area);
    setNewAreaName(area.name);
    setNewAreaDesc(area.description || "");
    setIsAreaModalOpen(true);
  }

  async function handleSaveArea(e: React.FormEvent) {
    e.preventDefault();
    if (!newAreaName.trim()) return;

    try {
      setIsSubmitting(true);
      if (editingArea) {
        await leisureAreaService.update(editingArea.id, {
          name: newAreaName.trim(),
          description: newAreaDesc.trim() || undefined,
        });
        setFeedback({ type: "success", text: "Área de lazer atualizada com sucesso!" });
      } else {
        await leisureAreaService.create({
          name: newAreaName.trim(),
          description: newAreaDesc.trim() || undefined,
        });
        setFeedback({ type: "success", text: "Área de lazer cadastrada com sucesso!" });
      }
      setIsAreaModalOpen(false);
      setEditingArea(null);
      setNewAreaName("");
      setNewAreaDesc("");
      loadAllData();
    } catch (err: unknown) {
      const msg = isAxiosError(err) ? err.response?.data?.message || err.response?.data?.error : null;
      setFeedback({ type: "error", text: msg || "Erro ao salvar área de lazer." });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggleAreaActive(area: LeisureArea) {
    try {
      await leisureAreaService.update(area.id, { active: !area.active });
      setFeedback({ type: "success", text: `Área "${area.name}" ${!area.active ? "ativada" : "desativada"} com sucesso!` });
      loadAllData();
    } catch {
      setFeedback({ type: "error", text: "Erro ao atualizar status da área." });
    }
  }

  async function handleDeleteArea(id: string) {
    if (!window.confirm("Deseja realmente remover esta área de lazer?")) return;
    try {
      await leisureAreaService.delete(id);
      setFeedback({ type: "success", text: "Área excluída com sucesso." });
      loadAllData();
    } catch (err: unknown) {
      const msg = isAxiosError(err) ? err.response?.data?.message : null;
      setFeedback({ type: "error", text: msg || "Não foi possível excluir a área (pode haver reservas vinculadas)." });
    }
  }

  // ==========================================
  // Handlers: Apartamentos (Criar e Editar no mesmo modal)
  // ==========================================
  function openCreateApt() {
    setEditingApt(null);
    setNewAptBlock("");
    setNewAptNumber("");
    setIsAptModalOpen(true);
  }

  function openEditApt(apt: Apartment) {
    setEditingApt(apt);
    setNewAptBlock(apt.block);
    setNewAptNumber(apt.number);
    setIsAptModalOpen(true);
  }

  async function handleSaveApartment(e: React.FormEvent) {
    e.preventDefault();
    if (!newAptBlock.trim() || !newAptNumber.trim()) return;

    try {
      setIsSubmitting(true);
      if (editingApt) {
        await apartmentService.update(editingApt.id, {
          block: newAptBlock.trim(),
          number: newAptNumber.trim(),
        });
        setFeedback({ type: "success", text: "Apartamento atualizado com sucesso!" });
      } else {
        await apartmentService.create({
          block: newAptBlock.trim(),
          number: newAptNumber.trim(),
        });
        setFeedback({ type: "success", text: "Apartamento cadastrado com sucesso!" });
      }
      setIsAptModalOpen(false);
      setEditingApt(null);
      setNewAptBlock("");
      setNewAptNumber("");
      loadAllData();
    } catch (err: unknown) {
      const msg = isAxiosError(err) ? err.response?.data?.message : null;
      setFeedback({ type: "error", text: msg || "Erro ao salvar apartamento (verifique duplicidade de bloco/número)." });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteApartment(id: string) {
    if (!window.confirm("Deseja realmente remover este apartamento?")) return;
    try {
      await apartmentService.delete(id);
      setFeedback({ type: "success", text: "Apartamento excluído com sucesso." });
      loadAllData();
    } catch (err: unknown) {
      const msg = isAxiosError(err) ? err.response?.data?.message : null;
      setFeedback({ type: "error", text: msg || "Não é possível excluir apartamento com moradores vinculados." });
    }
  }

  // ==========================================
  // Handlers: Moradores (Criar e Editar no mesmo modal)
  // ==========================================
  function openCreateResident() {
    setEditingResident(null);
    setResFullName("");
    setResCpf("");
    setResPhone("");
    setResEmail("");
    setResPassword("");
    setIsResidentModalOpen(true);
  }

  function openEditResident(r: Resident) {
    setEditingResident(r);
    setResFullName(r.fullName);
    setResCpf(r.cpf);
    setResPhone(r.phone);
    setResAptId(r.apartmentId);
    setResEmail("");
    setResPassword("");
    setIsResidentModalOpen(true);
  }

  async function handleSaveResident(e: React.FormEvent) {
    e.preventDefault();

    if (editingResident) {
      if (!resFullName || !resPhone || !resAptId) {
        setFeedback({ type: "error", text: "Preencha nome, telefone e selecione o apartamento." });
        return;
      }

      try {
        setIsSubmitting(true);
        await residentService.update(editingResident.id, {
          fullName: resFullName.trim(),
          phone: resPhone.trim(),
          apartmentId: resAptId,
        });
        setFeedback({ type: "success", text: "Cadastro do morador atualizado com sucesso!" });
        setIsResidentModalOpen(false);
        setEditingResident(null);
        loadAllData();
      } catch (err: unknown) {
        const msg = isAxiosError(err) ? err.response?.data?.message || err.response?.data?.error : null;
        setFeedback({ type: "error", text: msg || "Erro ao atualizar morador." });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      if (!resFullName || !resCpf || !resPhone || !resAptId || !resEmail || !resPassword) {
        setFeedback({ type: "error", text: "Preencha todos os campos do novo morador." });
        return;
      }

      try {
        setIsSubmitting(true);
        await residentService.create({
          fullName: resFullName.trim(),
          cpf: resCpf.trim(),
          phone: resPhone.trim(),
          apartmentId: resAptId,
          email: resEmail.trim(),
          password: resPassword,
        });
        setFeedback({ type: "success", text: "Morador cadastrado e credenciais criadas com sucesso!" });
        setIsResidentModalOpen(false);
        setEditingResident(null);
        setResFullName("");
        setResCpf("");
        setResPhone("");
        setResEmail("");
        setResPassword("");
        loadAllData();
      } catch (err: unknown) {
        const msg = isAxiosError(err) ? err.response?.data?.message || err.response?.data?.error : null;
        setFeedback({ type: "error", text: msg || "Erro ao cadastrar morador." });
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  async function handleDeleteResident(id: string) {
    if (!window.confirm("Deseja realmente remover o morador?")) return;
    try {
      await residentService.delete(id);
      setFeedback({ type: "success", text: "Morador removido com sucesso." });
      loadAllData();
    } catch {
      setFeedback({ type: "error", text: "Erro ao excluir morador." });
    }
  }

  // ==========================================
  // Handlers: Reservas
  // ==========================================
  function openCreateReservation() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setEditingReservation(null);
    setReservationError("");
    setReservationResidentId(residents[0]?.id ?? "");
    setReservationAreaId(areas.find((area) => area.active)?.id ?? "");
    setReservationDate(getLocalDateInputValue(tomorrow));
    setReservationStartTime("10:00");
    setReservationEndTime("12:00");
    setIsReservationModalOpen(true);
  }

  function openEditReservation(reservation: Reservation) {
    const startAt = new Date(reservation.startAt);
    const endAt = new Date(reservation.endAt);
    setEditingReservation(reservation);
    setReservationError("");
    setReservationResidentId(reservation.residentId);
    setReservationAreaId(reservation.leisureAreaId);
    setReservationDate(getLocalDateInputValue(startAt));
    setReservationStartTime(getLocalTimeInputValue(startAt));
    setReservationEndTime(getLocalTimeInputValue(endAt));
    setIsReservationModalOpen(true);
  }

  async function handleSaveReservation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReservationError("");

    if (!reservationResidentId || !reservationAreaId || !reservationDate) {
      setReservationError("Selecione o morador, a área e a data da reserva.");
      return;
    }

    const startAt = new Date(`${reservationDate}T${reservationStartTime}:00`);
    const endAt = new Date(`${reservationDate}T${reservationEndTime}:00`);

    if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
      setReservationError("Informe uma data e horários válidos.");
      return;
    }

    if (startAt <= new Date()) {
      setReservationError("A data e o horário da reserva devem estar no futuro.");
      return;
    }

    if (startAt >= endAt) {
      setReservationError("O horário inicial deve ser anterior ao horário final.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        residentId: reservationResidentId,
        leisureAreaId: reservationAreaId,
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
      };

      if (editingReservation) {
        await reservationService.update(editingReservation.id, payload);
        setFeedback({ type: "success", text: "Reserva atualizada com sucesso." });
      } else {
        await reservationService.create(payload);
        setFeedback({ type: "success", text: "Reserva criada com sucesso." });
      }

      setIsReservationModalOpen(false);
      setEditingReservation(null);
      loadAllData();
    } catch (error: unknown) {
      const message = isAxiosError(error)
        ? error.response?.data?.message || error.response?.data?.error
        : null;
      setReservationError(message || "Não foi possível salvar a reserva.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCancelReservation(id: string) {
    try {
      await reservationService.cancel(id);
      setFeedback({ type: "success", text: "Reserva cancelada." });
      loadAllData();
    } catch {
      setFeedback({ type: "error", text: "Erro ao cancelar reserva." });
    }
  }

  async function handleDeleteReservation(id: string) {
    if (!window.confirm("Deseja excluir permanentemente o registro desta reserva?")) return;
    try {
      await reservationService.delete(id);
      setFeedback({ type: "success", text: "Reserva excluída definitivamente." });
      loadAllData();
    } catch {
      setFeedback({ type: "error", text: "Erro ao excluir reserva." });
    }
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  function formatTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  // ==========================================
  // Filtragem com .filter (Requisito da disciplina)
  // ==========================================
  const filteredReservations = reservations.filter((res) => {
    const term = searchTerm.toLowerCase();
    return (
      res.leisureArea?.name?.toLowerCase().includes(term) ||
      res.resident?.fullName?.toLowerCase().includes(term) ||
      res.resident?.apartment?.block?.toLowerCase().includes(term) ||
      res.resident?.apartment?.number?.includes(term) ||
      res.status?.toLowerCase().includes(term)
    );
  });

  const filteredAreas = areas.filter((area) => {
    const term = searchTerm.toLowerCase();
    return (
      area.name.toLowerCase().includes(term) ||
      (area.description && area.description.toLowerCase().includes(term))
    );
  });

  const filteredApartments = apartments.filter((apt) => {
    const term = searchTerm.toLowerCase();
    return (
      apt.block.toLowerCase().includes(term) ||
      apt.number.includes(term)
    );
  });

  const filteredResidents = residents.filter((r) => {
    const term = searchTerm.toLowerCase();
    return (
      r.fullName.toLowerCase().includes(term) ||
      r.cpf.includes(term) ||
      r.phone.includes(term) ||
      (r.apartment && (r.apartment.block.toLowerCase().includes(term) || r.apartment.number.includes(term)))
    );
  });

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-brand">
          <h2>CondoReserva</h2>
          <span className="badge badge-admin">Administração / Portaria</span>
        </div>
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-email">{user?.email}</span>
          </div>
          <button className="logout-button" onClick={logout} type="button">
            Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        <section className="welcome-banner admin-banner">
          <div>
            <h1>Painel de Controle do Condomínio 🏢</h1>
            <p>Supervisão completa de moradores, apartamentos, espaços de lazer e agendamentos.</p>
          </div>
        </section>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`feedback-alert ${feedback.type === "success" ? "feedback-success" : "feedback-error"}`}>
            <span>{feedback.text}</span>
            <button className="feedback-close" onClick={() => setFeedback(null)}>
              &times;
            </button>
          </div>
        )}

        {/* Barra de Busca com .filter (Requisito da aula 4) */}
        <div className="search-bar-container">
          <span style={{ fontSize: "16px" }}>🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="Buscar por texto em tempo real (nome, bloco, apartamento, status)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}
              title="Limpar busca"
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="dashboard-nav-tabs">
          <button
            className={`tab-btn ${activeTab === "reservations" ? "active" : ""}`}
            onClick={() => setActiveTab("reservations")}
            type="button"
          >
            Reservas Gerais ({filteredReservations.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "areas" ? "active" : ""}`}
            onClick={() => setActiveTab("areas")}
            type="button"
          >
            Áreas de Lazer ({filteredAreas.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "apartments" ? "active" : ""}`}
            onClick={() => setActiveTab("apartments")}
            type="button"
          >
            Apartamentos ({filteredApartments.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "residents" ? "active" : ""}`}
            onClick={() => setActiveTab("residents")}
            type="button"
          >
            Moradores ({filteredResidents.length})
          </button>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="spinner" />
            <p>Carregando dados da administração...</p>
          </div>
        ) : (
          <>
            {/* Aba 1: Reservas Gerais */}
            {activeTab === "reservations" && (
              <div className="table-wrapper">
                <div className="section-toolbar">
                  <h3>Todas as Reservas do Condomínio</h3>
                  <button
                    className="submit-button btn-compact"
                    onClick={openCreateReservation}
                    type="button"
                  >
                    Nova Reserva
                  </button>
                </div>
                {filteredReservations.length === 0 ? (
                  <p className="empty-message">Nenhuma reserva encontrada.</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Área</th>
                        <th>Morador</th>
                        <th>Bloco / Apto</th>
                        <th>Data</th>
                        <th>Horário</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReservations.map((res) => (
                        <tr key={res.id}>
                          <td><strong>{res.leisureArea?.name || "Área"}</strong></td>
                          <td>{res.resident?.fullName || "Morador"}</td>
                          <td>
                            {res.resident?.apartment
                              ? `Bl. ${res.resident.apartment.block} - Ap. ${res.resident.apartment.number}`
                              : "—"}
                          </td>
                          <td>{formatDate(res.startAt)}</td>
                          <td>{formatTime(res.startAt)} às {formatTime(res.endAt)}</td>
                          <td>
                            <span
                              className={`status-pill ${
                                res.status === "CONFIRMED" ? "pill-active" : "pill-inactive"
                              }`}
                            >
                              {res.status === "CONFIRMED" ? "Confirmada" : "Cancelada"}
                            </span>
                          </td>
                          <td className="table-actions">
                            {res.status === "CONFIRMED" && (
                              <>
                                <button
                                  className="btn-table-action"
                                  onClick={() => openEditReservation(res)}
                                  title="Editar Reserva"
                                >
                                  Editar
                                </button>
                                <button
                                  className="btn-table-action"
                                  onClick={() => handleCancelReservation(res.id)}
                                  title="Cancelar Reserva"
                                >
                                  Cancelar
                                </button>
                              </>
                            )}
                            <button
                              className="btn-table-delete"
                              onClick={() => handleDeleteReservation(res.id)}
                              title="Excluir Definitivamente"
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Aba 2: Áreas de Lazer */}
            {activeTab === "areas" && (
              <div className="table-wrapper">
                <div className="section-toolbar">
                  <h3>Gestão das Áreas de Lazer</h3>
                  <button className="submit-button btn-compact" onClick={openCreateArea}>
                    + Nova Área de Lazer
                  </button>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Descrição</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAreas.map((area) => (
                      <tr key={area.id}>
                        <td><strong>{area.name}</strong></td>
                        <td>{area.description || "Sem descrição"}</td>
                        <td>
                          <span className={`status-pill ${area.active ? "pill-active" : "pill-inactive"}`}>
                            {area.active ? "Ativa" : "Em Manutenção"}
                          </span>
                        </td>
                        <td className="table-actions">
                          <button
                            className="btn-table-action"
                            onClick={() => openEditArea(area)}
                            title="Editar Dados no mesmo Modal"
                          >
                            Editar
                          </button>
                          <button
                            className="btn-table-action"
                            onClick={() => handleToggleAreaActive(area)}
                          >
                            {area.active ? "Pôr em Manutenção" : "Ativar"}
                          </button>
                          <button
                            className="btn-table-delete"
                            onClick={() => handleDeleteArea(area.id)}
                            title="Remover Área"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Aba 3: Apartamentos */}
            {activeTab === "apartments" && (
              <div className="table-wrapper">
                <div className="section-toolbar">
                  <h3>Apartamentos Cadastrados</h3>
                  <button className="submit-button btn-compact" onClick={openCreateApt}>
                    + Novo Apartamento
                  </button>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Bloco / Torre</th>
                      <th>Número</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApartments.map((apt) => (
                      <tr key={apt.id}>
                        <td><strong>Bloco {apt.block}</strong></td>
                        <td>Apartamento {apt.number}</td>
                        <td className="table-actions">
                          <button
                            className="btn-table-action"
                            onClick={() => openEditApt(apt)}
                            title="Editar Apartamento no mesmo Modal"
                          >
                            Editar
                          </button>
                          <button
                            className="btn-table-delete"
                            onClick={() => handleDeleteApartment(apt.id)}
                            title="Remover Apartamento"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Aba 4: Moradores */}
            {activeTab === "residents" && (
              <div className="table-wrapper">
                <div className="section-toolbar">
                  <h3>Moradores Cadastrados</h3>
                  <button className="submit-button btn-compact" onClick={openCreateResident}>
                    + Novo Morador
                  </button>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nome Completo</th>
                      <th>CPF</th>
                      <th>Telefone</th>
                      <th>Apartamento</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResidents.map((r) => (
                      <tr key={r.id}>
                        <td><strong>{r.fullName}</strong></td>
                        <td>{r.cpf}</td>
                        <td>{r.phone}</td>
                        <td>
                          {r.apartment
                            ? `Bloco ${r.apartment.block} - Apto ${r.apartment.number}`
                            : "Não vinculado"}
                        </td>
                        <td className="table-actions">
                          <button
                            className="btn-table-action"
                            onClick={() => openEditResident(r)}
                            title="Editar Morador no mesmo Modal"
                          >
                            Editar
                          </button>
                          <button
                            className="btn-table-delete"
                            onClick={() => handleDeleteResident(r.id)}
                            title="Remover Morador"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal: Reserva (Cria e Edita no mesmo modal) */}
      {isReservationModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsReservationModalOpen(false)}>
          <div className="modal-container" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingReservation ? "Editar Reserva" : "Nova Reserva"}</h2>
              <button
                className="modal-close-btn"
                onClick={() => setIsReservationModalOpen(false)}
                type="button"
                aria-label="Fechar"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveReservation} className="modal-form">
              <label htmlFor="reservation-resident">Morador</label>
              <select
                id="reservation-resident"
                value={reservationResidentId}
                onChange={(event) => setReservationResidentId(event.target.value)}
                disabled={isSubmitting}
                required
              >
                <option value="">Selecione um morador</option>
                {residents.map((resident) => (
                  <option key={resident.id} value={resident.id}>
                    {resident.fullName} — Bloco {resident.apartment?.block}, Apto {resident.apartment?.number}
                  </option>
                ))}
              </select>

              <label htmlFor="reservation-area">Área de lazer</label>
              <select
                id="reservation-area"
                value={reservationAreaId}
                onChange={(event) => setReservationAreaId(event.target.value)}
                disabled={isSubmitting}
                required
              >
                <option value="">Selecione uma área ativa</option>
                {areas.filter((area) => area.active).map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>

              <label htmlFor="reservation-date">Data</label>
              <input
                id="reservation-date"
                type="date"
                min={getLocalDateInputValue(new Date())}
                value={reservationDate}
                onChange={(event) => setReservationDate(event.target.value)}
                disabled={isSubmitting}
                required
              />

              <div className="form-row">
                <div className="form-col">
                  <label htmlFor="reservation-start-time">Início</label>
                  <input
                    id="reservation-start-time"
                    type="time"
                    value={reservationStartTime}
                    onChange={(event) => setReservationStartTime(event.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div className="form-col">
                  <label htmlFor="reservation-end-time">Término</label>
                  <input
                    id="reservation-end-time"
                    type="time"
                    value={reservationEndTime}
                    onChange={(event) => setReservationEndTime(event.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              {reservationError && (
                <div className="login-notice error-notice" role="alert">
                  {reservationError}
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsReservationModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : editingReservation ? "Salvar Alterações" : "Criar Reserva"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Área de Lazer (Cria e Edita no mesmo modal) */}
      {isAreaModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAreaModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingArea ? "Editar Área de Lazer" : "Cadastrar Área de Lazer"}</h2>
              <button className="modal-close-btn" onClick={() => setIsAreaModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveArea} className="modal-form">
              <label>Nome do Espaço</label>
              <input
                type="text"
                placeholder="Ex: Salão de Festas Principal"
                value={newAreaName}
                onChange={(e) => setNewAreaName(e.target.value)}
                required
              />
              <label>Descrição / Normas</label>
              <input
                type="text"
                placeholder="Ex: Capacidade máxima 50 pessoas, taxa de limpeza inclusa."
                value={newAreaDesc}
                onChange={(e) => setNewAreaDesc(e.target.value)}
              />
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsAreaModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : editingArea ? "Salvar Alterações" : "Cadastrar Área"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Apartamento (Cria e Edita no mesmo modal) */}
      {isAptModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAptModalOpen(false)}>
          <div className="modal-container modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingApt ? "Editar Apartamento" : "Cadastrar Apartamento"}</h2>
              <button className="modal-close-btn" onClick={() => setIsAptModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveApartment} className="modal-form">
              <label>Bloco / Edifício</label>
              <input
                type="text"
                placeholder="Ex: A"
                value={newAptBlock}
                onChange={(e) => setNewAptBlock(e.target.value)}
                required
              />
              <label>Número do Apartamento</label>
              <input
                type="text"
                placeholder="Ex: 101"
                value={newAptNumber}
                onChange={(e) => setNewAptNumber(e.target.value)}
                required
              />
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsAptModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : editingApt ? "Salvar Alterações" : "Salvar Apartamento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Morador (Cria e Edita no mesmo modal) */}
      {isResidentModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsResidentModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingResident ? "Editar Morador" : "Cadastrar Novo Morador"}</h2>
              <button className="modal-close-btn" onClick={() => setIsResidentModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveResident} className="modal-form">
              <label>Nome Completo</label>
              <input
                type="text"
                placeholder="Ex: Carlos Eduardo de Souza"
                value={resFullName}
                onChange={(e) => setResFullName(e.target.value)}
                required
              />
              <div className="form-row">
                <div className="form-col">
                  <label>CPF</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={resCpf}
                    onChange={(e) => setResCpf(e.target.value)}
                    disabled={!!editingResident}
                    required
                  />
                </div>
                <div className="form-col">
                  <label>Telefone</label>
                  <input
                    type="text"
                    placeholder="(81) 99999-9999"
                    value={resPhone}
                    onChange={(e) => setResPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
              <label>Apartamento Vinculado</label>
              <select
                value={resAptId}
                onChange={(e) => setResAptId(e.target.value)}
                required
              >
                {apartments.map((a) => (
                  <option key={a.id} value={a.id}>
                    Bloco {a.block} — Apto {a.number}
                  </option>
                ))}
              </select>

              {!editingResident && (
                <div className="form-row">
                  <div className="form-col">
                    <label>E-mail de Acesso</label>
                    <input
                      type="email"
                      placeholder="morador@condominio.com"
                      value={resEmail}
                      onChange={(e) => setResEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-col">
                    <label>Senha Provisória (Mín. 8 dígitos)</label>
                    <input
                      type="password"
                      placeholder="********"
                      value={resPassword}
                      onChange={(e) => setResPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsResidentModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : editingResident ? "Salvar Alterações" : "Criar Cadastro de Morador"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
