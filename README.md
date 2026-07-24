# Leftover-food-Chef-AI
An Agentic AI-powered smart cooking assistant that recommends recipes using available ingredients, reduces food waste, and generates personalized meal plans through a multi-agent AI pipeline.


An AI-powered recipe recommendation system that helps users make delicious meals using the ingredients already available in their kitchen. The project aims to reduce food waste, simplify meal planning, and provide personalized cooking suggestions using Generative AI and Agentic AI.

## 📌 Features

- 🥗 Generate recipes from available ingredients
- 🤖 AI-powered recipe recommendations using Google Gemini
- 🧠 Multi-Agent architecture for intelligent task handling
- 🛒 Shopping list generation for missing ingredients
- 📅 Weekly meal planning
- 🥘 Pantry management
- ⏱️ Cooking time estimation
- 🔄 Ingredient substitution suggestions
- 📖 Step-by-step cooking instructions
- 🎨 Modern React frontend with responsive UI

---

## 🏗️ Project Architecture

```
Leftover-food-Chef-AI
│
├── frontend/                 # React + TypeScript Frontend
│
├── backend/                  # FastAPI Backend
│
├── agents/                   # Agentic AI Module
│   ├── agents/
│   ├── config/
│   ├── tools/
│   ├── crew.py
│   └── main.py
│
├── docker-compose.yml
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Backend

- Python
- FastAPI
- Uvicorn

### AI & Agentic AI

- Google Gemini API
- CrewAI
- LangGraph
- LangChain Core

### Database

- MongoDB

### Deployment

- Docker
- Docker Compose

---

## 🤖 AI Workflow

### Pantry Agent

- Reads available ingredients
- Identifies ingredients that should be used first

### Recipe Agent

- Generates personalized recipes
- Suggests ingredient substitutions
- Provides cooking instructions

### Meal Planner Agent

- Creates weekly meal plans
- Optimizes ingredient usage

### Shopping Agent

- Generates shopping lists
- Identifies missing ingredients

---

## 📂 Branch Structure

The repository contains the following branches:

- `main`
- `backend`
- `frontend`
- `ai-integration`
- `ragini/agents`

Each branch represents a different development phase of the project.

---

## ⚙️ Installation

### Clone Repository

```bash
git clone <repository-url>
cd Leftover-food-Chef-AI
```

---

### Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

uvicorn main:app --reload
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

### Agent Setup

```bash
cd agents

pip install -r requirements.txt

python main.py
```

---

## 🔑 Environment Variables

Create a `.env` file.

Example:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

MONGO_URI=mongodb://localhost:27017

DATABASE_NAME=leftover_food_chef
```

---

## 🐳 Docker

Run the complete project:

```bash
docker-compose up --build
```

---

## 📷 Screenshots

Add screenshots of:

- Home Page
- Pantry Page
- Recipe Recommendation
- Shopping List
- Meal Planner

---

## 🎯 Future Enhancements

- Voice-based recipe assistant
- Nutritional analysis
- Image-based ingredient detection
- User authentication
- Personalized recommendations
- Recipe history
- Multi-language support
- Mobile application

---

## 👩‍💻 Team Members

- Aashi Singh
- Ragini Soni
- Shakti Rajora
- Manshi Kadam
- Mudu sunandita

## 📖 Project Objective

The primary objective of this project is to reduce food waste by helping users prepare meals using ingredients already available in their kitchens. By integrating Generative AI with Agentic AI, the system provides intelligent recipe recommendations, meal planning, pantry management, and shopping assistance, making cooking more efficient and sustainable.

---

## 📜 License

This project is developed for educational purposes as part of a university project.


## ⭐ Acknowledgements

- Google Gemini API
- CrewAI
- LangGraph
- FastAPI
- React
- MongoDB
- Docker

---

## ❤️ Thank You

If you found this project useful, consider giving it a ⭐ on GitHub.
