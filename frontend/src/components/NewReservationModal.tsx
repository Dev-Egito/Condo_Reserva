import React, { useState } from "react";
import { LeisureArea } from "../types/leisureArea";
import { reservationService } from "../services/reservationService";
import { isAxiosError } from "axios";

interface NewReservationModalProps {
  areas: LeisureArea[];
  selectedAreaId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const NewReservationModal: React.FC<NewReservationModalProps> = ({
  areas,
  selectedAreaId,
  onClose,
  onSuccess,
}) => {
  const [areaId, setAreaId] = useState(selectedAreaId || (areas[0]?.id ?? ""));
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("12:00");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    if (!areaId) {
      setErrorMessage("Por favor, selecione uma área de lazer.");
      return;
    }

    if (!date || !startTime || !endTime) {
      setErrorMessage("Preencha a data e os horários de início e término.");
      return;
    }

    const startDateTime = new Date(`${date}T${startTime}:00`);
    const endDateTime = new Date(`${date}T${endTime}:00`);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      setErrorMessage("Horário inválido.");
      return;
    }

    if (startDateTime >= endDateTime) {
      setErrorMessage("O horário de início deve ser anterior ao horário de término.");
      return;
    }

    if (startDateTime < new Date()) {
      setErrorMessage("Não é possível agendar uma reserva em data ou horário que já passou.");
      return;
    }

    try {
      setIsSubmitting(true);
      await reservationService.create({
        leisureAreaId: areaId,
        startAt: startDateTime.toISOString(),
        endAt: endDateTime.toISOString(),
      });
      onSuccess();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const message = err.response?.data?.message || err.response?.data?.error;
        if (err.response?.status === 409) {
          setErrorMessage("Conflito: já existe uma reserva confirmada para esta área nesse horário.");
        } else if (message) {
          setErrorMessage(message);
        } else {
          setErrorMessage("Não foi possível criar a reserva. Verifique os dados.");
        }
      } else {
        setErrorMessage("Erro inesperado ao criar a reserva.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h2 id="modal-title">Nova Reserva</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Fechar modal">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label htmlFor="area-select">Área de Lazer</label>
          <select
            id="area-select"
            value={areaId}
            onChange={(e) => setAreaId(e.target.value)}
            disabled={isSubmitting}
            required
          >
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name} {!area.active ? "(Inativa)" : ""}
              </option>
            ))}
          </select>

          <label htmlFor="date-input">Data da Reserva</label>
          <input
            id="date-input"
            type="date"
            min={todayStr}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={isSubmitting}
            required
          />

          <div className="form-row">
            <div className="form-col">
              <label htmlFor="start-time">Horário de Início</label>
              <input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="form-col">
              <label htmlFor="end-time">Horário de Término</label>
              <input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {errorMessage && (
            <div className="login-notice error-notice" role="alert">
              {errorMessage}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Agendando..." : "Confirmar Reserva"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
