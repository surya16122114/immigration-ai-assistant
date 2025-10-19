# Immigration AI Assistant 🌐

A comprehensive web application providing AI-powered immigration guidance using RAG (Retrieval Augmented Generation) with official USCIS and Department of State documents.

![Tech Stack](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-20-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-orange)

## 🎯 Overview

Immigration AI Assistant helps users navigate the complex U.S. immigration system through:
- **AI-Powered Chat:** Get instant answers to immigration questions using GPT-4o-mini with RAG
- **Case Tracking:** Monitor your immigration case status and progress
- **Email Alerts:** Receive notifications about visa bulletins, H-1B lottery results, and policy changes
- **Comprehensive Guides:** Access detailed information on H-1B, F-1, OPT, Green Cards, and more
- **Policy Updates:** Stay informed with the latest immigration policy changes from multiple authoritative sources

## ✨ Features

### 🤖 AI Chat with RAG
- Interactive chat interface powered by OpenAI GPT-4o-mini
- Retrieval Augmented Generation using official USCIS/DOS documents
- Source citations for every response
- Conversation history persistence
- Response caching for common questions (instant answers)
- 10-20 second response time (optimized from 60-90s)

### 📊 Immigration Case Tracking
- Create and manage multiple immigration cases
- Track status (Pending, In Review, Approved, Denied)
- Receipt number management
- Progress bars and expected completion dates
- Real-time updates

### 🔔 Alert Subscriptions
- Visa Bulletin updates
- H-1B lottery result notifications
- Policy change alerts
- OPT deadline reminders
- Email delivery via SendGrid

### 📚 Visa Guidance System
Comprehensive guides for:
- **Non-Immigrant Visas:** H-1B, F-1, OPT, STEM OPT
- **Immigrant Visas:** Family-based, Employment-based (EB-1/2/3)
- Requirements, timelines, fees, and application processes

### 📰 Policy Updates
Stay current with recent immigration policy changes from:
- USCIS official announcements
- Department of State
- Immigration law firms
- News sources and research organizations

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 with Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom dark purple theme
- **UI Components:** shadcn/ui (Radix UI primitives)
- **State Management:** TanStack Query v5
- **Routing:** Wouter
- **Icons:** Lucide React, React Icons

### Backend
- **Runtime:** Node.js 20
- **Framework:** Express.js with TypeScript
- **Database:** PostgreSQL (Neon)
- **ORM:** Drizzle ORM
- **Authentication:** Replit OIDC Auth
- **AI:** OpenAI GPT-4o-mini + text-embedding-3-small
- **Email:** SendGrid

### Infrastructure
- **Hosting:** Replit
- **Database:** Neon (Serverless PostgreSQL)
- **Session Store:** PostgreSQL with connect-pg-simple
- **Environment:** Replit Secrets management

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (Neon recommended)
- OpenAI API key
- SendGrid API key
- Replit Auth setup (for OIDC)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd immigration-ai-assistant
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file or configure Replit Secrets with:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database
PGHOST=your-neon-host
PGPORT=5432
PGUSER=your-username
PGPASSWORD=your-password
PGDATABASE=your-database

# Authentication
SESSION_SECRET=your-session-secret
ISSUER_URL=your-replit-auth-issuer
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
```

4. **Initialize the database**
```bash
npx tsx server/migrate.ts
```

This will:
- Create all required tables
- Seed the RAG knowledge base with immigration documents
- Set up the session store

5. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
immigration-ai-assistant/
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── chat/           # Chat interface components
│   │   │   ├── dashboard/      # Dashboard widgets
│   │   │   ├── layout/         # Layout components (Sidebar, etc.)
│   │   │   └── ui/             # shadcn/ui components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utilities and configurations
│   │   ├── pages/              # Page components
│   │   ├── App.tsx             # Main app component
│   │   └── index.css           # Global styles
├── server/                      # Backend Express application
│   ├── services/               # Business logic
│   │   └── ragPipeline.ts     # RAG implementation
│   ├── routes.ts               # API routes
│   ├── index.ts                # Express server entry
│   └── migrate.ts              # Database migration script
├── shared/                      # Shared types and schemas
│   └── schema.ts               # Drizzle database schema
└── package.json
```

## 🗄️ Database Schema

