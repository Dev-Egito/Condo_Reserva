import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { LeisureArea, Reservation } from "../../types/models";
import { leisureAreaService } from "../../services/leisureAreaService";
import { reservationService } from "../../services/reservationService";
import { NewReservationModal } from "../../components/NewReservationModal";

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<"areas" | "my-reservations">("areas");
  const [areas, setAreas] = useState<LeisureArea[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Controle de Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAreaForModal, setSelectedAreaForModal] = useState<string | undefined>();
  const [cancellingReservationId, setCancellingReservationId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [areasData, reservationsData] = await Promise.all([
        leisureAreaService.getAll(),
        reservationService.getMyReservations(),
      ]);
      setAreas(areasData);
      setReservations(reservationsData);
    } catch (error) {
      console.error("Erro ao carregar dados do morador:", error);
      setFeedbackMessage({
        type: "error",
        text: "Não foi possível carregar os dados. Tente atualizar a página.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleOpenModal(areaId?: string) {
    setSelectedAreaForModal(areaId);
    setIsModalOpen(true);
  }

  function handleModalSuccess() {
    setIsModalOpen(false);
    setSelectedAreaForModal(undefined);
    setFeedbackMessage({
      type: "success",
      text: "Reserva realizada com sucesso!",
    });
    loadData();
    setActiveTab("my-reservations");
  }

  async function handleConfirmCancel() {
    if (!cancellingReservationId) return;

    try {
      setIsCancelling(true);
      await reservationService.cancel(cancellingReservationId);
      setFeedbackMessage({
        type: "success",
        text: "Reserva cancelada com sucesso.",
      });
      setCancellingReservationId(null);
      loadData();
    } catch {
      setFeedbackMessage({
        type: "error",
        text: "Erro ao cancelar a reserva. Tente novamente.",
      });
    } finally {
      setIsCancelling(false);
    }
  }

  function formatDate(isoString: string) {
    const d = new Date(isoString);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(isoString: string) {
    const d = new Date(isoString);
    return d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="dashboard-container">
      {/* Cabeçalho */}
      <header className="dashboard-header">
        <div className="header-brand">
          <h2>CondoReserva</h2>
          <span className="badge badge-resident">Espaço do Morador</span>
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

      {/* Conteúdo Principal */}
      <main className="dashboard-content">
        <section className="welcome-banner">
          <div>
            <h1>Olá, {user?.name?.split(" ")[0]}! 👋</h1>
            <p>
              Consulte os espaços de lazer do condomínio e organize seus momentos de confraternização.
            </p>
          </div>
          <button
            className="action-button primary-btn"
            onClick={() => handleOpenModal()}
            type="button"
          >
            + Nova Reserva
          </button>
        </section>

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div
            className={`feedback-alert ${feedbackMessage.type === "success" ? "feedback-success" : "feedback-error"}`}
            role="status"
          >
            <span>{feedbackMessage.text}</span>
            <button
              className="feedback-close"
              onClick={() => setFeedbackMessage(null)}
              aria-label="Fechar aviso"
            >
              &times;
            </button>
          </div>
        )}

        {/* Abas de Navegação */}
        <div className="dashboard-nav-tabs">
          <button
            className={`tab-btn ${activeTab === "areas" ? "active" : ""}`}
            onClick={() => setActiveTab("areas")}
            type="button"
          >
            Áreas de Lazer ({areas.filter((a) => a.active).length})
          </button>
          <button
            className={`tab-btn ${activeTab === "my-reservations" ? "active" : ""}`}
            onClick={() => setActiveTab("my-reservations")}
            type="button"
          >
            Minhas Reservas ({reservations.length})
          </button>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="spinner" />
            <p>Carregando informações...</p>
          </div>
        ) : (
          <>
            {/* Aba 1: Áreas de Lazer */}
            {activeTab === "areas" && (
              <div className="areas-grid">
                {areas.length === 0 ? (
                  <p className="empty-message">Nenhuma área de lazer cadastrada no momento.</p>
                ) : (
                  areas.map((area) => (
                    <article key={area.id} className="area-card">
                      <div className="area-card-header">
                        <h3>{area.name}</h3>
                        <span className={`status-pill ${area.active ? "pill-active" : "pill-inactive"}`}>
                          {area.active ? "Disponível" : "Em Manutenção"}
                        </span>
                      </div>
                      <p className="area-description">
                        {area.description || "Espaço reservado para o bem-estar e lazer dos condôminos."}
                      </p>
                      <div className="area-card-footer">
                        <button
                          className="btn-reserve"
                          onClick={() => handleOpenModal(area.id)}
                          disabled={!area.active}
                          type="button"
                        >
                          {area.active ? "Reservar Este Espaço" : "Indisponível"}
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            )}

            {/* Aba 2: Minhas Reservas */}
            {activeTab === "my-reservations" && (
              <div className="reservations-container">
                {reservations.length === 0 ? (
                  <div className="empty-state">
                    <p>Você ainda não possui nenhuma reserva agendada.</p>
                    <button
                      className="submit-button"
                      onClick={() => handleOpenModal()}
                      type="button"
                    >
                      Agendar Minha Primeira Reserva
                    </button>
                  </div>
                ) : (
                  <div className="reservations-list">
                    {reservations.map((res) => {
                      const isConfirmed = res.status === "CONFIRMED";
                      const isPast = new Date(res.endAt) < new Date();

                      return (
                        <div key={res.id} className="reservation-card">
                          <div className="reservation-main">
                            <span className="res-area-name">
                              {res.leisureArea?.name || "Área de Lazer"}
                            </span>
                            <div className="res-details">
                              <span className="res-date">📅 {formatDate(res.startAt)}</span>
                              <span className="res-time">
                                ⏰ {formatTime(res.startAt)} às {formatTime(res.endAt)}
                              </span>
                            </div>
                          </div>

                          <div className="reservation-actions">
                            <span
                              className={`status-badge ${
                                isConfirmed
                                  ? isPast
                                    ? "status-past"
                                    : "status-confirmed"
                                  : "status-cancelled"
                              }`}
                            >
                              {isConfirmed
                                ? isPast
                                  ? "Concluída"
                                  : "Confirmada"
                                : "Cancelada"}
                            </span>

                            {isConfirmed && !isPast && (
                              <button
                                className="btn-cancel"
                                onClick={() => setCancellingReservationId(res.id)}
                                type="button"
                              >
                                Cancelar
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal de Nova Reserva */}
      {isModalOpen && (
        <NewReservationModal
          areas={areas.filter((a) => a.active)}
          selectedAreaId={selectedAreaForModal}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleModalSuccess}
        />
      )}

      {/* Modal de Confirmação de Cancelamento */}
      {cancellingReservationId && (
        <div className="modal-backdrop" onClick={() => setCancellingReservationId(null)}>
          <div className="modal-container modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirmar Cancelamento</h2>
              <button
                className="modal-close-btn"
                onClick={() => setCancellingReservationId(null)}
              >
                &times;
              </button>
            </div>
            <p className="modal-body-text">
              Tem certeza de que deseja cancelar esta reserva? O horário ficará disponível novamente para outros moradores.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setCancellingReservationId(null)}
                disabled={isCancelling}
              >
                Voltar
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
              >
                {isCancelling ? "Cancelando..." : "Sim, Cancelar Reserva"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
