# Digital Mental Health and Psychological Support System for Students in Higher Education:

**Problem Statement ID:** 25092  
**Problem Statement Title:** Development of a Digital Mental Health and Psychological Support System for Students in Higher Education.

## Project Overview

A comprehensive digital platform designed to provide mental health support, resources, and psychological assistance to students in higher education institutions. This system combines modern web technologies with mental health expertise to create an accessible, user-friendly platform for student wellbeing.

## 🏗️ Project Architecture

### Frontend (React + Vite)
```
mental-health-dashboard/
├── public/
│   ├── index.html
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Login.jsx                    # Student login interface
│   │   ├── Signup.jsx                   # Student registration
│   │   ├── AdminLogin.jsx               # Admin/counselor login
│   │   ├── Navbar.jsx                   # Navigation component
│   │   ├── Dashboard.jsx                # Main student dashboard
│   │   ├── HealthContainer.jsx          # Health metrics container
│   │   ├── FeatureViewer.jsx            # Feature display component
│   │   └── feature-files/
│   │       ├── ai-chat-feature.jsx              # AI-powered mental health chatbot
│   │       ├── booking-feature.jsx              # Counselor appointment booking
│   │       ├── resources-feature.jsx            # Mental health resources library
│   │       ├── peer-support-feature.jsx         # Peer support community
│   │       ├── wellness-check-feature.jsx       # Daily wellness assessments
│   │       ├── crisis-help-feature.jsx          # Emergency crisis support
│   │       ├── admin-dashboard-feature.jsx      # Admin control panel
│   │       └── finding-nearest-doctor-feature.jsx # Location-based doctor finder
│   ├── context/
│   │   └── AuthContext.jsx             # Authentication state management
│   ├── data/
│   │   ├── counselors.js               # Counselor profiles database
│   │   ├── resources.js                # Mental health resources data
│   │   └── assessmentQuestions.js      # Wellness assessment questions
│   ├── App.jsx                         # Main application component
│   ├── App.css                         # Global styling
│   ├── index.css                       # Base styles
│   └── main.jsx                        # Application entry point
├── package.json                        # Dependencies and scripts
├── vite.config.js                      # Vite configuration
├── .gitignore                          # Git ignore rules
└── README.md                           # Project documentation
```

### Backend (FastAPI)
```
backend/
├── main.py                             # FastAPI application server
├── models/                             # Database models
├── routes/                             # API endpoints
├── services/                           # Business logic
└── requirements.txt                    # Python dependencies
```

## 🚀 Application Flow

### **Authentication System**
1. **Student Access**
   - `Login.jsx` → Student login with credentials
   - `Signup.jsx` → New student registration with verification
   - Authenticated users redirected to main dashboard

2. **Admin/Counselor Access**
   - `AdminLogin.jsx` → Separate admin authentication
   - Access to administrative features and student oversight

### **Core Application Navigation**
```
App.jsx (Router) 
├── Unauthenticated → Login/Signup Pages
├── Authenticated Students → Dashboard → Feature Selection
└── Authenticated Admins → Admin Dashboard → Management Tools
```

### **Dashboard & Feature Access**
3. **Main Dashboard** (`Dashboard.jsx`)
   - Central hub for all mental health features
   - Integrated with `Navbar.jsx` for navigation
   - Contains `HealthContainer.jsx` for wellness metrics
   - Uses `FeatureViewer.jsx` for seamless feature display

4. **Mental Health Features** (Located in `feature-files/`)
   - **AI Chat Feature** - Intelligent mental health chatbot for 24/7 support
   - **Booking Feature** - Schedule appointments with qualified counselors
   - **Resources Feature** - Comprehensive mental health resource library
   - **Peer Support Feature** - Connect with fellow students for mutual support
   - **Wellness Check Feature** - Daily mental health assessments and tracking
   - **Crisis Help Feature** - Emergency support and crisis intervention
   - **Admin Dashboard Feature** - Administrative oversight and analytics
   - **Doctor Finder Feature** - Location-based mental health professional finder

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern component-based UI framework
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Recharts** - Data visualization for wellness metrics
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **FastAPI** - High-performance Python web framework
- **Python 3.8+** - Backend programming language
- **SQLAlchemy** - Database ORM (assumed)
- **JWT** - Token-based authentication (assumed)

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Git

### Frontend Setup
```bash
# Clone the repository
git clone <repository-url>
cd mental-health-dashboard

# Install dependencies
npm install

# Install additional charting library
npm install recharts

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload
```

## 🏥 Key Features for Student Mental Health

### **24/7 Support Systems**
- AI-powered chatbot for immediate assistance
- Crisis intervention protocols
- Emergency contact systems

### **Professional Support**
- Easy counselor booking system
- Qualified mental health professional database
- Location-based doctor finder

### **Community & Resources**
- Peer support networks
- Comprehensive resource library
- Educational mental health content

### **Wellness Tracking**
- Daily wellness check-ins
- Mood and stress level monitoring
- Progress visualization with charts

### **Administrative Features**
- Student wellness overview
- Appointment management
- Resource content management
- Analytics and reporting

## 🎯 Target Audience

- **Primary:** Students in higher education institutions
- **Secondary:** University counselors and mental health professionals
- **Tertiary:** Academic administrators and wellness coordinators

## 🔒 Security & Privacy

- Secure authentication system
- HIPAA-compliant data handling (planned)
- Encrypted data transmission
- Privacy-first approach to sensitive mental health data

## 📈 Development Status

This project is currently in active development as part of the SIH (Smart India Hackathon) initiative to address mental health challenges in higher education.

## 🤝 Contributing

This project is developed for educational and social impact purposes. Contributions should focus on:
- Student-centered design
- Mental health best practices
- Accessibility improvements
- Performance optimization

## 📄 License

This project is developed for the Smart India Hackathon and follows applicable educational use guidelines.

## 📞 Support

For technical support or mental health resources:
- Check the in-app resources library
- Contact university counseling services
- Access crisis help feature for emergencies

---

**Note:** This system is designed to supplement, not replace, professional mental health services. Students experiencing serious mental health concerns should seek immediate professional help.