### Core Tables
- `users` - User accounts with profile information
- `sessions` - Express session store
- `conversations` - Chat conversation threads
- `messages` - Individual chat messages with AI responses
- `cases` - Immigration case tracking
- `saved_queries` - Bookmarked searches
- `alert_subscriptions` - User alert preferences
- `policy_updates` - Immigration policy changes
- `document_embeddings` - RAG knowledge base (vector embeddings)

## 🔌 API Endpoints

### Authentication
- `GET /api/login` - Initiate OIDC login
- `GET /api/callback` - OIDC callback handler
- `POST /api/logout` - End user session
- `GET /api/auth/user` - Get current user

### Chat & Conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations` - List user conversations
- `GET /api/conversations/:id/messages` - Get messages
- `POST /api/chat` - Send message and get AI response

### Case Management
- `GET /api/cases` - List user cases
- `POST /api/cases` - Create new case
- `PUT /api/cases/:id` - Update case
- `DELETE /api/cases/:id` - Delete case

### Alerts
- `GET /api/alert-subscriptions` - List subscriptions
- `POST /api/alert-subscriptions` - Create subscription
- `PUT /api/alert-subscriptions/:id` - Update subscription
- `DELETE /api/alert-subscriptions/:id` - Delete subscription
- `POST /api/send-alert` - Send email alert

### Policy Updates
- `GET /api/policy-updates` - Get recent updates

## 🎨 Design System

### Color Palette
- **Primary:** Purple/Violet (#9b4de6 / hsl(270, 75%, 60%))
- **Background:** Dark theme with gradient effects
- **Cards:** Premium glassmorphism style with purple glows
- **Accents:** Gradient backgrounds and hover effects

### Typography
- **Headings:** System font stack
- **Body:** Inter font family
- **Monospace:** Consolas, Monaco

## 🧠 RAG Pipeline

### Document Processing
1. Documents split into 1000-character chunks with 200-character overlap
2. Each chunk embedded using OpenAI text-embedding-3-small
3. Embeddings stored in PostgreSQL as JSONB arrays
4. Metadata includes source, URL, category, last updated

### Query Flow
1. User question embedded using same model
2. Vector similarity search (cosine similarity)
3. Top 3 most relevant chunks retrieved
4. Context provided to GPT-4o-mini
5. Response generated with source citations
6. Common queries cached for 30 minutes

### Knowledge Base
- H-1B visa guide
- F-1 student visa guide
- OPT and STEM OPT guide
- Green Card (employment & family-based)
- Policy updates and recent changes

## 🔐 Security

- Session-based authentication with PostgreSQL store
- API keys stored in environment secrets
- HTTPS enforced in production
- User data isolated by user_id
- SQL injection protection via Drizzle ORM
- XSS protection with React's built-in escaping

## 🚀 Deployment

### Replit Publishing (Recommended)
1. Click "Publish" in Replit
2. Configure environment secrets
3. Enable automatic deployments
4. Your app will be live at `https://your-app.replit.app`

### Manual Deployment
Ensure all environment variables are configured, then:
```bash
npm run build
npm start
```

## 📊 Performance

- **Chat Response Time:** 10-20 seconds (with caching: <1s)
- **Page Load:** <2 seconds
- **Database Queries:** <100ms average
- **Frontend Build:** <5 seconds

## 🧪 Testing

End-to-end tests using Playwright:
```bash
npm run test
```

## 📈 Future Enhancements

- [ ] Multi-language support (Spanish, Chinese, Hindi)
- [ ] SMS notifications via Twilio
- [ ] Integration with USCIS Case Status API
- [ ] Document upload and analysis
- [ ] Attorney consultation booking
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] ChromaDB for enhanced vector search

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- USCIS for official immigration documentation
- OpenAI for GPT-4o-mini and embeddings API
- shadcn/ui for beautiful React components
- Neon for serverless PostgreSQL
- Replit for hosting and authentication

## 📞 Support

For questions or issues:
- Create an issue in this repository
- Contact: your-email@example.com

## 📚 Resources

- [USCIS Official Website](https://www.uscis.gov)
- [Department of State Visa Bulletin](https://travel.state.gov/visa-bulletin)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)

---

**Built with ❤️ using React, TypeScript, and OpenAI**
