# CondoReserva

> 🎥 Link do video no Youtube:https://youtu.be/kStc_BUvDMs

---

## 👥 Integrantes da Equipe

| Nome Completo | RGM | Atribuição / O que fez no projeto |
|---|---|---|
| **Jonathan Batista Santos** | `46013989` | Modelagem relacional no Prisma, Migrations, Seed do banco e Swagger. |
| **Matheus Henrique do Egito Barbosa** | `42930979` | Frontend React (rotas protegidas, painel de administração e morador). |
| **Fernando Augusto Lustoza Figueirôa** | `42266491` | Pacote compartilhado Zod (`shared`) e integração Axios. |

---

## 🏢 Tema e Modelagem do Banco de Dados

O **CondoReserva** é um sistema web full stack para gestão de condomínios residenciais. Ele gerencia as unidades habitacionais, os moradores cadastrados e o agendamento de áreas de lazer comuns (churrasqueira, salão de festas, piscina, quadra poliesportiva), impedindo conflitos de horários em reservas e aplicando controle de acesso (RBAC).

### Tabelas e Relacionamentos no Banco (`schema.prisma`):

1. **`User` (Tabela de Login do Sistema):**
   - Campos: `id`, `name`, `email` (`@unique`), `passwordHash`, `role` (`ADMIN` | `RESIDENT`), `createdAt`, `updatedAt`.
   - Senhas criptografadas com `bcrypt`.

2. **`Apartment` (Unidade Habitacional):**
   - Campos: `id`, `block`, `number`, `createdAt`, `updatedAt`.
   - Restrição: `@@unique([block, number])` — impede duplicidade de número no mesmo bloco.

3. **`Resident` (Morador do Condomínio):**
   - Campos: `id`, `fullName`, `cpf` (`@unique`), `phone`, `apartmentId`, `userId` (`@unique`).
   - Relações:
     - `apartmentId → Apartment.id` (`onDelete: Restrict`)
     - `userId → User.id` (`onDelete: SetNull`)

4. **`LeisureArea` (Áreas de Lazer):**
   - Campos: `id`, `name`, `description`, `active` (`Boolean`), `createdAt`, `updatedAt`.

5. **`Reservation` (Tabela ligada a duas outras - Consulta/Agendamento):**
   - Campos: `id`, `residentId`, `leisureAreaId`, `startAt`, `endAt`, `status` (`CONFIRMED` | `CANCELLED`), `createdAt`, `updatedAt`.
   - Relações:
     - `residentId → Resident.id` (`onDelete: Restrict`)
     - `leisureAreaId → LeisureArea.id` (`onDelete: Restrict`)
   - Na listagem de reservas, inclui os nomes das entidades vinculadas (`include` no Prisma trazendo `resident.fullName`, `apartment.block`, `apartment.number` e `leisureArea.name`).

---

## 🔑 Credenciais do Seed para Acesso ao Sistema

O banco de dados pode ser populado pelo `seed.ts` com as seguintes contas para teste:

| Perfil | E-mail | Senha | Destino após login |
|---|---|---|---|
| **Administrador** | `admin@condoreserva.com` | `12345678` | Painel Administrativo (`/admin`) |
| **Morador 1** | `joao.silva@condoreserva.com` | `morador123` | Painel do Morador (`/dashboard`) |
| **Morador 2** | `maria.oliveira@condoreserva.com` | `morador123` | Painel do Morador (`/dashboard`) |

---

## 🚀 Como Rodar o Projeto

### 1. Pré-requisitos

- Docker
- Docker Compose
- Docker em execução

