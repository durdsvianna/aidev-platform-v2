# AI Development Platform

A comprehensive platform for AI development, built with Next.js, MongoDB, and Docker. This platform enables users to create, manage, and deploy AI models, as well as track AI projects and experiments.

![AI Development Platform](./public/ai-platform-screenshot.png)

## Features

### AI Project Management
- Create, view, edit, and delete AI projects
- Track experiments and results
- Visualize model metrics and performance

### Developer Profile Management
- Create and maintain developer profiles
- Associate profiles with technology stacks
- Track developer expertise and project involvement

### Technology Stack Management
- Define and organize technology stacks
- Associate technologies with stacks
- Assign stacks to developer profiles (many-to-many relationship)
- Track most used stacks across the platform

### AI Assistant Integration
- Integrated AI chat assistant powered by various models
- Switch between different AI models (OpenAI GPT-4, Anthropic Claude, etc.)
- Save and reuse prompts

### Modern Interface
- Two layout options: clean/minimalist and sidebar/dashboard
- Responsive design for mobile and desktop devices
- Light and dark mode support
- Component-based UI with Tailwind CSS

### MongoDB Integration
- Full CRUD operations with MongoDB
- Mongoose models with validation
- Efficient database connection management

### Docker Support
- Development setup with Docker Compose
- Production-ready Dockerfile
- MongoDB container for easy database configuration

### API
- RESTful endpoints for AI projects, models, and profiles
- Comprehensive error handling
- Input validation

## Technology Stack

### Frontend
- Next.js 14 with App Router
- Tailwind CSS for styling
- React Icons
- React Query for data fetching

### Backend
- Next.js API Routes
- MongoDB
- Mongoose

### Infrastructure
- Docker & Docker Compose

## Project Structure

```
ai-development-platform/
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── (base)/                  # Base layout routes
│   │   │   ├── admin/profile/       # User profile pages
│   │   │   ├── home/                # Home page
│   │   │   └── projects/            # Project pages
│   │   ├── (sidebar)/               # Sidebar layout routes
│   │   │   └── sidelayout/          # All sidebar routes
│   │   │       ├── ai-assistant/    # AI assistant pages
│   │   │       ├── profiles/        # Profile management
│   │   │       ├── prompts/         # Prompt management
│   │   │       ├── settings/        # Settings pages
│   │   │       ├── stacks/          # Stack management
│   │   │       ├── technologies/    # Technology management
│   │   │       └── users/           # User management
│   │   └── api/                     # API routes
│   │       ├── chat/                # Chat API endpoints
│   │       ├── models/              # AI models API
│   │       └── projects/            # Projects API
│   ├── components/                  # Shared components
│   │   ├── ai-assistant/           # AI assistant components
│   │   ├── profiles/               # Profile components
│   │   ├── stacks/                 # Stack components
│   │   └── ui/                     # General UI components
│   ├── lib/                         # Utilities
│   │   ├── services/               # Service classes
│   │   └── mongodb.ts              # MongoDB connection
│   ├── models/                      # Data models
│   │   ├── AIModel.ts              # AI model definition
│   │   ├── Profile.ts              # Profile model
│   │   ├── Project.ts              # Project model
│   │   ├── Stack.ts                # Stack model
│   │   └── Technology.ts           # Technology model
│   └── types/                       # TypeScript definitions
├── public/                          # Static assets
├── docker-compose.yml               # Docker setup
├── Dockerfile                       # Docker image definition
└── README.md                        # Project documentation
```

## Data Models

### Profile Model
```typescript
interface IProfile {
  id: string;
  name: string;
  description?: string;
  stacks: string[];  // References to Stack IDs
  createdAt: Date;
  updatedAt: Date;
}
```

### Stack Model
```typescript
interface IStack {
  id: string;
  name: string;
  code: string;
  technologies: ITechnology[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Technology Model
```typescript
interface ITechnology {
  id: string;
  name: string;
  description?: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### AI Project Model
```typescript
interface IAIProject {
  _id: string;
  name: string;
  description: string;
  modelType: 'Classification' | 'Regression' | 'NLP' | 'Computer Vision' | 'Reinforcement Learning' | 'Other';
  framework: string;
  metrics: {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1Score?: number;
    mse?: number;
    mae?: number;
    otherMetrics?: Record<string, number>;
  };
  status: 'Planning' | 'In Progress' | 'Testing' | 'Completed';
  createdAt: Date;
  updatedAt: Date;
}
```

### AI Model Configuration
```typescript
interface IAIModel {
  id: string;
  name: string;
  provider: string;
  apiKey: string;
  baseURL?: string;
  contextLength?: number;
  active: boolean;
  isDefault: boolean;
}
```

## Getting Started

### Option 1: With Docker (Recommended)

1. Clone the repository
2. Make sure Docker and Docker Compose are installed on your machine
3. Create a `.env.local` file with the following variables:
   ```
   MONGODB_URI=mongodb://admin:password@mongodb:27017/aidev?authSource=admin
   OPENAI_API_KEY=your_openai_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ```
4. Run the development environment:
   ```bash
   docker-compose up -d
   ```
5. Access the application at http://localhost:3000

### Option 2: Without Docker

1. Ensure MongoDB is installed and running locally or use a remote instance
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/aidev
   OPENAI_API_KEY=your_openai_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Access the application at http://localhost:3000

## Production Deployment

To deploy to production:

1. Build and run Docker containers:
   ```bash
   docker-compose up -d
   ```
   This builds the Next.js application and runs it alongside MongoDB.

## Navigation Options

The application offers two layout options:

1. **Base Layout**: A clean, minimalist layout
   - Accessible via: `/home`, `/projects`, `/admin/profile`

2. **Sidebar Layout**: A dashboard-like experience with lateral navigation
   - Accessible via: `/sidelayout/home`, `/sidelayout/profiles`, etc.

## Application Flows

### Creating and Managing Developer Profiles

1. Navigate to `/sidelayout/profiles` or click "Profiles" in the sidebar
2. Click "New Profile" to create a new developer profile
3. Fill in profile details and select associated technology stacks
4. After creation, you can view, edit, or delete profiles

### Creating and Managing Technology Stacks

1. Navigate to `/sidelayout/stacks` or click "Stacks" in the sidebar
2. Click "New Stack" to create a new technology stack
3. Fill in stack details and select associated technologies
4. You can assign profiles to stacks to establish the many-to-many relationship

### Using the AI Assistant

1. Navigate to `/sidelayout/ai-assistant` or click "AI Assistant" in the sidebar
2. Select your preferred AI model
3. Start a conversation by entering a message
4. Save useful prompts for later reuse

## Testing

The application includes comprehensive tests for all major components:

```bash
# Run all tests
npm test

# Run specific test suites
npm test -- -t "ProfileService|StackService"
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgements

- Next.js Team for the amazing framework
- MongoDB for the flexible database solution
- Tailwind CSS for the utility-first CSS framework