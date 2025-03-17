# AI Development Platform

Uma plataforma moderna para desenvolvimento de IA construída com Next.js, MongoDB e Docker. A aplicação permite aos usuários criar, gerenciar e implantar modelos de IA, além de acompanhar projetos e experimentos.

![AI Development Platform](public/preview.png)

## 🚀 Funcionalidades

- **Gerenciamento de Projetos de IA:**
  - Criar, visualizar, editar e excluir projetos de IA
  - Acompanhar experimentos e resultados
  - Visualizar métricas e desempenho de modelos

- **Interface Moderna:**
  - Dois layouts diferentes:
    - Layout base (limpo e minimalista)
    - Layout com sidebar (para experiência de dashboard)
  - Design responsivo para todos os tamanhos de dispositivos
  - Suporte a modo claro/escuro

- **Integração com MongoDB:**
  - Operações CRUD completas com MongoDB
  - Modelos Mongoose com validação
  - Gerenciamento eficiente de conexão com banco de dados

- **Suporte a Docker:**
  - Configuração de desenvolvimento com Docker Compose
  - Dockerfile pronto para produção
  - Container MongoDB para fácil configuração de banco de dados

- **API:**
  - Endpoints RESTful para projetos e modelos de IA
  - Tratamento de erros e validação

## 🔧 Stack Tecnológica

- **Frontend:**
  - [Next.js 14](https://nextjs.org/) (Framework React com App Router)
  - [Tailwind CSS](https://tailwindcss.com/) (Estilização)
  - [React Icons](https://react-icons.github.io/react-icons/) (Biblioteca de ícones)
  - [React Query](https://tanstack.com/query/latest) (Busca de dados)

- **Backend:**
  - [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) (Endpoints do servidor)
  - [MongoDB](https://www.mongodb.com/) (Banco de dados)
  - [Mongoose](https://mongoosejs.com/) (ODM para MongoDB)

- **Infraestrutura:**
  - [Docker](https://www.docker.com/) (Containerização)
  - [Docker Compose](https://docs.docker.com/compose/) (Configuração multi-container)

## 📂 Estrutura do Projeto

```
src/
├── app/
│   ├── (base)/                 # Rotas de layout base
│   │   ├── admin/              # Rotas de administração
│   │   ├── home/               # Rota inicial
│   │   └── projects/           # Rotas de projetos (lista, criação, visualização, edição)
│   ├── (sidebar)/              # Rotas de layout com sidebar
│   │   └── sidelayout/         # Todas as rotas com sidebar habilitada
│   ├── api/                    # Rotas da API
│   │   └── projects/           # Endpoints da API de projetos
│   ├── content/                # Componentes de conteúdo
│   │   └── functionalities/    # Componentes de funcionalidade reutilizáveis
│   ├── contexts/               # Contextos React
│   └── layouts/                # Componentes de layout
│       ├── base/               # Componentes de layout base
│       └── sidebar/            # Componentes de layout com sidebar
├── components/                 # Componentes compartilhados
│   └── ui/                     # Componentes de UI
├── lib/                        # Bibliotecas utilitárias
│   └── mongodb.ts              # Utilitário de conexão com MongoDB
├── models/                     # Modelos Mongoose
│   └── Project.ts              # Modelo de projeto
└── types/                      # Definições de tipos TypeScript
```

## 📋 Modelos de Dados

### Modelo de Projeto de IA

```typescript
interface IAIProject {
  _id?: string;
  name: string;
  description: string;
  modelType: 'Classification' | 'Regression' | 'NLP' | 'Computer Vision' | 'Other';
  framework: string;
  metrics: {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1Score?: number;
    customMetrics?: Record<string, number>;
  };
  status: 'Planning' | 'Development' | 'Testing' | 'Deployed';
  createdAt?: Date;
  updatedAt?: Date;
}
```

## 🚢 Endpoints da API

### API de Projetos

- `GET /api/projects` - Listar todos os projetos (com filtragem opcional por status)
- `POST /api/projects` - Criar um novo projeto
- `GET /api/projects/[id]` - Obter detalhes de um projeto específico
- `PUT /api/projects/[id]` - Atualizar um projeto
- `DELETE /api/projects/[id]` - Excluir um projeto

## 🛠️ Instruções de Configuração

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) (para configuração containerizada)

### Variáveis de Ambiente

Crie um arquivo `.env.local` no diretório raiz com as seguintes variáveis:

```env
MONGODB_URI=mongodb://localhost:27017/aidev-platform
```

### Configuração de Desenvolvimento

#### Opção 1: Com Docker (Recomendado)

1. Inicie o container MongoDB:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

2. Instale as dependências:

```bash
npm install
```

3. Execute o servidor de desenvolvimento:

```bash
npm run dev
```

#### Opção 2: Sem Docker

1. Certifique-se de ter o MongoDB instalado e em execução localmente (ou use uma instância remota do MongoDB).

2. Instale as dependências:

```bash
npm install
```

3. Configure o `MONGODB_URI` no `.env.local` para apontar para sua instância do MongoDB.

4. Execute o servidor de desenvolvimento:

```bash
npm run dev
```

### Implantação em Produção

1. Construa e execute os containers Docker:

```bash
docker-compose up -d
```

Isso construirá a aplicação Next.js e a executará junto com o MongoDB.

## 🧭 Navegação

A aplicação oferece dois layouts diferentes para acessar a mesma funcionalidade:

1. **Layout Base** - Layout limpo e minimalista sem sidebar
   - Acesso via: `/home`, `/projects`, `/admin/profile`, etc.

2. **Layout com Sidebar** - Experiência tipo dashboard com navegação lateral
   - Acesso via: `/sidelayout/home`, `/sidelayout/projects`, `/sidelayout/admin/profile`, etc.

## 🔄 Fluxos da Aplicação

### Criando um Projeto de IA

1. Navegue para `/projects/create` ou `/sidelayout/projects/create`
2. Preencha os detalhes do projeto (nome, descrição, tipo de modelo, framework, métricas, status)
3. Envie o formulário para criar o projeto

### Gerenciando Projetos

1. Visualize todos os projetos na página de lista de projetos (`/projects` ou `/sidelayout/projects`)
2. Use os filtros para encontrar projetos específicos:
   - Pesquise por nome ou descrição
   - Filtre por status (Planning, Development, Testing, Deployed)
   - Filtre por tipo de modelo
3. Clique em um projeto para ver detalhes
4. Edite ou exclua projetos da visualização de detalhes

## 📱 Design Responsivo

A aplicação é totalmente responsiva:
- Desktop: Sidebar completa e visualizações expandidas
- Tablet: Sidebar recolhível com alternância
- Mobile: Visualização mobile otimizada com menu hamburger

## 🛠️ Scripts de Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Construir para produção
npm run build

# Iniciar servidor de produção
npm run start

# Verificar código
npm run lint

# Formatar código
npm run format
```

## 🐳 Scripts Docker

```bash
# Iniciar MongoDB para desenvolvimento
docker-compose -f docker-compose.dev.yml up -d

# Iniciar stack completa da aplicação para produção
docker-compose up -d

# Parar todos os containers
docker-compose down

# Parar containers de desenvolvimento
docker-compose -f docker-compose.dev.yml down
```

## 📈 Melhorias Futuras

- Autenticação e autorização de usuários
- Integração com frameworks populares de IA (TensorFlow, PyTorch, etc.)
- Visualização de dados e métricas em tempo real
- Implantação automatizada de modelos
- Colaboração em equipe e compartilhamento de projetos

## 📄 License

This project is licensed under the MIT License.