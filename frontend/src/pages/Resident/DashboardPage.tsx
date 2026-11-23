import React from "react";
import { useAuth } from "../../contexts/AuthContext";

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
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

      <main className="dashboard-content">
        <section className="welcome-banner">
          <h1>Olá, {user?.name?.split(" ")[0]}! 👋</h1>
          <p>
            Bem-vindo ao portal de reservas. Aqui você pode consultar as áreas de lazer e agendar seus horários com praticidade.
          </p>
        </section>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Minhas Reservas</h3>
            <p>Consulte seu histórico e gerencie as datas reservadas.</p>
            <div className="card-placeholder">Nenhuma reserva ativa no momento.</div>
          </div>

          <div className="dashboard-card">
            <h3>Áreas de Lazer</h3>
            <p>Confira as instalações disponíveis para utilização.</p>
            <div className="card-placeholder">Piscina, Churrasqueira, Salão de Festas, Quadra.</div>
          </div>
        </div>
      </main>
    </div>
  );
};
