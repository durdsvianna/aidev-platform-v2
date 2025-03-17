# Task Manager Application Architecture

This document provides a detailed overview of the Task Manager application architecture, explaining the technical design, component relationships, and implementation details.

## System Architecture Overview

The Task Manager application follows a modern architecture with the following key components:

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
   - Interfaces with the database

3. **Database (MongoDB)**:
   - Stores all application data
   - Accessed through Mongoose ODM
   - Deployed via Docker container

## Frontend Architecture

The frontend follows a component-based architecture with React and Next.js, using the App Router for routing.

### Route Structure

```
routes
├── (base)/                 # Clean layout routes
│   ├── admin/profile/       # User profile pages
│   ├── home/                # Home page
│   └── tasks/               # Task-related pages
│       ├── [id]/            # Task detail
│       ├── [id]/edit/       # Task edit
│       └── create/          # Task creation
│
└── (sidebar)/               # Sidebar layout routes
    └── sidelayout/          # All sidebar-enabled routes
        ├── admin/profile/   # User profile with sidebar
        ├── dashboard/       # Dashboard with sidebar
        ├── home/            # Home with sidebar
        └── tasks/           # Tasks with sidebar
            ├── [id]/        # Task detail with sidebar
            ├── [id]/edit/   # Task edit with sidebar
            └── create/      # Task creation with sidebar
```

### Component Hierarchy

```
┌─ Layout (Base or Sidebar)
│  ├─ Header
│  │  ├─ Navigation
│  │  └─ User Controls
│  │
│  └─ Content
│     ├─ Task Components
│     │  ├─ ListTasks
│     │  ├─ CreateTask
│     │  ├─ TaskDetail
│     │  └─ EditTask
│     │
│     └─ User Components
│        └─ UserProfile
```

### Key Components

#### Layout Components

- **Layouts**
  - `base/index.tsx`: Clean layout without sidebar
  - `sidebar/index.tsx`: Layout with sidebar navigation
  - `sidebar/Sidebar/SidebarMenu/index.tsx`: Sidebar navigation menu

#### Functionality Components

- **Task Management**
  - `content/functionalities/Tasks/ListTasks.tsx`: List of tasks with filtering
  - `content/functionalities/Tasks/CreateTask.tsx`: Task creation form
  - `content/functionalities/Tasks/TaskDetail.tsx`: Detailed task view
  - `content/functionalities/Tasks/EditTask.tsx`: Task editing form

- **User Management**
  - `content/functionalities/Users/UserProfile.tsx`: User profile component

### State Management

The application uses React's built-in state management with the following approaches:

1. **Local Component State**: Using `useState` for component-specific state
2. **React Context**: For shared state like sidebar open/closed status
3. **React Query**: For server state management and data fetching

## Backend Architecture

The backend is implemented using Next.js API Routes, which provide serverless functions for API endpoints.

### API Endpoints

```
/api
├── tasks/             # Task-related endpoints
│   ├── GET            # List all tasks
│   ├── POST           # Create a new task
│   │
│   └── [id]/          # Task-specific endpoints
│       ├── GET        # Get a single task
│       ├── PUT        # Update a task
│       └── DELETE     # Delete a task
│
└── web3/              # Web3-related endpoints
```

### Data Flow

1. Client makes a request to an API endpoint
2. Next.js API Route handler processes the request
3. Mongoose connects to MongoDB and executes the query
4. Response is returned to the client

### Error Handling

The API routes implement comprehensive error handling:

1. **Validation Errors**: Return 400 status with validation details
2. **Not Found Errors**: Return 404 status for missing resources
3. **Server Errors**: Return 500 status with error details

## Database Architecture

The application uses MongoDB for data storage, accessed through Mongoose.

### Schema Design

#### Task Schema

```javascript
const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    reward: {
      type: Number,
      required: [true, 'Reward is required'],
      min: [0, 'Reward cannot be negative']
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required']
    },
    tags: [{
      type: String,
      trim: true
    }],
    status: {
      type: String,
      enum: {
        values: ['Open', 'In Progress', 'Completed'],
        message: '{VALUE} is not a valid status'
      },
      default: 'Open'
    }
  },
  {
    timestamps: true
  }
)
```

### Database Connection

The application implements a connection pooling pattern for MongoDB:

```javascript
// Global is used here to maintain a cached connection across hot reloads
// in development. This prevents connections growing exponentially
// during API Route usage.
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }
  
  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
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
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped
    command: --quiet

volumes:
  mongodb_data:
```

#### Production Environment

```yaml
version: '3.3'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/aidev
    depends_on:
      - mongodb
    networks:
      - app-network
    restart: unless-stopped

  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - app-network
    restart: unless-stopped
    command: --quiet

networks:
  app-network:
    driver: bridge

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

1. **Input Validation**: All user inputs are validated at the API layer
2. **Error Handling**: Errors are properly caught and handled
3. **Docker Security**: Production containers run as non-root users
4. **Database Security**: MongoDB uses separate volumes for persistence

## Performance Considerations

1. **Connection Pooling**: Mongoose connections are pooled to avoid connection overhead
2. **Docker Optimization**: Multi-stage builds to reduce image size
3. **Next.js Optimization**: Built-in image optimization and static generation
4. **React Optimization**: Proper state management to avoid unnecessary renders

## Conclusion

The Task Manager application implements a modern, scalable architecture using Next.js, MongoDB, and Docker. The separation of concerns between frontend, backend, and database layers ensures maintainability and scalability. 