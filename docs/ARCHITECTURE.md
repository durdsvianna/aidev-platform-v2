# AI Development Platform Architecture

This document provides a detailed overview of the AI Development Platform architecture, explaining the technical design, component relationships, and implementation details.

## System Architecture Overview

The AI Development Platform follows a modern architecture with the following key components:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Next.js        │     │  Next.js API    │     │  MongoDB        │
│  Front-end      │────►│  Routes         │────►│  Database       │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Key Components

1. **Frontend (Next.js App Router)**: 
   - Provides the user interface and client-side logic
   - Implements two layout options (base and sidebar)
   - Contains all React components and hooks

2. **Backend (Next.js API Routes)**:
   - Handles data processing and business logic
   - Provides RESTful API endpoints
   - Interfaces with the database and external AI services

3. **Database (MongoDB)**:
   - Stores all application data
   - Accessed through Mongoose ODM
   - Deployed via Docker container

## Frontend Architecture

The frontend follows a component-based architecture with React and Next.js, using the App Router for routing.

### Route Structure

```
routes
├── (base)/                     # Clean layout routes
│   ├── admin/profile/          # User profile pages
│   ├── home/                   # Home page
│   ├── projects/               # Project-related pages
│   │   ├── [id]/               # Project detail
│   │   ├── [id]/edit/          # Project edit
│   │   └── create/             # Project creation
│
└── (sidebar)/                  # Sidebar layout routes
    └── sidelayout/             # All sidebar-enabled routes
        ├── ai-assistant/       # AI assistant chat interface
        ├── home/               # Home with sidebar
        ├── profiles/           # Profile management
        │   ├── [id]/           # Profile detail
        │   ├── edit/[id]/      # Profile edit
        │   └── new/            # Profile creation
        ├── prompts/            # Prompt management
        │   ├── [id]/           # Prompt detail
        │   ├── edit/[id]/      # Prompt edit
        │   └── new/            # Prompt creation
        ├── settings/           # Application settings
        │   └── models/         # AI model management
        ├── stacks/             # Tech stack management
        │   ├── [id]/           # Stack detail
        │   ├── edit/[id]/      # Stack edit
        │   └── new/            # Stack creation
        ├── technologies/       # Technology management
        │   ├── [id]/           # Technology detail
        │   ├── edit/[id]/      # Technology edit
        │   └── new/            # Technology creation
        └── users/              # User management
            ├── [id]/           # User detail
            ├── edit/[id]/      # User edit
            └── new/            # User creation
```

### Component Hierarchy

```
┌─ Layout (Base or Sidebar)
│  ├─ Header
│  │  ├─ Navigation
│  │  └─ User Controls
│  │
│  └─ Content
│     ├─ AI Assistant Components
│     │  ├─ ChatInterface
│     │  ├─ ModelSelector
│     │  └─ AIAssistantContent
│     │
│     ├─ Profile Components
│     │  ├─ ProfilesList
│     │  ├─ ProfileDetail
│     │  └─ ProfileForm
│     │
│     ├─ Stack Components
│     │  ├─ StacksList
│     │  ├─ StackDetail
│     │  └─ StackForm
│     │
│     ├─ Technology Components
│     │  ├─ TechnologiesList
│     │  ├─ TechnologyDetail
│     │  └─ TechnologyForm
│     │
│     ├─ Prompt Components
│     │  ├─ PromptsList
│     │  ├─ PromptDetail
│     │  └─ PromptForm
│     │
│     └─ User Components
│        ├─ UsersList
│        ├─ UserDetail
│        └─ UserForm
```

### Key Components

#### Layout Components

- **Layouts**
  - `app/(base)/layout.tsx`: Clean layout without sidebar
  - `app/(sidebar)/layout.tsx`: Layout with sidebar navigation
  - `app/(sidebar)/sidelayout/layout.tsx`: Sidebar navigation layout

#### Functionality Components

- **AI Assistant**
  - `components/ai-assistant/AIAssistantWrapper.tsx`: Context provider wrapper
  - `components/ai-assistant/AIAssistantContent.tsx`: Main AI assistant UI
  - `components/ai-assistant/ChatInterface.tsx`: Chat interface with message history
  - `components/ai-assistant/ModelSelector.tsx`: AI model selection component

- **Profile Management**
  - `app/(sidebar)/sidelayout/profiles/page.tsx`: List of profiles
  - `app/(sidebar)/sidelayout/profiles/[id]/page.tsx`: Profile detail view
  - `app/(sidebar)/sidelayout/profiles/edit/[id]/page.tsx`: Profile editing

- **Stack Management**
  - `app/(sidebar)/sidelayout/stacks/page.tsx`: List of stacks
  - `app/(sidebar)/sidelayout/stacks/[id]/page.tsx`: Stack detail view
  - `components/stacks/StackForm.tsx`: Stack creation/editing form

- **Technology Management**
  - `app/(sidebar)/sidelayout/technologies/page.tsx`: List of technologies
  - `components/technologies/TechnologyForm.tsx`: Technology form

### State Management

The application uses several state management approaches:

1. **Local Component State**: Using `useState` for component-specific state
2. **React Context**: For shared state like AI model context and sidebar status
3. **Service Pattern**: Service classes for data operations

## Backend Architecture

