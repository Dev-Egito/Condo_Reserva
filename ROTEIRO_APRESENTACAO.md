# Roteiro Oficial de Apresentação em Vídeo — CondoReserva
**Disciplina:** Programação Web Avançada — Curso de Análise e Desenvolvimento de Sistemas (ADS)  
**Projeto:** CondoReserva — Sistema de Gestão e Reserva de Áreas de Lazer em Condomínios  
**Tempo Estimado de Vídeo:** 6 a 8 minutos

---

## 1. Checklist Pré-Gravação (Antes de Apertar REC)

Antes de iniciar a gravação da tela, certifique-se de que o ambiente está preparado:

- [ ] **Docker Desktop:** Aberto e com o container `condo-reserva-postgres` ativo (porta 5433).
- [ ] **Backend (API):** Em execução (`npm run dev` na pasta `api` — porta 3000).
- [ ] **Frontend:** Em execução (`npm run dev` na pasta `frontend` — porta 5173).
- [ ] **Abas do Navegador Preparadas:**
  1. Aba 1: `http://localhost:5173/login` (Tela de Login inicial).
  2. Aba 2: `http://localhost:3000/docs/` (Documentação Swagger UI).
  3. Aba 3: `https://github.com/Dev-Egito/Condo_Reserva` (Página do repositório no GitHub).
- [ ] **VS Code Aberto:** Com a árvore de arquivos visível para a parte de explicação de código.
- [ ] **Ferramenta de Gravação Pronta:** Clipchamp (Windows), OBS Studio ou Loom com microfone configurado.

---

## 2. Tabela Rápida de Credenciais para o Vídeo

| Perfil | Aba no Login | E-mail | Senha | Objetivo no Vídeo |
| :--- | :--- | :--- | :--- | :--- |
| **Morador (João)** | *Morador* | `joao.silva@condoreserva.com` | `morador123` | Demonstrar agendamento e cancelamento de reserva |
| **Administrador** | *Porteiro / Administrador* | `admin@condoreserva.com` | `12345678` | Demonstrar gestão de moradores, apartamentos, áreas e supervisão |

---

## 3. Roteiro Cronometrado Passo a Passo

```
1. Abertura & Arquitetura (0:00 - 0:45)
       ↓
2. Espaço do Morador (0:45 - 2:30)
       ↓
3. Painel do Administrador (2:30 - 4:15)
       ↓
4. Swagger API Docs (4:15 - 5:15)
       ↓
5. Explicação Técnica do Código (5:15 - 7:00)
       ↓
6. Conclusão & Encerramento (7:00 - 7:30)
```

---

### Bloco 1: Abertura e Apresentação do Projeto (0:00 - 0:45)

* **O que mostrar na tela:** O repositório no GitHub ou a tela inicial de Login.
* **Ação:** Deixar a câmera ou tela principal em foco.
* **Fala sugerida:**
  > *"Olá, professor! Meu nome é [Seu Nome], estudante do curso de Análise e Desenvolvimento de Sistemas (ADS), e hoje apresento o projeto final da disciplina de Programação Web Avançada: o **CondoReserva**.*
  >
  > *O CondoReserva é uma solução completa para automação de reservas de espaços comuns em condomínios (como piscinas, churrasqueiras e salões de festa), eliminando conflitos de horários e simplificando o trabalho da administração e dos moradores.*
  >
  > *A aplicação foi construída em arquitetura de monorepo com npm workspaces, dividida em três pacotes principais: o **shared** com tipagens e esquemas de validação Zod, a **API** em Node.js com TypeScript e Prisma ORM sobre PostgreSQL, e o **Frontend** em React 19 com Vite, TypeScript e Axios."*

---

### Bloco 2: Demonstração do Morador — Agendamento e Cancelamento (0:45 - 2:30)

* **O que mostrar na tela:** Aba da aplicação web `http://localhost:5173/login`.
* **Ação:**
  1. Clicar na aba **"Morador"**.
  2. Preencher: `joao.silva@condoreserva.com` e senha `morador123`.
  3. Mostrar o botão do "olhinho" que oculta/mostra a senha.
  4. Clicar em **"Entrar"**.
* **Fala sugerida:**
  > *"Vamos iniciar a demonstração pelo perfil do Morador. O sistema conta com validação de credenciais via JWT e controle de acesso baseado em papéis (RBAC).*
  >
  > *Ao logar, o morador é direcionado ao seu painel exclusivo (`/dashboard`). Aqui ele visualiza suas saudações personalizadas e as opções do condomínio.*
  >
  > *Na aba **Áreas de Lazer**, vemos os cartões dos espaços disponíveis, como Piscina e Salão de Festas, com indicadores de status em tempo real."*

* **Ação de Agendamento:**
  1. Clicar em **"Reservar Este Espaço"** no cartão da Piscina (ou no botão superior **"+ Nova Reserva"**).
  2. Mostrar o modal: escolher uma data futura (explicar que o calendário bloqueia datas passadas) e definir o intervalo (ex: das 10:00 às 13:00).
  3. Clicar em **"Confirmar Reserva"**.
  4. Mostrar o aviso de sucesso e a navegação automática para a aba **"Minhas Reservas"**.
* **Fala sugerida:**
  > *"Ao agendar, o backend valida se a data não é retroativa e executa uma checagem de conflitos no banco para impedir choque de horários. A reserva é confirmada instantaneamente e já aparece na aba **Minhas Reservas** com data e horários formatados."*

