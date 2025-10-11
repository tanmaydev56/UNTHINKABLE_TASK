Based on your deployed application and the code files you've shared, I'll create a comprehensive GitHub README for your project. Here's what I can see from your code:

## 🚀 **CodeSage AI - Intelligent Code Analysis Platform**

# CodeSage AI 🚀

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

> AI-powered code analysis platform that provides intelligent code reviews using Google Gemini AI

![Dashboard Preview](https://unthinkable-task.vercel.app/og-image.jpg)

## ✨ Features

### 🤖 **AI-Powered Analysis**
- **Deep Code Analysis** using Google Gemini 2.5 Flash
- **Logical Error Detection** - infinite loops, off-by-one errors, race conditions
- **Syntax & Semantic Analysis** - type mismatches, undefined variables, incorrect API usage
- **Performance & Security Insights** - memory leaks, security vulnerabilities

### 📊 **Comprehensive Reporting**
- **Interactive Code Viewer** with line-by-line issue highlighting
- **Severity-based Classification** (High, Medium, Low priority issues)
- **Code Quality Metrics** - readability, maintainability, efficiency, security scores
- **Execution Analysis** - predicts if code will compile and run successfully

### 🎨 **Modern UI/UX**
- **Beautiful Glass Morphism Design** with animated gradients
- **Real-time Dashboard** with search and filtering
- **Responsive Design** that works on all devices
- **Dark/Light Theme** support

### 🔧 **Multi-Language Support**
- **JavaScript/TypeScript** - hoisting issues, closure problems, async/await analysis
- **Python** - indentation errors, mutable defaults, import circular dependencies
- **Java** - null pointer exceptions, type casting issues
- **C++** - memory management, pointer arithmetic, buffer overflows
- And many more...

## 🛠️ Tech Stack

**Frontend:**
- ⚡ **Next.js 15** (App Router) with Turbopack
- 🎨 **Tailwind CSS 4** with custom animations
- 📱 **Shadcn/UI** components
- 🎬 **Framer Motion** for smooth animations
- 🔧 **TypeScript** for type safety

**Backend:**
- 🚀 **Next.js API Routes**
- 🧠 **Google Gemini AI 2.5 Flash** for code analysis
- 🗄️ **PostgreSQL** with connection pooling
- 🔐 **Environment-based configuration**

**Development:**
- 📦 **Radix UI** for accessible components
- 🎯 **Lucide React** for beautiful icons
- 🔥 **React Hot Toast** for notifications
- 🛠️ **Class Variance Authority** for component variants

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/codesage-ai.git
cd codesage-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/codesage"
GEMINI_API_KEY="your-google-gemini-api-key"
```

4. **Set up the database**
```bash
# Run your database migrations (if using Prisma/Drizzle)
npm run db:push
```

5. **Run the development server**
```bash
npm run dev
```


## 📸 Screenshots

### Dashboard
![Dashboard](https://unthinkable-task.vercel.app/dashboard.png)
*Interactive dashboard with document management and statistics*

### Code Analysis Report
![Analysis Report](https://unthinkable-task.vercel.app/report.png)
*Detailed code analysis with line-by-line issue highlighting*



## 🔧 Configuration

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `GEMINI_API_KEY` | Google Gemini AI API key | ✅ |
| `NODE_ENV` | Environment (development/production) | ❌ |

### Supported Languages
The platform currently supports deep analysis for:
- JavaScript/TypeScript
- Python  
- Java
- C++
- SQL
- CSS
- And more via Gemini AI

## 🏗️ Project Structure

```
codesage-ai/
├── app/                    # Next.js 15 App Router
│   ├── (dashboard)/       # Dashboard routes
│   │   ├── dashboard/
│   │   └── report/[id]/
│   ├── api/              # API routes
│   │   ├── analyze/
│   │   ├── documents/
│   │   └── documents/[id]/
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── ui/              # Shadcn/UI components
│   └── dashboard/       # Dashboard components
├── lib/                 # Utility libraries
│   ├── db.ts           # Database configuration
│   ├── types.ts        # TypeScript definitions
│   └── utils.ts        # Utility functions
└── public/             # Static assets
```

## 🎯 Usage

### 1. Upload Code
- Navigate to the dashboard
- Upload your code file or paste code directly
- Select the programming language

### 2. AI Analysis
- The system automatically analyzes your code using Gemini AI
- Real-time progress tracking
- Deep logical and syntax analysis

### 3. Review Results
- View detailed analysis report
- See line-by-line issue highlighting
- Check code quality metrics
- Get AI-powered improvement suggestions

### 4. Take Action
- Implement suggested fixes
- Export analysis reports
- Track code quality improvements over time
