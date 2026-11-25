# Roteiro Oficial de Gravação do Vídeo - CondoReserva
> **Disciplina:** Programação Web Avançada — 4º Período ADS  
> **Critério de Avaliação:** Vídeo com código em tela cheia (fonte legível) explicando **o que cada trecho faz e por quê**.

---

## 📋 Regras de Ouro para a Gravação
1. **Fonte grande no VS Code:** Use `Ctrl + +` para aumentar a fonte para que o professor consiga ler perfeitamente.
2. **Código em tela o tempo todo:** Não use slides para explicar o código. Mantenha o VS Code aberto e aponte com o cursor para as linhas mencionadas.
3. **Não leia código:** Explique a **responsabilidade e o motivo arquitetural** de cada trecho (o roteiro abaixo dá exatamente o que falar).
4. **Tempo estimado ideal:** Entre 8 e 12 minutos.

---

## 🎬 PARTE 1: Abertura (Critério: Integrantes e Tema)
*Tela: Mostrar o arquivo `README.md` no VS Code ou a página inicial do sistema.*

### O que falar:
> "Olá professor! Este é o vídeo de apresentação do projeto **CondoReserva**, desenvolvido para a disciplina de Programação Web Avançada.
> 
> **Tema do projeto:** É um sistema full stack para condomínios residenciais que resolve a gestão de áreas comuns (churrasqueiras, salões de festas, piscinas, quadras). Ele impede conflitos de horários em reservas e oferece um painel administrativo com controle de acesso baseado em papéis (RBAC - Admin e Morador).
> 
> **Integrantes da equipe e papéis:**
> - **[Nome do Integrante 1]**: Ficou responsável pelo backend, modelagem do Prisma e Swagger.
> - **[Nome do Integrante 2]**: Ficou responsável pelo frontend em React, telas de dashboard e autenticação.
> - **[Nome do Integrante 3]**: Ficou responsável pelo pacote compartilhado (shared) com validações em Zod e integração dos serviços Axios.
> *(Ajuste os nomes e divisões reais do seu grupo aqui)*"

---

## 🗄️ PARTE 2: Banco de Dados e Modelagem (Critério: Banco Explicado - 0,25)
*Tela: Abrir o arquivo `api/prisma/schema.prisma` com zoom.*

### 1. As Tabelas (Models)
*Aponte para as linhas do `schema.prisma`:*
- **`User` (Linha 20):** Representa as credenciais de acesso ao sistema (Admin ou Morador). Guarda `email`, `passwordHash` e o enum `Role`.
- **`Apartment` (Linha 32):** Representa as unidades habitacionais (`block` e `number`).
- **`Resident` (Linha 44):** Representa o morador cadastrado no condomínio (`fullName`, `cpf`, `phone`), associado obrigatoriamente a uma unidade e opcionalmente a um usuário de login.
- **`LeisureArea` (Linha 61):** Representa as áreas de lazer do condomínio (`name`, `description`, `active`).
- **`Reservation` (Linha 72):** Representa o agendamento de uma área, contendo início (`startAt`), término (`endAt`) e status (`CONFIRMED` ou `CANCELLED`).

### 2. Chaves Estrangeiras (`@relation`)
*Mostre onde estão os relacionamentos:*
- **Linha 54 e 55 em `Resident`:**
  - `@relation(fields: [userId], references: [id], onDelete: SetNull)`: chave estrangeira para `User`. Se o usuário for excluído, o morador não perde o histórico (fica `null`).
  - `@relation(fields: [apartmentId], references: [id], onDelete: Restrict)`: chave estrangeira para `Apartment`. O `Restrict` impede que um apartamento seja apagado se ainda houver moradores vinculados a ele.
- **Linhas 82 e 83 em `Reservation`:**
  - Chaves estrangeiras ligando a reserva ao `Resident` e à `LeisureArea`, ambas com `onDelete: Restrict` para proteger a integridade histórica dos agendamentos.

### 3. As Restrições Únicas (`@unique`)
*Mostre no código onde o banco garante integridade:*
- **Linha 23 (`User.email @unique`):** Garante que não existam dois usuários cadastrados com o mesmo e-mail.
- **Linha 47 (`Resident.cpf @unique`):** Impede a duplicação de cadastros pelo documento legal.
- **Linha 41 (`Apartment.@@unique([block, number])`):** Chave única composta. Impede a duplicação acidental do mesmo apartamento (ex: Bloco A - Apto 101 só pode existir uma vez).

