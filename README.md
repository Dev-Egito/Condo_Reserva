# CondoReserva

> 🎥 **Vídeo da Apresentação do Projeto:**  
> **[Clique aqui para assistir ao vídeo no YouTube](COLOQUE_O_LINK_DO_SEU_VIDEO_AQUI)** *(Link não listado ou Google Drive com permissão pública)*

---

## 👥 Integrantes da Equipe

| Nome Completo | RGM | Atribuição / O que fez no projeto |
| **Jonathan Batista Santos** | `46013989` | Modelagem relacional no Prisma, Migrations, Seed do banco e Swagger. |
| **Matheus Henrique do Egito Barbosa** | `42930979` | Frontend React (rotas protegidas, painel de administração e morador). |
| **Fernando Augusto Lustoza Figueirôa** | `42266491` | Pacote compartilhado Zod (`shared`) e integração Axios. |

---

## 🏢 Tema e Modelagem do Banco de Dados

O **CondoReserva** é um sistema web full stack para gestão de condomínios residenciais. Ele gerencia as unidades habitacionais, os moradores cadastrados e o agendamento de áreas de lazer comuns (churrasqueira, salão de festas, piscina, quadra poliesportiva), impedindo conflitos de horários em reservas e aplicando controle de acesso (RBAC).

### Tabelas e Relacionamentos no Banco (`schema.prisma`):

1. **`User` (Tabela de Login do Sistema):**
   - Campos: `id`, `name`, `email` (`@unique`), `passwordHash`, `role` (`ADMIN` \| `RESIDENT`), `createdAt`, `updatedAt`.
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
   - Campos: `id`, `residentId`, `leisureAreaId`, `startAt`, `endAt`, `status` (`CONFIRMED` \| `CANCELLED`), `createdAt`, `updatedAt`.
   - Relações:
     - `residentId → Resident.id` (`onDelete: Restrict`)
     - `leisureAreaId → LeisureArea.id` (`onDelete: Restrict`)
   - Na listagem de reservas, inclui os nomes das entidades vinculadas (`include` no Prisma trazendo `resident.fullName`, `apartment.block`, `apartment.number` e `leisureArea.name`).

---

## 🔑 Credenciais do Seed para Acesso ao Sistema

O banco de dados já vem populado pelo `seed.ts` com as seguintes contas prontas para teste:

| Perfil | E-mail | Senha | Destino após login |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@condoreserva.com` | `12345678` | Painel Administrativo (`/admin`) |
| **Morador 1** | `joao.silva@condoreserva.com` | `morador123` | Painel do Morador (`/dashboard`) |
| **Morador 2** | `maria.oliveira@condoreserva.com` | `morador123` | Painel do Morador (`/dashboard`) |

---

## 🚀 Como Rodar o Projeto do Zero (Passo a Passo)

### 1. Pré-requisitos
- **Node.js** (v18+) e **npm**
- **Docker** e **Docker Desktop** em execução

### 2. Clonar o repositório e instalar dependências
Na raiz do projeto clonado:
```bash
git clone <URL_DO_REPOSITORIO>
cd Condo_Reserva
npm install
```
*(O comando `npm install` na raiz instala automaticamente as dependências de todos os 3 pacotes: `shared`, `api` e `frontend`).*

### 3. Subir o Banco de Dados PostgreSQL no Docker
```bash
docker compose up -d
```
*(O PostgreSQL estará rodando no container mapeado para a porta `5433`).*

### 4. Configurar as variáveis de ambiente da API
Copie o arquivo de exemplo para criar o `.env`:
```bash
cp api/.env.example api/.env
```
*(No Windows PowerShell, pode usar `Copy-Item api/.env.example api/.env`).*

O arquivo `api/.env` já vem pré-configurado para a porta `5433`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/condo_reserva"
JWT_SECRET="67823a71c2309cb9fe3bf73348c217b3923f8db124a1eef350bd88bbae07a2e5"
ADMIN_NAME="Administrador"
ADMIN_EMAIL="admin@condoreserva.com"
ADMIN_PASSWORD="12345678"
```

### 5. Executar as Migrations e o Seed do Banco
Na pasta da API:
```bash
cd api
npx prisma migrate dev
npm run seed
cd ..
```

### 6. Executar a Aplicação

Em um terminal (na raiz do projeto):
```bash
npm run dev:api
```
*API rodando em:* `http://localhost:3001`  
*Documentação Swagger em:* `http://localhost:3001/docs/`

Em outro terminal (na raiz do projeto):
```bash
npm run dev:frontend
```
*Aplicação Web rodando em:* `http://localhost:5173`

---

## 🛠️ Validação dos Builds

Para certificar que não há erros de compilação ou TypeScript:
```bash
npm run build -w api
npm run build -w frontend
```

Ambos terminam com sucesso e **0 erros** de compilação.

---

## 📖 Funcionalidades Implementadas

### Backend (`api`)
- Arquitetura em 4 camadas: `routes → controllers → services → repositories`.
- CRUD completo das 4 tabelas de domínio (`Apartment`, `Resident`, `LeisureArea`, `Reservation`).
- Autenticação e auto-cadastro de morador com `bcrypt` (senha nunca exposta nas respostas).
- Validação com **Zod** em todo `POST` e `PUT` através de middleware centralizado `validateBody`.
- Tratamento de conflito de chave única (`P2002` tratado com status `409` e mensagem clara).
- Documentação interativa via **Swagger** em `/docs`.

### Frontend (`frontend`)
- Telas de **Login** e **Cadastro de Morador** validadas antes do envio usando `safeParse` dos schemas do `shared`.
- Painel Administrativo com abas para cada uma das 4 tabelas:
  - Listagem dos registros com `useEffect`.
  - **Cria e edita no mesmo modal** (com pré-carregamento dos dados para `PUT`).
  - **Remove pedindo confirmação** (`window.confirm`).
- Seleção de chaves estrangeiras via `<select>` dinâmico (escolha de apartamento e área de lazer).
- **Busca por texto em tempo real** usando `.filter()` em todas as tabelas.
- Cliente **Axios** centralizado com interceptor para injeção automática de `Authorization: Bearer <token>`.
