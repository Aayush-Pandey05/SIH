# 🌧️ Jal Setu - AI-Powered Rainwater Harvesting Recommendation System

[![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16.0+-green.svg)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-red.svg)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-darkgreen.svg)](https://www.mongodb.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-orange.svg)](https://openai.com/)

**Jal Setu** is an intelligent web application that helps users design optimal rainwater harvesting systems for their properties. By combining roof mapping, AI-powered analysis, and machine learning predictions, it provides personalized recommendations including structure types, costs, capacity, savings, and local groundwater levels.

## 🌟 Key Features

- **Interactive Roof Mapping**: Draw polygons on maps to define roof areas
- **AI-Powered Recommendations**: GPT-4o agent suggests optimal harvesting structures
- **Cost Analysis**: Detailed cost estimates with payback period calculations  
- **Groundwater Prediction**: ML model predicts local groundwater levels
- **ROI Calculator**: Annual savings and investment recovery analysis
- **User Dashboard**: Persistent storage of recommendations and analysis
- **Government Schemes**: Integration with subsidy information

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Backend 1      │    │  Backend 2      │
│   (Port: 5173)   │───▶│  Node.js/Express│───▶│  FastAPI/AI     │
│                 │    │  (Port: 3000)   │    │  (Port: 5000)   │
│ • Roof Mapping  │    │ • Authentication│    │ • AI Agent      │
│ • Data Display  │    │ • API Gateway   │    │ • ML Prediction │
│ • User Auth     │    │ • Data Storage  │    │ • External APIs │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │    MongoDB      │
                       │   Database      │
                       │ • User Data     │
                       │ • Recommendations│
                       └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16.0+
- Python 3.8+
- MongoDB 6.0+
- OpenAI API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/jal-setu.git
   cd jal-setu
   ```

2. **Setup Backend 1 (Node.js)**
   ```bash
   cd backend1
   npm install
   ```

3. **Setup Backend 2 (Python/FastAPI)**
   ```bash
   cd ./backend2
   pip install -r requirements.txt
   ```

4. **Setup Frontend (React)**
   ```bash
   cd ./frontend
   npm install
   ```

### Environment Configuration

1. **Backend 1 Environment** (`backend1/.env`):
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/jalsetu
   SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

2. **Backend 2 Environment** (`backend2/.env`):
   ```env
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```

### Running the Application

1. **Start MongoDB**
   ```bash
   mongod
   ```

2. **Start Backend 1** (Terminal 1):
   ```bash
   cd backend1
   npm run dev
   ```

3. **Start Backend 2** (Terminal 2):
   ```bash
   cd backend2
   uvicorn main:app --port 5000 --reload
   ```

4. **Start Frontend** (Terminal 3):
   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend 1 API: http://localhost:3000
   - Backend 2 API: http://localhost:5000

## 📋 User Workflow

1. **Authentication**: User signs up or logs in
2. **Roof Mapping**: Draw roof polygon on interactive map or enter coordinates manually
3. **AI Processing**: System analyzes location, rainfall data, and roof specifications
4. **Recommendations**: Receive personalized structure recommendations with:
   - Structure type (Recharge Pit, Trench, or Shaft)
   - Estimated cost and capacity
   - Annual savings and payback period
   - Local groundwater level
5. **Dashboard**: View and manage saved recommendations

## 🤖 AI & ML Components

### AI Agent (LangChain + GPT-4o)
- **Hydrogeological Analysis**: Fetches 30+ years of rainfall data from Open-Meteo
- **Structure Selection**: Chooses optimal harvesting structure based on:
  - Groundwater depth
  - Roof area
  - Local conditions
- **Cost Optimization**: Calculates materials, labor, and subsidy information

### ML Groundwater Prediction
- **Features**: District, latitude, longitude, and derived geographic features
- **Model**: Trained on regional groundwater data
- **Fallback**: Latitude-based heuristics for unsupported regions
- **Accuracy**: Predicts groundwater level in meters below ground level

### Calculation Algorithms
```python
# Runoff Calculation
annual_runoff = roof_area × annual_rainfall × 0.85

# Annual Savings
annual_savings = (runoff_liters / 1000) × 18  # ₹/kL

# Payback Period
payback_period = total_cost / annual_savings
```

## 🛠️ Technology Stack

### Frontend
- **React 18+** with Vite build tool
- **Zustand** for state management
- **Axios** for API communication
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Backend 1 (API Gateway)
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** authentication with httpOnly cookies
- **CORS** configuration for secure cross-origin requests

### Backend 2 (AI Engine)
- **FastAPI** for high-performance API
- **LangChain** for AI agent orchestration
- **OpenAI GPT-4o** for intelligent recommendations
- **Scikit-learn** for ML model inference
- **Joblib** for model serialization

### External APIs
- **Open-Meteo Archive**: Historical weather data
- **OpenAI API**: Language model inference

## 📁 Project Structure

```
jal-setu/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RoofMapper.jsx
│   │   │   ├── NavbarAL.jsx
│   │   │   └── HeaderAL.jsx
│   │   ├── store/
│   │   │   └── useDataStore.js
│   │   └── pages/
│   │       └── JalSetuPage.jsx
│   ├── package.json
│   └── vite.config.js
├── backend1/
│   ├── models/
│   │   ├── User.js
│   │   └── Data.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── processing.js
│   │   └── data.js
│   ├── middleware/
│   │   └── protectRoute.js
│   └── server.js
├── backend2/
│   ├── main.py
│   ├── final_model.joblib
│   ├── final_preprocessor.joblib
│   └── requirements.txt
└── README.md
```

## 🔒 Security Features

- **JWT Authentication**: Secure httpOnly cookies with 7-day expiry
- **CORS Protection**: Whitelisted frontend origins
- **Input Validation**: Comprehensive request validation
- **Environment Variables**: Sensitive data stored in environment files
- **Same-Site Cookies**: CSRF protection

## 🧪 API Endpoints

### Backend 1 (Node.js)
```
POST /api/auth/signup     - User registration
POST /api/auth/login      - User authentication  
POST /api/auth/logout     - User logout
GET  /api/auth/check      - Authentication status
POST /api/processing      - Submit roof data for AI analysis
GET  /api/data           - Retrieve user recommendations
```

### Backend 2 (FastAPI)
```
POST /get-recommendation-with-gwl  - Get AI recommendation + GWL
POST /predict-gwl                  - Standalone groundwater prediction
GET  /health                       - Health check
GET  /                            - Service status
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For support, email support@jalsetu.com or create an issue on GitHub.

## 🏆 Acknowledgments

- **Smart India Hackathon** for the problem statement
- **Open-Meteo** for weather data API
- **OpenAI** for GPT-4o access
- **MongoDB Atlas** for database hosting
- All contributors and testers

---

**Built with ❤️ for sustainable water management**