### 4. Os Dados de Seed no Banco
*Tela: Abrir o arquivo `api/prisma/seed.ts` (ou mostrar o banco no terminal/DBeaver/Prisma Studio).*
> "No arquivo `seed.ts`, utilizamos o Prisma Client para popular o banco inicialmente com dados consistentes para teste: criamos o usuário administrador com senha criptografada com bcrypt, cadastramos blocos de apartamentos, moradores de exemplo com suas contas vinculadas, áreas de lazer (como Churrasqueira e Salão de Festas) e reservas iniciais."

---

## 💻 PARTE 3: Sistema Rodando na Prática (Critério: Sistema Rodando - 0,25)
*Tela: Navegador em `http://localhost:5173/login`.*

### O que demonstrar ao vivo:
1. **Login como Administrador:**
   - E-mail: `admin@condoreserva.com` | Senha: `morador123` *(ou `12345678`)*.
   - Mostre o redirecionamento automático para o Painel do Administrador (`/admin`).
2. **CRUD Completo em uma das telas (Ex: Áreas de Lazer ou Apartamentos):**
   - **Criar:** Cadastre uma nova área de lazer (Ex: "Quadra de Tênis").
   - **Buscar / Listar:** Mostre a área aparecendo na listagem em tempo real.
   - **Editar:** Clique no botão de editar, altere o status para "Inativa" ou mude o nome para "Quadra Poliesportiva" e salve.
   - **Remover:** Exclua ou inative a área cadastrada.
3. **Erro de validação aparecendo na tela:**
   - Abra o modal de cadastro (ou tente criar uma reserva com data no passado ou horário de início superior ao término).
   - Mostre a mensagem vermelha de validação bloqueando a submissão e alertando o usuário.

---

## 🔄 PARTE 4: Caminho de um Salvar (Critério: Arquitetura em Camadas - 0,25)
*Explicar do botão Salvar até o banco e o caminho de volta. Abra os arquivos nesta sequência exata:*

1. **Frontend - Componente React (`frontend/src/components/NewReservationModal.tsx` - Linhas 31-70):**
   > "Quando o usuário clica em 'Confirmar Reserva', o evento de formulário dispara o `handleSubmit`. O componente valida o estado local e chama o método `reservationService.create`."

2. **Frontend - Serviço Axios (`frontend/src/services/reservationService.ts` e `services/api.ts`):**
   > "O serviço faz um `api.post('/reservations', payload)`. Aqui entra o Axios com o interceptor configurado em `services/api.ts` (linha 11), que injeta automaticamente o cabeçalho `Authorization: Bearer <token>` resgatado do localStorage."

3. **Backend - Rota Express (`api/src/routes/reservationRoutes.ts` - Linhas 53-58):**
   > "A requisição chega no servidor Express na rota `POST /reservations`. A rota é protegida pelo `roleMiddleware` e passa pelo middleware `validateBody(createReservationSchema)` antes de chegar ao controller."

4. **Backend - Middleware de Validação (`api/src/middlewares/validationMiddleware.ts` - Linhas 12-24):**
   > "O `validateBody` intercepta a requisição e executa `createReservationSchema.safeParse(req.body)`. Se faltar algum campo ou o formato for inválido, ele interrompe a requisição imediatamente e lança um `AppError` com status 400."

5. **Backend - Controller (`api/src/controllers/reservationController.ts` - Linhas 8-26):**
   > "Com os dados validados, o `reservationController.create` recebe o corpo da requisição, faz o parse das datas para objetos Date do JavaScript e repassa a execução para a camada de serviço: `reservationService.create(data, req.user)`."

6. **Backend - Service (`api/src/services/reservationService.ts` - Linhas 58-118):**
   > "Aqui reside a regra de negócio do sistema. O service verifica se o morador existe, se a área de lazer está ativa e, crucialmente, chama `findConfirmedConflict` para garantir que não haja sobreposição de horários com outra reserva confirmada. Se houver conflito, lança erro 409."

7. **Backend - Repository (`api/src/repositories/reservationRepository.ts` - Linhas 32-38):**
   > "Com todas as regras de negócio atendidas, o repository aciona o Prisma Client chamando `prisma.reservation.create({ data, include: ... })`."

