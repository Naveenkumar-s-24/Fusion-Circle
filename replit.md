# Fusion Circle - Project Management Platform

## Overview
Fusion Circle is a collaborative project management platform with AI-assisted task prioritization, real-time updates via WebSockets, and an intuitive Kanban board interface. Built for small to medium-sized teams to efficiently plan, track, and execute projects.

## Tech Stack
- **Frontend**: React + TypeScript, Tailwind CSS, Shadcn UI components, Wouter (routing), TanStack Query (data fetching)
- **Backend**: Express.js, PostgreSQL (Neon), Drizzle ORM, WebSocket (real-time updates)
- **Authentication**: Replit Auth (supports Google, GitHub, email/password)
- **Database**: PostgreSQL with Drizzle ORM

## Features
### MVP Features (Implemented)
1. **User Authentication**
   - Replit Auth integration with multiple login methods
   - Session management with role-based access (admin, manager, member)

2. **Project Management**
   - Create, view, edit projects
   - Project dashboard with completion statistics
   - Project search and filtering
   - Team member assignment

3. **Task Management**
   - CRUD operations for tasks
   - Task assignment to team members
   - Status tracking (To-Do, In Progress, Completed)
   - Priority levels (Low, Medium, High)
   - Due date tracking

4. **Interactive Kanban Board**
   - Drag-and-drop task cards between columns
   - Visual task organization
   - Real-time updates across all connected clients

5. **AI Task Prioritization**
   - Automatic priority scoring based on:
     - Task priority level (30 points)
     - Due date urgency (20 points)
   - Visual AI badges for high-priority tasks (score > 70)
   - Intelligent task ranking

6. **Real-Time Collaboration**
   - WebSocket-powered live updates
   - Instant sync across all user sessions
   - No page refresh needed

7. **Analytics & Insights**
   - Project completion rates
   - Task distribution statistics
   - Workload visualization
   - Progress tracking

## Project Structure
```
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/         # Shadcn UI components
│   │   │   ├── AppSidebar.tsx
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── ProjectHeader.tsx
│   │   │   ├── ProjectModal.tsx
│   │   │   └── TaskModal.tsx
│   │   ├── hooks/          # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useWebSocket.ts
│   │   │   └── use-toast.ts
│   │   ├── lib/            # Utility libraries
│   │   │   ├── authUtils.ts
│   │   │   └── queryClient.ts
│   │   ├── pages/          # Application pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Landing.tsx
│   │   │   ├── ProjectDetail.tsx
│   │   │   └── Projects.tsx
│   │   └── App.tsx         # Main app component
│   └── index.html
├── server/                  # Backend Express application
│   ├── db.ts               # Database configuration
│   ├── replitAuth.ts       # Authentication setup
│   ├── routes.ts           # API routes + WebSocket
│   └── storage.ts          # Data access layer
├── shared/                  # Shared types and schemas
│   └── schema.ts           # Database schema + TypeScript types
└── design_guidelines.md    # Design system documentation
```

## Database Schema
### Users Table
- `id` (varchar, PK) - User identifier
- `email` (varchar, unique) - User email
- `firstName`, `lastName` (varchar) - User name
- `profileImageUrl` (varchar) - Profile picture URL
- `role` (varchar) - User role (admin/manager/member)
- Timestamps: `createdAt`, `updatedAt`

### Projects Table
- `id` (varchar, PK) - Project identifier
- `name` (varchar) - Project name
- `description` (text) - Project description
- `ownerId` (varchar, FK → users) - Project owner
- Timestamps: `createdAt`, `updatedAt`

### Project Members Table
- `id` (varchar, PK) - Member record identifier
- `projectId` (varchar, FK → projects) - Associated project
- `userId` (varchar, FK → users) - Team member
- `role` (varchar) - Member role in project
- `joinedAt` (timestamp) - Join timestamp

### Tasks Table
- `id` (varchar, PK) - Task identifier
- `projectId` (varchar, FK → projects) - Parent project
- `title` (varchar) - Task title
- `description` (text) - Task details
- `assigneeId` (varchar, FK → users) - Assigned user
- `status` (varchar) - todo/in-progress/completed
- `priority` (varchar) - low/medium/high
- `aiScore` (integer) - AI-calculated priority (0-100)
- `dueDate` (timestamp) - Task deadline
- Timestamps: `createdAt`, `updatedAt`

## AI Prioritization Algorithm
The AI scoring system calculates task priority (0-100) based on:

### Priority Weight (30 points max)
- High: +30 points
- Medium: +15 points
- Low: +0 points

### Due Date Urgency (20 points max)
- Overdue: +20 points
- Due today/tomorrow: +18 points
- Due within 3 days: +15 points
- Due within 7 days: +10 points
- Due within 14 days: +5 points

Tasks with AI score > 70 display special AI badges indicating high priority.

## API Endpoints
### Authentication
- `GET /api/login` - Initiate login flow
- `GET /api/logout` - Sign out user
- `GET /api/callback` - OAuth callback
- `GET /api/auth/user` - Get current user

### Projects
- `GET /api/projects` - List user's projects
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create new project
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks?projectId=...` - List project tasks
- `GET /api/tasks/:id` - Get task details
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### WebSocket
- `WS /ws` - Real-time updates connection
  - Auth message: `{ type: 'auth', userId: '...' }`
  - Update events: project_created, project_updated, task_created, task_updated, etc.

## Design System
The application follows a Linear-inspired design system with:
- **Color Palette**: Deep blue-gray backgrounds, vibrant blue accents
- **Typography**: Inter font family, clear hierarchy
- **Spacing**: Consistent 4px grid system
- **Components**: Shadcn UI with custom styling
- **Interactions**: Subtle hover/active states, smooth transitions
- **Dark Mode**: Full dark mode support

See `design_guidelines.md` for complete design specifications.

## Development Workflow
1. **Schema Changes**: Update `shared/schema.ts`, then run `npm run db:push`
2. **Frontend Development**: Components in `client/src/components/` and pages in `client/src/pages/`
3. **Backend Development**: API routes in `server/routes.ts`, data access in `server/storage.ts`
4. **Testing**: Use the integrated workflow to test the application

## Future Enhancements
- Project-specific chat channels
- File upload and document management
- Gantt chart timeline view
- Enhanced ML models for task prioritization
- Team workload heatmaps
- Recurring tasks and automated reminders
- Data export (CSV, PDF reports)
- Workflow templates for different project types
- Mobile responsive optimizations
- Notification system

## Recent Changes
- 2025-01-19: Initial MVP implementation with core features
  - User authentication via Replit Auth
  - Project and task CRUD operations
  - Kanban board with drag-and-drop
  - AI task prioritization algorithm
  - Real-time WebSocket updates
  - Responsive design with dark mode support
