import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { LeisureArea, Apartment, Resident, Reservation } from "../../types/models";
import { leisureAreaService } from "../../services/leisureAreaService";
import { apartmentService } from "../../services/apartmentService";
import { residentService } from "../../services/residentService";
import { reservationService } from "../../services/reservationService";
import { isAxiosError } from "axios";

export const AdminDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<"reservations" | "areas" | "apartments" | "residents">("reservations");
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Dados
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [areas, setAreas] = useState<LeisureArea[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);

  // Modais de Criação
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [newAreaName, setNewAreaName] = useState("");
  const [newAreaDesc, setNewAreaDesc] = useState("");

  const [isAptModalOpen, setIsAptModalOpen] = useState(false);
  const [newAptBlock, setNewAptBlock] = useState("");
  const [newAptNumber, setNewAptNumber] = useState("");

  const [isResidentModalOpen, setIsResidentModalOpen] = useState(false);
  const [resFullName, setResFullName] = useState("");
  const [resCpf, setResCpf] = useState("");
  const [resPhone, setResPhone] = useState("");
  const [resAptId, setResAptId] = useState("");
  const [resEmail, setResEmail] = useState("");
  const [resPassword, setResPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregamento de Dados
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

  // Ações de Criação
  async function handleCreateArea(e: React.FormEvent) {
    e.preventDefault();
    if (!newAreaName.trim()) return;
    try {
      setIsSubmitting(true);
      await leisureAreaService.create({ name: newAreaName.trim(), description: newAreaDesc.trim() || undefined });
      setFeedback({ type: "success", text: "Área de lazer cadastrada com sucesso!" });
      setIsAreaModalOpen(false);
      setNewAreaName("");
      setNewAreaDesc("");
      loadAllData();
    } catch (err: unknown) {
      const msg = isAxiosError(err) ? err.response?.data?.message || err.response?.data?.error : null;
      setFeedback({ type: "error", text: msg || "Erro ao cadastrar área de lazer." });
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
    if (!window.confirm("Deseja realmente excluir esta área de lazer?")) return;
    try {
      await leisureAreaService.delete(id);
      setFeedback({ type: "success", text: "Área excluída com sucesso." });
      loadAllData();
    } catch (err: unknown) {
      const msg = isAxiosError(err) ? err.response?.data?.message : null;
      setFeedback({ type: "error", text: msg || "Não foi possível excluir a área (pode haver reservas vinculadas)." });
    }
  }

  async function handleCreateApartment(e: React.FormEvent) {
    e.preventDefault();
    if (!newAptBlock.trim() || !newAptNumber.trim()) return;
    try {
      setIsSubmitting(true);
      await apartmentService.create({ block: newAptBlock.trim(), number: newAptNumber.trim() });
      setFeedback({ type: "success", text: "Apartamento cadastrado com sucesso!" });
      setIsAptModalOpen(false);
      setNewAptBlock("");
      setNewAptNumber("");
      loadAllData();
    } catch (err: unknown) {
      const msg = isAxiosError(err) ? err.response?.data?.message : null;
      setFeedback({ type: "error", text: msg || "Erro ao cadastrar apartamento (já existente ou inválido)." });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteApartment(id: string) {
    if (!window.confirm("Deseja realmente excluir este apartamento?")) return;
    try {
      await apartmentService.delete(id);
      setFeedback({ type: "success", text: "Apartamento excluído com sucesso." });
      loadAllData();
    } catch (err: unknown) {
      const msg = isAxiosError(err) ? err.response?.data?.message : null;
      setFeedback({ type: "error", text: msg || "Não é possível excluir apartamento com moradores vinculados." });
    }
  }

  async function handleCreateResident(e: React.FormEvent) {
    e.preventDefault();
    if (!resFullName || !resCpf || !resPhone || !resAptId || !resEmail || !resPassword) {
      setFeedback({ type: "error", text: "Preencha todos os campos do morador." });
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

        {/* Navigation Tabs */}
        <div className="dashboard-nav-tabs">
          <button
            className={`tab-btn ${activeTab === "reservations" ? "active" : ""}`}
            onClick={() => setActiveTab("reservations")}
            type="button"
          >
            Reservas Gerais ({reservations.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "areas" ? "active" : ""}`}
            onClick={() => setActiveTab("areas")}
            type="button"
          >
            Áreas de Lazer ({areas.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "apartments" ? "active" : ""}`}
            onClick={() => setActiveTab("apartments")}
            type="button"
          >
            Apartamentos ({apartments.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "residents" ? "active" : ""}`}
            onClick={() => setActiveTab("residents")}
            type="button"
          >
            Moradores ({residents.length})
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
                </div>
                {reservations.length === 0 ? (
                  <p className="empty-message">Nenhuma reserva registrada no condomínio.</p>
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
                      {reservations.map((res) => (
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
                              <button
                                className="btn-table-action"
                                onClick={() => handleCancelReservation(res.id)}
                                title="Cancelar Reserva"
                              >
                                Cancelar
                              </button>
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
                  <button className="submit-button btn-compact" onClick={() => setIsAreaModalOpen(true)}>
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
                    {areas.map((area) => (
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
                            onClick={() => handleToggleAreaActive(area)}
                          >
                            {area.active ? "Pôr em Manutenção" : "Ativar"}
                          </button>
                          <button
                            className="btn-table-delete"
                            onClick={() => handleDeleteArea(area.id)}
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
                  <button className="submit-button btn-compact" onClick={() => setIsAptModalOpen(true)}>
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
                    {apartments.map((apt) => (
                      <tr key={apt.id}>
                        <td><strong>Bloco {apt.block}</strong></td>
                        <td>Apartamento {apt.number}</td>
                        <td className="table-actions">
                          <button
                            className="btn-table-delete"
                            onClick={() => handleDeleteApartment(apt.id)}
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
                  <button className="submit-button btn-compact" onClick={() => setIsResidentModalOpen(true)}>
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
                    {residents.map((r) => (
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
                            className="btn-table-delete"
                            onClick={() => handleDeleteResident(r.id)}
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

      {/* Modal: Nova Área */}
      {isAreaModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAreaModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Cadastrar Área de Lazer</h2>
              <button className="modal-close-btn" onClick={() => setIsAreaModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleCreateArea} className="modal-form">
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
                  {isSubmitting ? "Cadastrando..." : "Cadastrar Área"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Novo Apartamento */}
      {isAptModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAptModalOpen(false)}>
          <div className="modal-container modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Cadastrar Apartamento</h2>
              <button className="modal-close-btn" onClick={() => setIsAptModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleCreateApartment} className="modal-form">
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
                  {isSubmitting ? "Salvando..." : "Salvar Apartamento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Novo Morador */}
      {isResidentModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsResidentModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Cadastrar Novo Morador</h2>
              <button className="modal-close-btn" onClick={() => setIsResidentModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleCreateResident} className="modal-form">
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
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsResidentModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  {isSubmitting ? "Cadastrando..." : "Criar Cadastro de Morador"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