### 2. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd Condo_Reserva
```

### 3. Configurar as variáveis de ambiente

#### API

Copie o arquivo de exemplo:

```bash
cp api/.env.example api/.env
```

O arquivo `api/.env` contém as variáveis de ambiente utilizadas pela API e fica fora da imagem Docker.

#### Configuração do Docker

Copie o arquivo de exemplo da raiz:

```bash
cp .env.example .env
```

O arquivo `.env` da raiz configura as variáveis utilizadas pelo Docker Compose, incluindo as credenciais e o nome do banco de dados.

A configuração de conexão com o banco de dados é diferente dependendo do ambiente:

- **No host:** PostgreSQL acessível pela porta `5433`.
- **Dentro da API containerizada:** PostgreSQL acessível pelo hostname `postgres`, na porta `5432`.

O Docker Compose configura automaticamente a URL interna da conexão com o banco de dados para a API.

### 4. Subir o ambiente de desenvolvimento

Na raiz do projeto, execute:

```bash
docker compose up --build
```

O Compose:

- Inicializa o PostgreSQL.
- Aguarda o banco estar disponível por meio do healthcheck.
- Gera o Prisma Client.
- Aplica as migrations existentes com `prisma migrate deploy`.
- Inicia o backend.
- Inicia o frontend.

O seed não é executado automaticamente.

### 5. Acessar os serviços

| Serviço | Endereço |
|---|---|
| Aplicação Web | [http://localhost:5173](http://localhost:5173) |
| API | [http://localhost:3001](http://localhost:3001) |
| Swagger | [http://localhost:3001/docs/](http://localhost:3001/docs/) |
| PostgreSQL (host) | `localhost:5433` |

### 6. Popular o banco de dados, quando necessário

Com os containers em execução, abra outro terminal na raiz do projeto e execute:

```bash
docker compose exec api npm run seed --workspace=api
```

Esse comando executa o seed manualmente, populando o banco de dados com os registros necessários para testes.

### 7. Encerrar os containers

Para encerrar os serviços sem remover os dados do banco:

```bash
docker compose down
```

O volume persistente do PostgreSQL é mantido, permitindo que os dados continuem disponíveis quando os containers forem iniciados novamente.

---

## 🛠️ Validação dos Builds

Para certificar que não há erros de compilação ou TypeScript:

```bash
npm run build -w api
npm run build -w frontend
```

Ambos terminam com sucesso quando não há erros de compilação.

---

## 📖 Funcionalidades Implementadas

### Backend (`api`)

- Arquitetura em 4 camadas: `routes → controllers → services → repositories`.
- CRUD completo das 4 tabelas de domínio (`Apartment`, `Resident`, `LeisureArea`, `Reservation`).
- Autenticação e auto-cadastro de morador com `bcrypt` (senha nunca exposta nas respostas).
- Validação com **Zod** em todo `POST` e `PUT` através de middleware centralizado `validateBody`.
- Tratamento de conflito de chave única (`P2002` tratado com status `409` e mensagem clara).
- Documentação interativa via **Swagger** em `/docs`.
- Gerenciamento de reservas, incluindo criação, edição, cancelamento e validação de conflitos de horários.

### Frontend (`frontend`)

- Telas de **Login** e **Cadastro de Morador** validadas antes do envio usando `safeParse` dos schemas do `shared`.
- Painel Administrativo com abas para cada uma das 4 tabelas:
  - Listagem dos registros com `useEffect`.
  - **Cria e edita no mesmo modal** (com pré-carregamento dos dados para `PUT`).
  - **Remove pedindo confirmação** (`window.confirm`).
- Seleção de chaves estrangeiras via `<select>` dinâmico (escolha de apartamento e área de lazer).
- **Busca por texto em tempo real** usando `.filter()` em todas as tabelas.
- Cliente **Axios** centralizado com interceptor para injeção automática de `Authorization: Bearer <token>`.
- Rotas protegidas de acordo com o perfil de acesso.
- Painel do morador para gerenciamento e consulta de reservas.

---

## 🐳 Ambiente Docker de Desenvolvimento

O projeto possui um ambiente de desenvolvimento containerizado utilizando Docker Compose.

### Containers

- **PostgreSQL:** banco de dados relacional.
- **API:** backend Node.js com TypeScript, Express e Prisma.
- **Frontend:** aplicação React com Vite.

### Persistência

O banco de dados utiliza um volume Docker externo para persistência.

Os containers podem ser encerrados e recriados sem que os dados do banco sejam apagados, desde que o volume persistente não seja removido.

### Configurações

- PostgreSQL: porta `5433` no host e `5432` internamente.
- API: porta `3001`.
- Frontend: porta `5173`.
- Prisma migrations aplicadas automaticamente na inicialização da API.
- Seed executado manualmente.

### Comandos úteis

Subir o ambiente:

```bash
docker compose up --build
```

Subir em segundo plano:

```bash
docker compose up --build -d
```

Visualizar logs:

```bash
docker compose logs -f
```

Visualizar logs da API:

```bash
docker compose logs -f api
```

Visualizar logs do banco:

```bash
docker compose logs -f postgres
```

Encerrar o ambiente:

```bash
docker compose down
```

---

## 📌 Observações

- Não execute `docker compose down -v`, pois esse comando remove os volumes e pode apagar os dados persistidos.
- As migrations são aplicadas automaticamente na inicialização da API.
- O seed deve ser executado manualmente.
- O arquivo `api/.env` não deve ser versionado.
- O arquivo `.env` da raiz não deve ser versionado.
- Os arquivos `.env.example` são disponibilizados para facilitar a configuração do ambiente.

---

**CondoReserva — Sistema de gerenciamento e reserva de áreas de lazer condominiais.**
