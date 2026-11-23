import React from "react";
import { useAuth } from "../../contexts/AuthContext";

export const AdminDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
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

      <main className="dashboard-content">
        <section className="welcome-banner admin-banner">
          <h1>Painel Administrativo 🏢</h1>
          <p>
            Gerenciamento geral de moradores, áreas de lazer e supervisão de agendamentos do condomínio.
          </p>
        </section>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Moradores</h3>
            <p>Cadastre novos moradores e consulte os apartamentos.</p>
            <div className="card-placeholder">Gestão completa de moradores e usuários.</div>
          </div>

          <div className="dashboard-card">
            <h3>Áreas de Lazer</h3>
            <p>Gerencie áreas, capacidades e status de manutenção.</p>
            <div className="card-placeholder">Cadastro e controle de status das áreas.</div>
          </div>

          <div className="dashboard-card">
            <h3>Todas as Reservas</h3>
            <p>Acompanhe e filtre reservas de todo o condomínio.</p>
            <div className="card-placeholder">Visão unificada das reservas.</div>
          </div>
        </div>
      </main>
    </div>
  );
};
