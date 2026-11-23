# Condo_Reserva

Sistema de gestão e reserva de áreas comuns em condomínios residenciais.
Projeto desenvolvido na disciplina de Programação Web Avançada (ADS).

## Estrutura do Monorepo

O projeto é organizado utilizando `npm workspaces`:

* `api`: Backend em Node.js com TypeScript, Express e Prisma ORM (PostgreSQL).
* `frontend`: Interface SPA desenvolvida com React 19, TypeScript, Vite e Axios.
* `shared`: Biblioteca compartilhada de tipos e esquemas de validação.

## Funcionalidades de Autenticação e Rotas (Frontend)

1. **Roteamento Dinâmico com React Router**:
   * Rota pública: `/login`.
   * Rota raiz `/`: Redirecionamento automático baseado na sessão ativa.
   * Rota protegida do morador: `/dashboard` (Restrita a `RESIDENT` e `ADMIN`).
   * Rota protegida da administração: `/admin` (Restrita a `ADMIN`).
   * Rota de acesso não autorizado: `/unauthorized` (com botão de retorno ao painel).
2. **Contexto de Autenticação (`AuthContext`)**:
   * Persistência de token JWT e perfil do usuário em `localStorage`.
   * Validação contínua da sessão através de consulta ao `/users/me`.
   * Funções de login e logout globais com redirecionamento de acordo com a role do usuário.
3. **Cliente HTTP Centralizado (Axios)**:
   * **Request Interceptor**: Anexa automaticamente o cabeçalho `Authorization: Bearer <token>`.
   * **Response Interceptor**: Detecta respostas `401 Unauthorized`, revoga a sessão local e redireciona o usuário para o login.

## Como Executar

### 1. Iniciar Banco de Dados
```bash
docker compose up -d
```

### 2. Configurar e Iniciar a API
```bash
cd api
# Copie o .env caso não exista
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run dev
```

### 3. Iniciar o Frontend
```bash
cd frontend
npm run dev
```
Abra o navegador no endereço indicado pelo Vite (normalmente `http://localhost:5173`).
