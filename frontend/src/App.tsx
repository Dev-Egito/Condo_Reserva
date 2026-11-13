import { useState } from "react";

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
        <path d="m384 218 19 10v35l-19-10z" fill="#17385f" />
      </g>

      <path d="m80 291 191-101 187 94-193 104z" fill="#d5e5fb" />
      <path d="m99 291 171-91 166 84-173 93z" fill="url(#court)" />
      <path d="m115 291 155-82 148 75-155 83z" fill="none" stroke="#fff" strokeWidth="3" />
      <path d="m270 209v158m-77-117 154 78m-111-100 143 71m-210-49 155 79m-92-105v158" fill="none" stroke="#fff" strokeWidth="2" />
      <path d="m202 249 139 70" fill="none" stroke="#fff" strokeWidth="3" />
      <path d="m198 245 4 2v22l-4-2zm145 72 4 2v21l-4-2z" fill="#20354b" />
      <path d="m201 246 143 71" stroke="#fff" strokeDasharray="2 2" strokeWidth="2" />

      <path d="m389 221 82-43 72 36-83 45z" fill="#d4e4f9" />
      <path d="m403 217 68-36 60 30-69 37z" fill="#74bfce" />
      <path d="m412 217 59-31 51 25-60 32z" fill="#a5dce1" />
      <path d="m430 211 41-21 34 17-42 23z" fill="none" stroke="#effcff" strokeWidth="2" />
      <path d="m470 190v52m-30-35 60 29" stroke="#e8faff" strokeWidth="2" opacity=".9" />

      {[
        [102, 235], [131, 247], [310, 187], [337, 199], [493, 184], [524, 197],
      ].map(([x, y], index) => (
        <g key={`tree-${index}`}>
          <path d={`M${x} ${y + 23}v19`} stroke="#9c806e" strokeWidth="5" />
          <ellipse cx={x} cy={y + 10} rx="15" ry="19" fill={index % 2 ? "#87b8ae" : "#75a99e"} />
          <ellipse cx={x + 10} cy={y + 17} rx="11" ry="13" fill="#9bc7ba" />
        </g>
      ))}
    </svg>
  );
}

function App() {
  const [profile, setProfile] = useState<"resident" | "staff">("resident");
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("Esta tela é uma demonstração. A autenticação ainda não está disponível.");
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
          <p className="login-subtitle">Entre para gerenciar suas reservas.</p>

          <div className="profile-tabs" role="tablist" aria-label="Tipo de acesso">
            <button
              className={profile === "resident" ? "selected" : ""}
              type="button"
              role="tab"
              aria-selected={profile === "resident"}
              onClick={() => setProfile("resident")}
            >
              Morador
            </button>
            <button
              className={profile === "staff" ? "selected" : ""}
              type="button"
              role="tab"
              aria-selected={profile === "staff"}
              onClick={() => setProfile("staff")}
            >
              Porteiro / Administrador
            </button>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email">{profile === "resident" ? "E-mail ou CPF" : "E-mail"}</label>
            <input
              autoComplete="username"
              id="email"
              name="email"
              placeholder={profile === "resident" ? "seu.email@exemplo.com" : "seu.email@condominio.com"}
              type="text"
            />

            <label htmlFor="password">Senha</label>
            <div className="password-field">
              <input
                autoComplete="current-password"
                id="password"
                name="password"
                placeholder="Digite sua senha"
                type={showPassword ? "text" : "password"}
              />
              <button
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="password-toggle"
                onClick={() => setShowPassword((visible) => !visible)}
                type="button"
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c5.5 0 9 7 9 7a15.7 15.7 0 0 1-3.1 3.8M6.2 6.2C3.9 7.7 3 12 3 12s3.5 7 9 7a9.9 9.9 0 0 0 4.1-.9" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" /><circle cx="12" cy="12" r="2.5" /></svg>
                )}
              </button>
            </div>

            {notice && <p className="login-notice" role="status">{notice}</p>}
            <button className="submit-button" type="submit">Entrar</button>
            <p className="secure-note">Acesso seguro e exclusivo para o seu condomínio.</p>
          </form>
        </div>

        <footer className="login-footer">
          <span>© 2025 CondoReserva</span>
          <span>Ambiente demonstrativo · dados de exemplo</span>
        </footer>
      </section>
    </main>
  );
}

export default App;