8. **Banco de Dados (Prisma ORM -> PostgreSQL):**
   > "O Prisma monta a query SQL `INSERT INTO "Reservation"` e grava os dados no PostgreSQL."

9. **O Caminho de Volta:**
   > "O banco retorna o registro criado -> O Repository entrega o objeto para o Service -> O Controller envia a resposta HTTP `res.status(201).json(reservation)` -> O Axios no frontend recebe a resposta com sucesso -> O componente React fecha o modal, dispara `onSuccess()` e atualiza a listagem de reservas na tela do morador sem precisar recarregar a página."

---

## 🛡️ PARTE 5: Validação Compartilhada e Teste no Swagger (Critério: Validação - 0,25 parte 1)
*Tela: Dividida entre o código do `shared` e o navegador no Swagger (`http://localhost:3000/docs/`).*

### 1. O mesmo Schema do Shared no Frontend e na API
*Abra `shared/src/schemas/reservation.schema.ts` (ou `auth.schema.ts`):*
> "Adotamos o padrão de monorepo com um pacote compartilhado chamado `@condoreserva/shared`. Aqui definimos os contratos e schemas em **Zod**, como o `createReservationSchema`. 
> - No **backend**, o `validateBody` usa esse schema para garantir a integridade dos dados na API.
> - No **frontend**, os tipos TypeScript gerados via `z.infer` garantem tipagem estática nos formulários e nas chamadas de serviço, evitando duplicação de regras."

### 2. Swagger recusando dados inválidos sem passar pela tela
*Abra o navegador em `http://localhost:3000/docs/`:*
1. Vá na rota `POST /reservations`.
2. Clique em `Try it out`.
3. Altere o `leisureAreaId` para um texto inválido (ex: `"123-invalido"` em vez de um UUID) ou envie datas mal formatadas.
4. Clique em `Execute`.
5. Mostre a resposta **400 Bad Request** retornada pela API:
> "Vejam que a API recusou a requisição com código 400 antes de chegar ao banco ou executar qualquer lógica, comprovando que mesmo que um usuário mal-intencionado burle o frontend ou use ferramentas como Postman e cURL, o backend permanece completamente seguro e blindado."

---

## 🔑 PARTE 6: Segurança e Login (Critério: Login Explicado - 0,25 parte 2)
*Tela: Abrir `api/src/services/userService.ts` e `api/prisma/seed.ts`.*

### 1. Onde entra o bcrypt
*Mostre no código:*
- No cadastro/seed (`seed.ts` linha 49): `bcrypt.hash(password, 10)` gera o hash seguro da senha com fator de custo (salt).
- No login (`userService.ts` linhas 21-24):
  ```typescript
  const passwordMatch = await bcrypt.compare(data.password, user.passwordHash);
  ```
  O `bcrypt.compare` recebe a senha digitada em texto plano, aplica o mesmo algoritmo com o salt armazenado no hash e verifica se a senha é válida sem precisar descriptografar nada.

### 2. Por que a senha não é guardada como foi digitada?
> "A senha **nunca** deve ser armazenada em texto puro por motivos de segurança e conformidade (princípio da confidencialidade). Se o banco de dados for comprometido ou vazado, hashes gerados com bcrypt impedem que invasores tenham acesso às senhas dos moradores, pois o bcrypt é uma função criptográfica unidirecional (one-way hash) com proteção contra ataques de força bruta e rainbow tables."

### 3. Onde ela é tirada da resposta?
*Mostre no código de `userService.ts` (linhas 45-53):*
```typescript
return {
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
  token,
};
```
> "Aqui no `userService.login`, ao montar o retorno do login, nós instanciamos explicitamente um objeto que contém apenas `id`, `name`, `email` e `role`. A propriedade `passwordHash` é intencionalmente omitida, garantindo que em hipótese alguma o hash da senha seja trafegado pela rede ou exposto para o cliente."
> 
> *Mostre também em `userRepository.findById`:*
> "Da mesma forma, nas consultas de usuário autenticado (`/users/me`), usamos a cláusula `select` do Prisma para trazer apenas os campos públicos, blindando a senha no nível da consulta ao banco."

---

## 🏁 Encerramento
> "Com isso, cobrimos toda a arquitetura do CondoReserva: modelagem relacional no Prisma com integridade referencial, interface reativa em React, fluxo em camadas ponta a ponta, validação em Zod compartilhada e segurança com bcrypt e JWT. Obrigado pela atenção!"
