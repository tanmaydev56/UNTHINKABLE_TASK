
## 🚀 **AI Code Review Assistant**



[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

> AI-powered code analysis platform that provides intelligent code reviews using Google Gemini AI

<img width="1901" height="972" alt="image" src="https://github.com/user-attachments/assets/193ac415-be41-47e1-997a-875a82191667" />


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
<img width="1905" height="978" alt="image" src="https://github.com/user-attachments/assets/9983cbeb-c147-4872-9ce6-58a236a4389d" />
*Interactive dashboard with document management and statistics*

### Code Analysis Report
<img width="1897" height="973" alt="image" src="https://github.com/user-attachments/assets/f1ee5d09-ec8d-4845-8883-af48fb6cf3fb" />
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
📁 UNTHINKABLETASKCODERIEVEWAPP/
├─ 📁 app/                          # Next.js 15 App Router
│  ├─ 📁 (auth)/                    # Route group for auth pages
│  │  ├─ 📄 login/page.tsx          # /login
│  │  └─ 📄 register/page.tsx       # /register
│  ├─ 📁 (dashboard)/               # Route group for dashboard
│  │  ├─ 📁 code-understand/        # /code-understand
│  │  ├─ 📁 dashboard/              # /dashboard
│  │  ├─ 📁 report/[id]/            # /report/:id
│  │  ├─ 📁 settings/               # /settings
│  │  ├─ 📁 upload/                 # /upload
│  │  ├─ 📄 layout.tsx              # Shared layout for dashboard group
│  │  └─ 📄 page.tsx                # Default page for dashboard group
│  ├─ 📁 api/                       # API routes
│  │  ├─ 📁 analyze/                # /api/analyze
│  │  ├─ 📁 documents/              # /api/documents
│  │  │  └─ 📁 [id]/                # /api/documents/:id
│  │  └─ 📁 understand/             # /api/understand
│  ├─ 📄 layout.tsx                 # Root layout
│  ├─ 📄 page.tsx                   # Home page
│  ├─ 📄 globals.css                # Global styles
│  └─ 📄 favicon.ico                # App icon
├─ 📁 components/                    # Reusable React components
│  ├─ 📁 ui/                         # Shadcn/UI components
│  │  └─ 📄 codeExplaination.tsx    # Custom UI component
│  └─ 📄 Navbar.tsx                 # Navigation bar
├─ 📁 lib/                           # Utility libraries
│  ├─ 📄 colors-utils.ts            # Color utilities
│  ├─ 📄 date-utils.ts              # Date helpers
│  ├─ 📄 db.ts                      # Database configuration
│  ├─ 📄 files-utils.ts             # File helpers
│  ├─ 📄 icons-utils.tsx            # Icon helpers
│  ├─ 📄 quality-utils.tsx          # Quality checks
│  ├─ 📄 types.ts                   # TypeScript definitions
│  └─ 📄 utils.ts                   # General utilities
├─ 📁 public/                        # Static assets
│  └─ 📄 eny/aitianare              # Sample static file
└─ 📄 node_modules/                  # Dependencies (auto-generated)
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