* **Ação de Cancelamento:**
  1. Na reserva recém-criada, clicar no botão **"Cancelar"**.
  2. Mostrar o diálogo de confirmação (para evitar cancelamentos acidentais).
  3. Confirmar o cancelamento e mostrar o badge mudando para **"Cancelada"**.
  4. Clicar no botão **"Sair"** no topo direito.

---

### Bloco 3: Demonstração do Administrador / Portaria (2:30 - 4:15)

* **O que mostrar na tela:** Tela de Login -> Aba **"Porteiro / Administrador"**.
* **Ação:**
  1. Entrar com: `admin@condoreserva.com` | `12345678`.
  2. Entrar e demonstrar o redirecionamento automático para a rota protegida `/admin`.
* **Fala sugerida:**
  > *"Agora vamos acessar com a conta administrativa. O administrador possui acesso a uma visão executiva do condomínio, dividida em quatro módulos principais:*
  >
  > *1. **Reservas Gerais:** Aqui o síndico ou porteiro tem visão de todas as reservas do condomínio. Note que a tabela exibe o nome do morador, o bloco e o apartamento de cada reserva, permitindo cancelar ou até excluir registros de forma definitiva.*
  >
  > *2. **Áreas de Lazer:** O administrador pode cadastrar novos espaços ou alternar o status de uma área com um clique — por exemplo, colocar a piscina em manutenção, o que impede novos agendamentos pelos moradores.*
  >
  > *3. **Apartamentos:** Gestão dos blocos e números de apartamentos do condomínio.*
  >
  > *4. **Moradores:** Formulário completo para cadastrar novos condôminos, vinculando-os a um apartamento existente e já definindo suas credenciais de acesso ao sistema."*

---

### Bloco 4: Documentação Interativa com Swagger (OpenAPI 3.0) (4:15 - 5:15)

* **O que mostrar na tela:** Aba do Swagger `http://localhost:3000/docs/`.
* **Ação:**
  1. Rolar pela página mostrando as categorias: *Autenticação*, *Usuários*, *Apartamentos*, *Moradores*, *Áreas de lazer* e *Reservas*.
  2. Abrir o endpoint **`GET /reservations/me`** e o **`POST /auth/login`**.
* **Fala sugerida:**
  > *"Um dos requisitos fundamentais de uma API profissional é a documentação. Toda a API do CondoReserva foi documentada com OpenAPI 3.0 e Swagger UI interativo.*
  >
  > *Todas as rotas possuem contratos claros de entrada e saída, tipagem estrita com schemas Zod, tratamentos de código HTTP (200, 201, 400, 401, 403, 409) e suporte completo a autenticação Bearer JWT através do botão Authorize."*

---

### Bloco 5: Explicação Técnica do Código (5:15 - 7:00)

* **O que mostrar na tela:** VS Code aberto com os arquivos do projeto.

#### 1. Banco de Dados e Modelagem (`api/prisma/schema.prisma`)
* **Mostrar:** O arquivo do Prisma com os modelos `User`, `Resident`, `Apartment`, `LeisureArea`, `Reservation`.
* **Fala:**
  > *"No backend, utilizamos o Prisma ORM sobre PostgreSQL. A modelagem garante integridade relacional, com relacionamentos de chave estrangeira entre Morador e Apartamento, e Reservas com moradores e áreas de lazer."*

#### 2. Regras de Negócio e Prevenção de Conflitos (`api/src/services/reservationService.ts`)
* **Mostrar:** O método `findConfirmedConflict` e a validação de datas.
* **Fala:**
  > *"No `reservationService`, implementamos a regra de ouro do sistema: a função `findConfirmedConflict`, que utiliza operadores lógicos para garantir que nenhum espaço seja reservado em períodos sobrepostos. Também validamos para impedir reservas com datas no passado e disponibilizamos o método `findMyReservations`, que busca as reservas apenas do usuário autenticado no JWT."*

#### 3. Frontend: Contexto de Autenticação e Interceptors (`frontend/src/`)
* **Mostrar:** `AuthContext.tsx`, `api.ts` e `ProtectedRoute.tsx`.
* **Fala:**
  > *"No frontend React:*
  > *- O `AuthContext.tsx` gerencia a sessão do usuário de forma global e revalida o token no `/users/me`.*
  > *- O `api.ts` utiliza interceptors do Axios para injetar automaticamente o Bearer Token e tratar deslogamento se o token expirar (código 401).*
  > *- O componente `ProtectedRoute.tsx` bloqueia o acesso direto por URL de acordo com o perfil do usuário (ADMIN vs RESIDENT)."*

---

### Bloco 6: Conclusão e Encerramento (7:00 - 7:30)

* **O que mostrar na tela:** Tela do GitHub ou a aplicação rodando.
* **Fala sugerida:**
  > *"Para finalizar, todo o desenvolvimento seguiu as melhores práticas da engenharia de software: monorepo com TypeScript estrito, Git Flow com Conventional Commits, Pull Requests revisados e mergeados na branch main com 100% de sucesso na compilação.*
  >
  > *Agradeço pela atenção e pelas aulas da disciplina. O sistema está pronto e funcional!"*

---

## 4. Resumo de Comandos Úteis para o Apresentador

Caso precise reiniciar os serviços antes de gravar:
```bash
# 1. Iniciar Banco de Dados
cd Condo_Reserva
docker compose up -d

# 2. Executar Seed das contas de teste
cd api
npx tsx prisma/seed.ts

# 3. Rodar a API
npm run dev

# 4. Rodar o Frontend (em outro terminal)
cd ../frontend
npm run dev
```
