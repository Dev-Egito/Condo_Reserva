import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { loginSchema, createResidentSchema } from "shared";
import { residentService } from "../../services/residentService";
import { Apartment } from "../../types/models";
import { isAxiosError } from "axios";

function CondoIllustration() {
  return (
    <svg
      className="condo-illustration"
      viewBox="0 0 640 410"
      role="img"
      aria-label="Ilustração de um condomínio com quadra esportiva e piscina"
    >
      <defs>
        <linearGradient id="court" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#3c7ce4" />
          <stop offset="1" stopColor="#2361c2" />
        </linearGradient>
        <linearGradient id="tower" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#e9f1fb" />
        </linearGradient>
      </defs>

      <path d="m44 273 285-152 270 134-284 139z" fill="#d2e3fa" />
      <path d="m65 270 267-141 235 119-267 142z" fill="#f8fbff" />
      <path d="m102 261 238-126 207 103-241 130z" fill="#e1edfb" />
      <path d="m72 277 252 132 256-137-253-127z" fill="#d4e5fb" opacity=".8" />

      <g>
        <path d="m171 101 81-43 81 39-82 45z" fill="#c6d9f3" />
        <path d="m171 101 80 41v156l-80-43z" fill="url(#tower)" />
        <path d="m251 142 82-45v155l-82 46z" fill="#f8fbff" />
        <path d="m171 101 81-43 81 39-82 45z" fill="#f4f8ff" stroke="#d3e2f5" strokeWidth="5" />
        <path d="m192 101 59-31 57 29-59 32z" fill="#e3efff" stroke="#d2e1f5" strokeWidth="3" />
        {Array.from({ length: 5 }, (_, row) => (
          <g key={`first-${row}`}>
            <path d={`m185 ${125 + row * 25} 18 9v19l-18-9z`} fill="#163558" />
            <path d={`m216 ${141 + row * 25} 17 9v19l-17-9z`} fill="#17375b" />
            <path d={`m270 ${136 + row * 24} 17-9v19l-17 9z`} fill="#17385f" />
            <path d={`m300 ${120 + row * 24} 17-9v19l-17 9z`} fill="#3475d2" />
          </g>
        ))}
        <path d="m207 246 18 9v35l-18-9z" fill="#2d6bcc" />
        <path d="m255 142 7-4v153l-7 4z" fill="#d7e5f7" />
      </g>

      <g>
        <path d="m326 75 82-43 79 39-81 45z" fill="#c6d9f3" />
        <path d="m326 75 80 41v153l-80-41z" fill="url(#tower)" />
        <path d="m406 116 81-45v154l-81 44z" fill="#f8fbff" />
        <path d="m326 75 82-43 79 39-81 45z" fill="#f4f8ff" stroke="#d3e2f5" strokeWidth="5" />
        <path d="m347 76 60-31 55 27-59 32z" fill="#e3efff" stroke="#d2e1f5" strokeWidth="3" />
        {Array.from({ length: 5 }, (_, row) => (
          <g key={`second-${row}`}>
            <path d={`m341 ${99 + row * 25} 18 9v18l-18-9z`} fill="#17385f" />
            <path d={`m371 ${115 + row * 25} 18 9v18l-18-9z`} fill="#17385f" />
            <path d={`m425 ${110 + row * 24} 17-9v19l-17 9z`} fill="#3475d2" />
            <path d={`m456 ${94 + row * 24} 17-9v19l-17 9z`} fill="#3475d2" />
          </g>
        ))}
        <path d="m362 219 18 9v36l-18-10z" fill="#2d6bcc" />
        <path d="m410 115 8-4v152l-8 4z" fill="#d7e5f7" />
      </g>

      <path d="m142 308 198 83 238-124-210-72z" fill="#9ec5ff" />
      <path d="m183 312 165 67 197-104-169-58z" fill="url(#court)" />
      <path d="m202 312 153 62 166-88-154-53z" fill="none" stroke="#e8f2ff" strokeWidth="2.5" />
      <path d="m278 281 161 63" fill="none" stroke="#e8f2ff" strokeWidth="2" />
      <path d="m354 266v115" fill="none" stroke="#fff" strokeWidth="3" opacity=".9" />
      <ellipse cx="355" cy="324" rx="22" ry="12" fill="none" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Modo: Login ou Cadastro de Morador
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [profile, setProfile] = useState<"resident" | "staff">("resident");

  // Campos de Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Campos de Cadastro
  const [regFullName, setRegFullName] = useState("");
  const [regCpf, setRegCpf] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regAptId, setRegAptId] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [apartments, setApartments] = useState<Apartment[]>([]);

  // Notificações de Erro e Sucesso
  const [errorNotice, setErrorNotice] = useState("");
  const [successNotice, setSuccessNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregar lista de apartamentos para o select de cadastro
  useEffect(() => {
    if (authMode === "register") {
      residentService
        .getPublicApartments()
        .then((data) => {
          setApartments(data);
          if (data.length > 0 && !regAptId) {
            setRegAptId(data[0].id);
          }
        })
        .catch(() => {
          setErrorNotice("Não foi possível carregar a lista de apartamentos.");
        });
    }
  }, [authMode, regAptId]);

  // Se já estiver autenticado, redireciona para a página correspondente
  if (!isLoading && isAuthenticated && user) {
    const destination = user.role === "ADMIN" ? "/admin" : "/dashboard";
    return <Navigate to={destination} replace />;
  }

  // Submissão do Login
  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorNotice("");
    setSuccessNotice("");

    // Validação com safeParse do Zod (Requisito obrigatório da disciplina)
    const validation = loginSchema.safeParse({ email: email.trim(), password });
    if (!validation.success) {
      const errorMsg = validation.error.issues.map((i) => i.message).join("; ");
      setErrorNotice(errorMsg);
      return;
    }

    try {
      setIsSubmitting(true);
      const loggedUser = await login(email, password);

      const fromPath = (location.state as { from?: { pathname?: string } })?.from?.pathname;
      if (fromPath && fromPath !== "/login") {
        navigate(fromPath, { replace: true });
      } else {
        const targetPath = loggedUser.role === "ADMIN" ? "/admin" : "/dashboard";
        navigate(targetPath, { replace: true });
      }
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const apiMessage = err.response?.data?.message || err.response?.data?.error;
        if (apiMessage) {
          setErrorNotice(apiMessage);
        } else if (err.code === "ERR_NETWORK") {
          setErrorNotice("Não foi possível conectar ao servidor. Verifique se o backend está em execução.");
        } else {
          setErrorNotice("E-mail ou senha inválidos. Tente novamente.");
        }
      } else {
        setErrorNotice("Ocorreu um erro inesperado ao realizar o login.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // Submissão do Cadastro de Morador
  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorNotice("");
    setSuccessNotice("");

    const payload = {
      fullName: regFullName.trim(),
      cpf: regCpf.trim(),
      phone: regPhone.trim(),
      apartmentId: regAptId,
      email: regEmail.trim(),
      password: regPassword,
    };

    // Validação com safeParse do Zod (Requisito obrigatório da disciplina)
    const validation = createResidentSchema.safeParse(payload);
    if (!validation.success) {
      const errorMsg = validation.error.issues.map((i) => i.message).join("; ");
      setErrorNotice(errorMsg);
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await residentService.register(payload);
      setSuccessNotice(result.message || "Cadastro realizado com sucesso! Faça login com seu e-mail e senha.");
      setEmail(regEmail.trim());
      setAuthMode("login");
      setRegFullName("");
      setRegCpf("");
      setRegPhone("");
      setRegPassword("");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const apiMessage = err.response?.data?.message || err.response?.data?.error;
        setErrorNotice(apiMessage || "Erro ao realizar o cadastro. Verifique os dados.");
      } else {
        setErrorNotice("Ocorreu um erro inesperado ao realizar o cadastro.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="welcome-panel" aria-label="Sobre o CondoReserva">
        <CondoIllustration />
        <p className="welcome-message">
          O lugar certo para organizar os espaços
          <br />
          e aproveitar o melhor do seu condomínio.
        </p>
        <p className="welcome-caption">
          SIMPLES PARA QUEM RESERVA. COMPLETO PARA QUEM GERENCIA.
        </p>
      </section>

      <section className="form-panel">
        <div className="login-content">
          <h1>
            Bem-vindo ao
            <br />
            CondoReserva
          </h1>
          <p className="login-subtitle">
            {authMode === "login"
              ? "Entre para gerenciar suas reservas."
              : "Cadastre-se para solicitar acesso e reservar espaços."}
          </p>

          {/* Abas: Entrar vs Cadastrar-se */}
          <div className="auth-mode-switch" role="tablist">
            <button
              type="button"
              className={`auth-mode-btn ${authMode === "login" ? "active" : ""}`}
              onClick={() => {
                setAuthMode("login");
                setErrorNotice("");
                setSuccessNotice("");
              }}
            >
              Entrar
            </button>
            <button
              type="button"
              className={`auth-mode-btn ${authMode === "register" ? "active" : ""}`}
              onClick={() => {
                setAuthMode("register");
                setErrorNotice("");
                setSuccessNotice("");
              }}
            >
              Criar Conta (Novo Morador)
            </button>
          </div>

          {/* Formulário de Login */}
          {authMode === "login" && (
            <>
              <div className="profile-tabs" role="tablist" aria-label="Tipo de acesso">
                <button
                  className={profile === "resident" ? "selected" : ""}
                  type="button"
                  role="tab"
                  aria-selected={profile === "resident"}
                  onClick={() => {
                    setProfile("resident");
                    setErrorNotice("");
                  }}
                >
                  Morador
                </button>
                <button
                  className={profile === "staff" ? "selected" : ""}
                  type="button"
                  role="tab"
                  aria-selected={profile === "staff"}
                  onClick={() => {
                    setProfile("staff");
                    setErrorNotice("");
                  }}
                >
                  Porteiro / Administrador
                </button>
              </div>

              <form className="login-form" onSubmit={handleLogin}>
                <label htmlFor="email">
                  {profile === "resident" ? "E-mail de morador" : "E-mail administrativo"}
                </label>
                <input
                  autoComplete="username"
                  id="email"
                  name="email"
                  placeholder={profile === "resident" ? "joao.silva@condoreserva.com" : "admin@condoreserva.com"}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                />

                <label htmlFor="password">Senha</label>
                <div className="password-field">
                  <input
                    autoComplete="current-password"
                    id="password"
                    name="password"
                    placeholder="Digite sua senha"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                  <button
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    className="password-toggle"
                    onClick={() => setShowPassword((visible) => !visible)}
                    type="button"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                        <path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c5.5 0 9 7 9 7a15.7 15.7 0 0 1-3.1 3.8M6.2 6.2C3.9 7.7 3 12 3 12s3.5 7 9 7a9.9 9.9 0 0 0 4.1-.9" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                        <circle cx="12" cy="12" r="2.5" />
                      </svg>
                    )}
                  </button>
                </div>

                {successNotice && (
                  <p className="login-notice success-notice" role="status">
                    {successNotice}
                  </p>
                )}

                {errorNotice && (
                  <p className="login-notice error-notice" role="alert">
                    {errorNotice}
                  </p>
                )}

                <button className="submit-button" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Entrando..." : "Entrar"}
                </button>
                <p className="secure-note">Acesso seguro e exclusivo para o seu condomínio.</p>
              </form>
            </>
          )}

          {/* Formulário de Cadastro de Morador */}
          {authMode === "register" && (
            <form className="login-form" onSubmit={handleRegister}>
              <label htmlFor="regFullName">Nome Completo</label>
              <input
                id="regFullName"
                type="text"
                placeholder="Ex: Carlos Eduardo de Souza"
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                disabled={isSubmitting}
                required
              />

              <div className="form-row">
                <div className="form-col">
                  <label htmlFor="regCpf">CPF</label>
                  <input
                    id="regCpf"
                    type="text"
                    placeholder="12345678901"
                    value={regCpf}
                    onChange={(e) => setRegCpf(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div className="form-col">
                  <label htmlFor="regPhone">Telefone</label>
                  <input
                    id="regPhone"
                    type="text"
                    placeholder="(83) 99999-8888"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              <label htmlFor="regApt">Apartamento Vinculado</label>
              <select
                id="regApt"
                style={{
                  width: "100%",
                  height: "48px",
                  marginBottom: "20px",
                  borderRadius: "8px",
                  border: "1px solid #dfe5ec",
                  padding: "0 12px",
                  fontSize: "14px",
                  background: "#fff",
                }}
                value={regAptId}
                onChange={(e) => setRegAptId(e.target.value)}
                disabled={isSubmitting}
                required
              >
                {apartments.length === 0 && <option value="">Carregando apartamentos...</option>}
                {apartments.map((a) => (
                  <option key={a.id} value={a.id}>
                    Bloco {a.block} — Apto {a.number}
                  </option>
                ))}
              </select>

              <label htmlFor="regEmail">E-mail para Acesso</label>
              <input
                id="regEmail"
                type="email"
                placeholder="seu.email@exemplo.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />

              <label htmlFor="regPassword">Senha (Mínimo 8 caracteres)</label>
              <input
                id="regPassword"
                type="password"
                placeholder="********"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                disabled={isSubmitting}
                required
              />

              {errorNotice && (
                <p className="login-notice error-notice" role="alert">
                  {errorNotice}
                </p>
              )}

              <button className="submit-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Cadastrando..." : "Concluir Cadastro"}
              </button>
              <p className="secure-note">Suas informações são protegidas e validadas via Zod & bcrypt.</p>
            </form>
          )}
        </div>

        <footer className="login-footer">
          <span>© 2025 CondoReserva</span>
          <span>Ambiente do condomínio · Sistema autenticado</span>
        </footer>
      </section>
    </main>
  );
};
