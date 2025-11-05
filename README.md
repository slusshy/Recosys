# AI Recommendation System

A full-stack AI-powered recommendation system that provides personalized recommendations for movies, books, products, and blogs using natural language queries.

## Features

- 🎬 **Movie Recommendations**: Search TMDB API with fallback to static data
- 📚 **Book Recommendations**: Curated book recommendations with genre filtering
- 🛍️ **Product Recommendations**: Gadgets and lifestyle products
- 📝 **Blog Recommendations**: Tech and lifestyle blog posts
- 🤖 **AI Chat Interface**: Interactive AI-powered recommendations
- 🔍 **Smart Query Processing**: Removes filler words while preserving genre terms
- 📊 **Trending Content**: Top-rated items across all categories

## Tech Stack

### Backend
- **FastAPI**: High-performance async web framework
- **Python 3.11**: Modern Python with type hints
- **TMDB API**: Movie database integration
- **OpenAI**: AI-powered recommendations (optional)
- **SQLAlchemy**: Database ORM
- **httpx**: Async HTTP client

### Frontend
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations
- **Axios**: HTTP client for API calls

## Quick Start

### Prerequisites
- Docker and Docker Compose
- TMDB API Key (get from [TMDB](https://www.themoviedb.org/settings/api))

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd ai-recosys
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env and add your TMDB_API_KEY
```

### 3. Run with Docker Compose
```bash
docker-compose up --build
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Manual Development Setup

### Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Deployment

### Railway (Recommended)
1. Fork this repository
2. Connect your GitHub to Railway
3. Add environment variables in Railway dashboard:
   - `TMDB_API_KEY`
   - `OPENAI_API_KEY` (optional)
4. Deploy automatically on push

### Other Platforms
The project includes Dockerfiles for easy deployment to:
- **Railway**: Automatic deployment from Git
- **Render**: Manual deployment with Docker
- **Heroku**: Buildpack deployment
- **Vercel/Netlify**: Frontend-only deployment

## API Endpoints

### Recommendations
- `POST /api/recommendations/` - Search recommendations
- `GET /api/recommendations/trending` - Get trending items
- `GET /api/recommendations/{category}` - Category-specific recommendations

### Examples
```bash
# Search for action movies
curl -X POST "http://localhost:8000/api/recommendations/" \
  -H "Content-Type: application/json" \
  -d '{"query": "action movies"}'

# Get trending content
curl "http://localhost:8000/api/recommendations/trending"
```

## Project Structure

```
├── backend/
│   ├── main.py              # FastAPI application
│   ├── routers/             # API route handlers
│   ├── utils/               # Utility functions
│   ├── data/                # Static data files
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   └── hooks/          # Custom React hooks
│   └── package.json         # Node dependencies
├── docker-compose.yml       # Local development
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