The backend is implemented using Next.js API Routes, which provide serverless functions for API endpoints.

### API Endpoints

```
/api
├── chat/                  # AI chat endpoints
│   └── [modelId]/         # Model-specific chat endpoint
│
├── models/                # AI model management
│   ├── GET                # List all AI models
│   ├── POST               # Create a new AI model
│   │
│   ├── [id]/              # Model-specific endpoints
│   │   ├── GET            # Get a single model
│   │   ├── PATCH          # Update a model
│   │   └── DELETE         # Delete a model
│   │
│   ├── active/            # Get active models
│   ├── default/           # Get default model
│   ├── new-models/        # Add new models
│   ├── reset/             # Reset models to default
│   ├── seed/              # Seed models data
│   └── verify/            # Verify model API keys
│
├── projects/              # Project management
│   ├── GET                # List all projects
│   ├── POST               # Create a new project
│   │
│   └── [id]/              # Project-specific endpoints
│       ├── GET            # Get a single project
│       ├── PUT            # Update a project
│       └── DELETE         # Delete a project
│
├── tasks/                 # Task management
└── test-anthropic/        # Test endpoint for Anthropic API
```

### Data Flow

1. Client makes a request to an API endpoint
2. Next.js API Route handler processes the request
3. Mongoose connects to MongoDB and executes the query or external API is called
4. Response is returned to the client

### Error Handling

The API routes implement comprehensive error handling:

1. **Validation Errors**: Return 400 status with validation details
2. **Not Found Errors**: Return 404 status for missing resources
3. **API Key Errors**: Handle invalid external API keys gracefully
4. **Server Errors**: Return 500 status with error details

## Database Architecture

The application uses MongoDB for data storage, accessed through Mongoose.

### Entity Relationships

The application implements several entity relationships:

1. **Stack-Technology Relationship**: One-to-many relationship where a Stack can contain multiple Technologies
2. **Profile-Stack Relationship**: One-to-many relationship where a Profile can reference multiple Stacks
3. **User Management**: Standard user entity with authentication capabilities

### Schema Design

#### AI Model Schema

```javascript
const AIModelSchema = new Schema({
  name: { 
    type: String, 
    required: true,
    unique: true 
  },
  provider: { 
    type: String, 
    required: true 
  },
  apiKey: { 
    type: String, 
    required: true 
  },
  baseURL: { 
    type: String 
  },
  contextLength: { 
    type: Number 
  },
  active: { 
    type: Boolean, 
    default: true 
  },
  isDefault: { 
    type: Boolean, 
    default: false 
  }
});
```

#### Profile Schema

```javascript
const profileSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  stacks: [{
    type: String  // References Stack IDs
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
```

#### Stack Schema

```javascript
const stackSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    trim: true
  },
  technologies: [{
    type: Schema.Types.Mixed  // Technology objects
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
```

### Local Storage Service

For development and demonstration purposes, the application also implements a local storage service pattern to mimic database operations:

```javascript
export class LocalStorageService {
  isAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && window.localStorage !== null
    } catch (e) {
      return false
    }
  }

  getItem<T>(key: string): T | null {
    if (!this.isAvailable()) return null
    
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error)
      return null
    }
  }

  setItem<T>(key: string, value: T): void {
    if (!this.isAvailable()) return
    
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage:`, error)
    }
  }
}
```

## Third-Party AI Integration

The platform integrates with external AI APIs:

### OpenAI Integration

```javascript
async function callOpenAI(model, messages, apiKey, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages,
      ...options
    })
  });

  return await response.json();
}
```

### Anthropic Integration

```javascript
async function callAnthropic(model, messages, apiKey, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01'
  };

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages,
      ...options
    })
  });

  return await response.json();
}
```

## Deployment Architecture

The application uses Docker for containerization and deployment.

### Docker Compose Setup

#### Development Environment

```yaml
version: '3.3'

services:
  mongodb:
    image: mongo:5.0
    ports:
      - '27017:27017'
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
      - MONGO_INITDB_DATABASE=aidev

  nextapp:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '3000:3000'
    environment:
      - MONGODB_URI=mongodb://admin:password@mongodb:27017/aidev?authSource=admin
    depends_on:
      - mongodb
    volumes:
      - ./:/app
      - /app/node_modules
      - /app/.next

volumes:
  mongodb_data:
```

### Dockerfile

The application uses a multi-stage build process to optimize the Docker image:

```dockerfile
# Install dependencies only when needed
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

## Security Considerations

1. **API Key Management**: API keys for external services are stored securely without encryption
2. **Input Validation**: All user inputs are validated at the API layer
3. **Error Handling**: Errors are properly caught and handled
4. **Docker Security**: Production containers run as non-root users

## Performance Considerations

1. **Connection Pooling**: Mongoose connections are pooled to avoid connection overhead
2. **Docker Optimization**: Multi-stage builds to reduce image size
3. **Next.js Optimization**: Built-in image optimization and static generation
4. **React Optimization**: Proper state management to avoid unnecessary renders

## Conclusion

The AI Development Platform implements a modern, scalable architecture using Next.js, MongoDB, and Docker. The integration with AI services like OpenAI and Anthropic allows for powerful AI-assisted development capabilities. The separation of concerns between frontend, backend, and database layers ensures maintainability and scalability. 