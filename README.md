# CondoReserva

Sistema web de gestão e reserva de áreas comuns em condomínios residenciais, desenvolvido na disciplina de Programação Web Avançada do curso de Análise e Desenvolvimento de Sistemas (ADS).

## Tecnologias utilizadas

- **Backend:** Node.js, TypeScript e Express.
- **Banco de dados:** PostgreSQL 16.
- **ORM:** Prisma 7.
- **Autenticação:** JWT e bcrypt.
- **Validação:** Zod.
- **Documentação:** Swagger / OpenAPI.
- **Frontend:** React 19, TypeScript, Vite e Axios.
- **Biblioteca compartilhada:** TypeScript e Zod.
- **Infraestrutura:** Docker e npm workspaces.

## Estrutura do projeto

O projeto utiliza uma arquitetura de monorepo, organizada em três workspaces:

```text
Condo_Reserva/
├── api/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── seed.ts
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── database/
│       ├── middlewares/
│       ├── repositories/
│       ├── routes/
│       ├── services/
│       ├── types/
│       └── utils/
├── frontend/
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       └── types/
├── shared/
│   └── src/
│       └── schemas/
├── docker-compose.yml
└── package.json
```

- **api:** Backend responsável pelas regras de negócio, autenticação, persistência e validações.
- **frontend:** Interface web e gerenciamento da autenticação e navegação.
- **shared:** Tipos e schemas de validação compartilhados entre frontend e backend.

## Funcionalidades

### Backend

- Autenticação de usuários com JWT.
- Controle de acesso por perfil (`ADMIN` e `RESIDENT`).
- Gerenciamento de apartamentos e moradores.
- Gerenciamento de áreas de lazer.
- Criação, consulta, atualização e cancelamento de reservas.
- Validação de conflitos de horários.
- Validação de dados com Zod.
- Documentação interativa dos endpoints com Swagger.

### Frontend

- Tela de login.
- Gerenciamento global da autenticação com `AuthContext`.
- Persistência da sessão com JWT.
- Rotas protegidas conforme o perfil do usuário.
- Cliente HTTP centralizado com Axios e interceptors.

## Como executar o projeto

### 1. Pré-requisitos

- Node.js.
- npm.
- Docker e Docker Compose.

### 2. Clonar e instalar dependências

Na raiz do projeto:

```bash
git clone <URL_DO_REPOSITORIO>
cd Condo_Reserva
npm install
```

### 3. Configurar o banco de dados

Inicie o PostgreSQL com Docker:

```bash
docker compose up -d
```

O banco estará disponível em `localhost:5433`.

### 4. Configurar variáveis de ambiente

Crie o arquivo `.env` da API:

```bash
cp api/.env.example api/.env
```

Configure as variáveis:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/condo_reserva"

JWT_SECRET="SUA_CHAVE_SECRETA"

ADMIN_NAME="Administrador"
ADMIN_EMAIL="admin@condoreserva.com"
ADMIN_PASSWORD="SUA_SENHA_SEGURA"
```

Altere a senha padrão do administrador e utilize uma chave JWT segura antes de executar o projeto.

No Linux, uma chave pode ser gerada com:

```bash
openssl rand -hex 32
```

### 5. Preparar o banco de dados

Entre na pasta da API:

```bash
cd api
```

Gere o Prisma Client:

```bash
npx prisma generate
```

Execute as migrations:

```bash
npx prisma migrate dev
```

Crie ou verifique o usuário administrador:

```bash
npm run seed
```

O administrador será criado com as credenciais definidas no `.env`. A execução do seed novamente não cria usuários duplicados.

Retorne à raiz:

```bash
cd ..
```

### 6. Compilar a biblioteca compartilhada

Antes de iniciar a API, compile o workspace `shared`:

```bash
npm run build:shared
```

### 7. Executar o backend

Em um terminal, na raiz do projeto:

```bash
npm run dev:api
```

A API estará disponível em:

`http://localhost:3000`

### 8. Executar o frontend

Em outro terminal, na raiz do projeto:

```bash
npm run dev:frontend
```

A aplicação estará disponível em:

`http://localhost:5173`

## Documentação da API

A documentação interativa dos endpoints está disponível através do Swagger:

`http://localhost:3000/docs`

A interface permite consultar os endpoints, visualizar os parâmetros e testar requisições autenticadas utilizando o token JWT.

## Scripts disponíveis

Na raiz do projeto:

| Comando | Descrição |
|---|---|
| `npm install` | Instala as dependências dos workspaces |
| `npm run build` | Compila todos os workspaces |
| `npm run build:shared` | Compila a biblioteca compartilhada |
| `npm run build:api` | Compila o backend |
| `npm run build:frontend` | Compila o frontend |
| `npm run dev:api` | Inicia o backend em desenvolvimento |
| `npm run dev:frontend` | Inicia o frontend em desenvolvimento |

Na pasta `api`:

| Comando | Descrição |
|---|---|
| `npx prisma generate` | Gera o Prisma Client |
| `npx prisma migrate dev` | Executa as migrations |
| `npm run seed` | Cria ou verifica o administrador |
| `npm run build` | Compila a API |

## Perfis de acesso

- **ADMIN:** gerencia moradores, apartamentos, áreas de lazer e reservas.
- **RESIDENT:** consulta áreas de lazer, realiza reservas e gerencia suas próprias reservas.
