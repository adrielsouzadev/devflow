# DevFlow

Aplicação full-stack para gerenciamento de projetos e tarefas, desenvolvida com TypeScript. Cada usuário possui sua própria conta e acessa exclusivamente seus próprios dados.

## Funcionalidades

- Cadastro e login com senhas protegidas por bcryptjs.
- Autenticação com JWT armazenado em cookie `httpOnly`.
- CRUD completo de projetos.
- CRUD completo de tarefas.
- Organização de tarefas por prioridade: baixa, média e alta.
- Controle de status: a fazer, em andamento e concluída.
- Definição de prazos para tarefas.
- Filtro de tarefas por status.
- Resumo da quantidade de tarefas por status.
- Isolamento de dados por usuário, impedindo o acesso a projetos e tarefas de outras contas.
- Limitação de tentativas de login e cadastro.

## Capturas de tela

### Página inicial
![Página inicial do DevFlow](screenshots/inicio.png)

### Cadastro
![Tela de cadastro](screenshots/cadastro.png)

### Projetos
![Página de projetos](screenshots/projetos.png)

### Gerenciamento de tarefas
![Página de tarefas](screenshots/tarefas.png)

## Tecnologias

| Camada | Tecnologias |
|---|---|
| Front-end | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Back-end | Node.js, Express 5, TypeScript, Zod |
| Banco de dados | PostgreSQL, Prisma 7 |
| Autenticação | JWT (HS256), bcryptjs |
| Testes | Vitest, Supertest |
| Ferramentas | Git, GitHub, npm |

## Testes automatizados

O back-end possui testes automatizados desenvolvidos com **Vitest** e **Supertest**, cobrindo:

- Health check da API.
- Cadastro e autenticação de usuários.
- Validação de dados e tratamento de erros.
- Proteção de rotas e autenticação JWT.
- Isolamento de dados entre usuários.
- Operações CRUD de projetos e tarefas.
- Controle de acesso a recursos de outros usuários.

Todos os testes passam na versão atual do projeto.

Para executar os testes localmente:

```bash
cd backend
npm install
npm test
```

Para executar os testes em modo de desenvolvimento:

```bash
npm run test:watch
```

Para configurar o ambiente de testes:

1. Crie um banco PostgreSQL chamado `devflow_test`.
2. Crie o arquivo `backend/.env.test` com a variável `DATABASE_URL` apontando para esse banco:

   ```env
   DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/devflow_test"
   ```

3. Aplique as migrações nesse banco:

   ```bash
   DOTENV_CONFIG_PATH=.env.test npx prisma migrate deploy --config prisma7.config.ts
   ```

4. Mantenha também o `backend/.env` configurado, pois o `JWT_SECRET` vem dele.

## Arquitetura

```text
Navegador
    |
    v
Next.js
(Server Components e Server Actions)
    |
    v
API Express
    |
    v
Prisma ORM
    |
    v
PostgreSQL
```

### Comunicação e segurança

- O navegador se comunica com o servidor Next.js, sem acessar diretamente a API Express.
- O token JWT é armazenado em um cookie `httpOnly`, não ficando acessível ao JavaScript executado no navegador.
- O Next.js realiza as requisições ao back-end enviando o token no cabeçalho `Authorization: Bearer`.
- A API Express valida os dados recebidos utilizando Zod.
- As consultas ao banco de dados consideram o usuário autenticado, garantindo o isolamento dos dados.
- Tentativas de acesso a recursos pertencentes a outros usuários retornam `404`.
- O `proxy.ts` do Next.js realiza uma verificação inicial da sessão, enquanto a validação efetiva da autenticação e autorização acontece no back-end.

## Rotas da API

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/register` | Cria uma conta |
| POST | `/auth/login` | Autentica o usuário |
| GET | `/auth/me` | Retorna os dados do usuário autenticado |
| GET, POST | `/projects` | Lista e cria projetos |
| GET, PATCH, DELETE | `/projects/:id` | Consulta, atualiza e exclui projetos |
| GET, POST | `/projects/:projectId/tasks` | Lista e cria tarefas |
| PATCH, DELETE | `/tasks/:id` | Atualiza e exclui tarefas |

A listagem de tarefas permite filtragem por status utilizando o parâmetro `?status=`.

Os erros da API seguem um formato padronizado, com mensagem e detalhes quando aplicável.

## Como executar localmente

### Pré-requisitos

- Node.js 24 ou superior.
- npm.
- PostgreSQL 18 ou compatível com a versão utilizada pelo projeto.
- Git.

### 1. Clone o repositório

```bash
git clone https://github.com/adrielsouzadev/devflow.git
cd devflow
```

### 2. Configure o banco de dados

Crie um banco PostgreSQL chamado `devflow` e um usuário com permissões para acessá-lo.

### 3. Configure o back-end

Abra um terminal na pasta `backend`:

```bash
cd backend
npm install
```

Crie o arquivo `.env` com base no `.env.example` e configure suas próprias variáveis:

```env
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/devflow"
JWT_SECRET="seu_segredo_aleatorio_com_pelo_menos_32_caracteres"
CORS_ORIGIN="http://localhost:3000"
```

Execute as migrações e gere o Prisma Client:

```bash
npx prisma migrate deploy
npx prisma generate
```

Inicie o servidor:

```bash
npm run dev
```

O back-end estará disponível em:

`http://localhost:3001`

### 4. Configure o front-end

Abra outro terminal na pasta `frontend`:

```bash
cd frontend
npm install
```

Crie o arquivo `.env.local` com base no `.env.example`:

```env
API_URL="http://localhost:3001"
```

Inicie o servidor:

```bash
npm run dev
```

O front-end estará disponível em:

`http://localhost:3000`

> Os arquivos `.env`, `.env.test` e `.env.local` contêm configurações locais e segredos. Não devem ser enviados ao GitHub.

## Decisões de design

- **Cookie `httpOnly`:** evita que o JavaScript do navegador leia diretamente o token de autenticação.
- **Isolamento nas consultas:** utiliza o identificador do usuário autenticado nas consultas ao banco, evitando acessos indevidos.
- **Resposta `404`:** não revela a existência de recursos pertencentes a outros usuários.
- **Validação com Zod:** garante que os dados recebidos pela API atendam aos formatos esperados.
- **Exclusão em cascata:** a exclusão de um projeto também remove suas tarefas relacionadas.
- **Separação entre front-end e back-end:** mantém responsabilidades distintas entre interface, regras de negócio e persistência de dados.

## Autor

Desenvolvido por **Adriel Souza**.

- GitHub: [@adrielsouzadev](https://github.com/adrielsouzadev)