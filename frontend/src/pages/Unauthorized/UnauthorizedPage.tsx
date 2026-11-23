import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const UnauthorizedPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleReturn() {
    if (user?.role === "ADMIN") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  }

  return (
    <div className="unauthorized-page">
      <div className="unauthorized-card">
        <h1>403</h1>
        <h2>Acesso Não Autorizado</h2>
        <p>Você não possui privilégios para acessar a página solicitada com seu perfil atual.</p>
        <button className="submit-button" onClick={handleReturn} type="button">
          Voltar ao meu painel
        </button>
      </div>
    </div>
  );
};
