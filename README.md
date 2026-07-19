# 🎓 FourHour.Learn

**FourHour.Learn** is an AI-powered, interactive learning platform designed to help developers and students master any skill or technology in under 4 hours. 

By filtering out boilerplate details and document dumps, the platform acts as an expert mentor that delivers opinionated guide structures, interactive custom roadmaps, code sandboxes, and conversational assistants to accelerate comprehension.

---

## ⚡ Tech Stack & Architecture

| Layer | Technology | Purpose / Role |
|---|---|---|
| **Framework** | **Next.js 16 (App Router)** | Production-ready React framework managing client/server component separations and route APIs. |
| **Styling Engine** | **Tailwind CSS v4 & Vanilla CSS** | Responsive layouts, grid systems, flex utilities, and unified CSS variable colors (`--clr-*`). |
| **Visual Canvas** | **React Flow v12** | Interactive DAG grid canvas showing conceptual relationships. |
| **Animations** | **Framer Motion & GSAP** | Spring-based magnetic CTA buttons, entrance fade/scale page transitions, typing effects, and sliding sheets. |
| **Syntax Styling** | **React Syntax Highlighter** | Editor-themed syntax styling for code snippets inside panels. |
| **AI Inference** | **Groq API Cloud** | Sub-second completions using a fallback model chain (`llama-3.3-70b-versatile`, `mixtral-8x7b-32768`, etc.). |

---

## 🚀 Key Features

### 1. Cinematic Hero & Typewriter
- Beautiful deep space background styled with floating particle canvas grids.
- Parallax drifting background neon orbs.
- Interactive CTAs wrapped with cursor-magnetic pull physics.

### 2. Time-Boxed 4-Hour Strategy Dashboard
- **Mental Shift philosophy**: Outlines how the technology thinks.
- **Hour 1 to Hour 4 breakdown**: Curated concept goals paired with syntax-highlighted code files.
- **Ignore list**: Highlights advanced, redundant, or outdated libraries/concepts to skip for the first 4 hours.
- **The Golden Exercise**: A project target with checkbox criteria that puts the student ahead of 70% of learners.
- **Professional Checklist**: The 4 core questions experts ask when designing systems.

### 3. Interactive 5-Column Grid Roadmap
- Renders conceptual milestones in a centered 5-column grid where smaller rows automatically center.
- Full viewport pan, pinch, and scroll controls.
- Expandable lesson drawer sheets slide out on node selections.

### 4. Adaptive AI Sandbox
- Exercises that scale across **Easy, Medium, Hard, and Extreme** difficulties.
- Inline text editor box allowing students to paste or write their code.
- Generates grading scores and custom suggestions, automatically recommending and unlocking subsequent exercises.

### 5. Lesson Copilot Sidebar
- Dedicated chatbot tab integrated inside the active lesson sidebar that knows the current topic context.
- Allows follow-up explanations, edge-case checks, and custom code examples.

### 6. Mock Interview Simulator
- Replaces generic header buttons.
- Simulates an interview panel asking **3 theoretical** and **3 coding challenges** with progress indicators.
- Analyzes results to output overall readiness verdicts, score percentages, gap areas to study, and code logic reviews.

### 7. Session Recovery
- Saves all current steps, topic queries, roadmap grids, and chats using `localStorage` caching so page refreshes never cause data loss.

---

## 📁 Directory Structure

```
├── app
│   ├── api
│   │   ├── adaptive-challenge     # Generates difficulty exercises & reviews code submissions
│   │   ├── copilot-chat           # Handles conversational questions about lesson nodes
│   │   ├── evaluate-interview     # Evaluates simulated candidate answers and grades transcripts
│   │   ├── generate-interview-questions # Assembles 3 theory + 3 coding interview questions
│   │   ├── generate-lesson        # Generates lesson explanations, code samples, and practices
│   │   ├── generate-roadmap       # Creates structured node and edge arrays for graphs
│   │   └── generate-summary       # Assembles the initial 4-hour teacher strategy layout
│   ├── globals.css                # Source of truth color properties, keyframes, and glows
│   ├── learn
│   │   └── page.js                # Core learn page managing multi-step strategy states
│   ├── interview
│   │   └── page.js                # AI Mock Interview simulator UI page
│   └── page.js                    # Landing page with GSAP typing effects and magnetic CTAs
├── components
│   ├── CustomNode.js              # Custom styled roadmap node wrapper with type categories
│   ├── Footer.js                  # Site footer with inline social SVG links
│   ├── HowItWorks.js              # Cinematic timeline listing roadmap instructions
│   ├── LessonPanel.js             # Sticky slide-out drawer containing tabs, content, and sandbox
│   ├── LoadingOrb.js              # Delightful concentric loading rings with cycling messages
│   ├── Magnetic.js                # Cursor magnetic spring pull component wrapper
│   ├── Navbar.js                  # Header navigation links and mock interview trigger CTA
│   ├── ParticleBackground.js      # Star drifting space particle effect background
│   ├── RoadmapGraph.js            # React Flow graph settings wrapper with grid math
│   └── TopicInput.js              # Input search form and quick suggestion badges
```

---

## ⚙️ Getting Started & Setup

### 1. Prerequisites
Ensure you have **Node.js (v18+)** installed.

### 2. Install Dependencies
Clone the repository and install packages:
```bash
npm install
```

### 3. Configure API Keys
Create a [`.env.local`](file:///.env.local) file in the root directory and define your Groq API key:
```env
GROQ_API_KEY="gsk_your_actual_groq_api_key"
```

### 4. Run the Development Server
Start the local server:
```bash
npm run dev
```

Open [**http://localhost:3000**](http://localhost:3000) inside your browser to view the application.

---

## 🧪 Verification & Builds
To validate code structure and compile production bundles cleanly:
```bash
npm run build
```
The project utilizes Next.js client component compiler checks to ensure clean, error-free execution.
