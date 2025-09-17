from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import create_engine, Column, String, Boolean, DateTime, Text, Integer
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import List, Optional
from dotenv import load_dotenv
import uuid
import json
import os

# Load environment variables
load_dotenv()

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
ADMIN_SECRET_KEY = os.getenv("ADMIN_SECRET_KEY", "your-admin-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 24 * 60  # 24 hours

# Database Configuration
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./users.db")
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Database Models
class UserDB(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

class AdminDB(Base):
    __tablename__ = "admins"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ActivityLogDB(Base):
    __tablename__ = "activity_logs"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, nullable=True)
    user_name = Column(String, nullable=True)
    type = Column(String, index=True)  # login, logout, register, post_create, etc.
    description = Column(String)
    details = Column(Text, nullable=True)  # JSON string for additional details
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# Create default admin user if doesn't exist
def create_default_admin():
    db = SessionLocal()
    try:
        # Get admin credentials from environment variables
        admin_email = os.getenv("DEFAULT_ADMIN_EMAIL", "admin@example.com")
        admin_password = os.getenv("DEFAULT_ADMIN_PASSWORD", "#Admin@123")
        admin_name = os.getenv("DEFAULT_ADMIN_NAME", "System Admin")
        
        admin = db.query(AdminDB).filter(AdminDB.email == admin_email).first()
        if not admin:
            hashed_password = pwd_context.hash(admin_password)
            admin = AdminDB(
                id=str(uuid.uuid4()),
                name=admin_name,
                email=admin_email,
                password_hash=hashed_password
            )
            db.add(admin)
            db.commit()
            print(f"Default admin created with email: {admin_email}")
        else:
            print(f"Admin already exists with email: {admin_email}")
    except Exception as e:
        print(f"Error creating default admin: {e}")
    finally:
        db.close()

create_default_admin()

# Pydantic Models
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: str
    name: str
    email: str
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class Admin(BaseModel):
    id: str
    name: str
    email: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class AdminToken(BaseModel):
    access_token: str
    token_type: str
    admin: Admin

class ActivityLog(BaseModel):
    id: str
    user_id: Optional[str]
    user_name: Optional[str]
    type: str
    description: str
    details: Optional[dict] = None
    ip_address: Optional[str]
    user_agent: Optional[str]
    timestamp: datetime
    
    class Config:
        from_attributes = True

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Helper function to log activity
def log_activity(db: Session, user_id: str = None, user_name: str = None, 
                activity_type: str = "", description: str = "", 
                details: dict = None, ip_address: str = None, user_agent: str = None):
    activity = ActivityLogDB(
        id=str(uuid.uuid4()),
        user_id=user_id,
        user_name=user_name,
        type=activity_type,
        description=description,
        details=json.dumps(details) if details else None,
        ip_address=ip_address,
        user_agent=user_agent
    )
    db.add(activity)
    db.commit()

# Authentication functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None, is_admin: bool = False):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire, "is_admin": is_admin})
    secret = ADMIN_SECRET_KEY if is_admin else SECRET_KEY
    encoded_jwt = jwt.encode(to_encode, secret, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(UserDB).filter(UserDB.email == email).first()
    if user is None:
        raise credentials_exception
    return user

def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate admin credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, ADMIN_SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        is_admin: bool = payload.get("is_admin", False)
        if email is None or not is_admin:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    admin = db.query(AdminDB).filter(AdminDB.email == email).first()
    if admin is None:
        raise credentials_exception
    return admin

# Initialize FastAPI app
app = FastAPI(
    title="User Management API with Authentication", 
    version="1.0.0",
    description="Secure User Management API with JWT Authentication and Admin Panel"
)

# CORS Configuration - UPDATED
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS", 
    "http://localhost:3000,http://localhost:5173,http://localhost:8080,https://sih-student-mental-health-platform.vercel.app"
).split(",")

# Clean up origins (remove trailing slashes and whitespace)
allowed_origins = [origin.strip().rstrip('/') for origin in allowed_origins if origin.strip()]

print(f"Allowed CORS origins: {allowed_origins}")  # Debug line

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Use the specific origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Public Endpoints
@app.get("/")
async def root():
    return {"message": "Welcome to User Management API with Authentication"}

@app.post("/register", response_model=Token)
def register_user(user: UserCreate, request: Request, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.query(UserDB).filter(UserDB.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = UserDB(
        id=str(uuid.uuid4()),
        name=user.name,
        email=user.email,
        password_hash=hashed_password
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Log activity
    log_activity(
        db, db_user.id, db_user.name, "register", 
        f"User {db_user.name} registered", 
        {"email": db_user.email},
        request.client.host if request.client else None,
        request.headers.get("user-agent")
    )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": db_user
    }

@app.post("/login", response_model=Token)
def login_user(user_credentials: UserLogin, request: Request, db: Session = Depends(get_db)):
    """Login existing user"""
    user = db.query(UserDB).filter(UserDB.email == user_credentials.email).first()
    
    if not user or not verify_password(user_credentials.password, user.password_hash):
        # Log failed login attempt
        log_activity(
            db, None, user_credentials.email, "login_failed", 
            f"Failed login attempt for {user_credentials.email}",
            {"email": user_credentials.email},
            request.client.host if request.client else None,
            request.headers.get("user-agent")
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Log successful login
    log_activity(
        db, user.id, user.name, "login", 
        f"User {user.name} logged in",
        {"email": user.email},
        request.client.host if request.client else None,
        request.headers.get("user-agent")
    )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

# Protected User Endpoints
@app.get("/me", response_model=User)
def get_current_user_info(current_user: UserDB = Depends(get_current_user)):
    """Get current user information"""
    return current_user

@app.get("/dashboard")
def get_dashboard_data(current_user: UserDB = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get dashboard data - protected route"""
    # Log dashboard access
    log_activity(
        db, current_user.id, current_user.name, "dashboard_view", 
        f"User {current_user.name} accessed dashboard"
    )
    
    return {
        "message": f"Welcome to your dashboard, {current_user.name}!",
        "user_id": current_user.id,
        "user_name": current_user.name,
        "user_email": current_user.email,
        "dashboard_data": {
            "total_posts": 15,
            "total_views": 1250,
            "total_likes": 89,
            "recent_activity": [
                {"action": "Created post", "time": "2 hours ago"},
                {"action": "Updated profile", "time": "1 day ago"},
                {"action": "Joined platform", "time": "1 week ago"}
            ]
        }
    }

# Admin Endpoints
@app.post("/admin/login", response_model=AdminToken)
def admin_login(admin_credentials: AdminLogin, request: Request, db: Session = Depends(get_db)):
    """Admin login"""
    admin = db.query(AdminDB).filter(AdminDB.email == admin_credentials.email).first()
    
    if not admin or not verify_password(admin_credentials.password, admin.password_hash):
        # Log failed admin login attempt
        log_activity(
            db, None, admin_credentials.email, "admin_login_failed", 
            f"Failed admin login attempt for {admin_credentials.email}",
            {"email": admin_credentials.email, "admin_attempt": True},
            request.client.host if request.client else None,
            request.headers.get("user-agent")
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect admin credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not admin.is_active:
        raise HTTPException(status_code=400, detail="Inactive admin")
    
    # Log successful admin login
    log_activity(
        db, admin.id, admin.name, "admin_login", 
        f"Admin {admin.name} logged in",
        {"email": admin.email, "admin_login": True},
        request.client.host if request.client else None,
        request.headers.get("user-agent")
    )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": admin.email}, expires_delta=access_token_expires, is_admin=True
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "admin": admin
    }

@app.get("/admin/me", response_model=Admin)
def get_current_admin_info(current_admin: AdminDB = Depends(get_current_admin)):
    """Get current admin information"""
    return current_admin

@app.get("/admin/dashboard")
def get_admin_dashboard_data(current_admin: AdminDB = Depends(get_current_admin), db: Session = Depends(get_db)):
    """Get admin dashboard data"""
    total_users = db.query(UserDB).count()
    active_users = db.query(UserDB).filter(UserDB.is_active == True).count()
    
    # Get recent activities
    recent_activities = db.query(ActivityLogDB).order_by(ActivityLogDB.timestamp.desc()).limit(10).all()
    
    # Convert activities to dict format
    activities_data = []
    for activity in recent_activities:
        activity_dict = {
            "id": activity.id,
            "user_id": activity.user_id,
            "user_name": activity.user_name,
            "type": activity.type,
            "description": activity.description,
            "details": json.loads(activity.details) if activity.details else None,
            "ip_address": activity.ip_address,
            "user_agent": activity.user_agent,
            "timestamp": activity.timestamp
        }
        activities_data.append(activity_dict)
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "total_posts": 45,  # Mock data - replace with actual query
        "total_views": 2340,  # Mock data - replace with actual query
        "recent_system_activity": [
            {
                "type": "user_signup",
                "description": "New user registered",
                "time": "2 hours ago"
            },
            {
                "type": "user_login",
                "description": "User logged in",
                "time": "3 hours ago"
            }
        ]
    }

@app.get("/admin/users")
def get_all_users_admin(
    current_admin: AdminDB = Depends(get_current_admin), 
    db: Session = Depends(get_db),
    sort_by: str = "created_at",
    sort_order: str = "desc"
):
    """Get all users for admin panel"""
    query = db.query(UserDB)
    
    # Apply sorting
    if sort_by == "name":
        query = query.order_by(UserDB.name.desc() if sort_order == "desc" else UserDB.name.asc())
    elif sort_by == "email":
        query = query.order_by(UserDB.email.desc() if sort_order == "desc" else UserDB.email.asc())
    elif sort_by == "last_login":
        query = query.order_by(UserDB.last_login.desc() if sort_order == "desc" else UserDB.last_login.asc())
    else:  # default to created_at
        query = query.order_by(UserDB.created_at.desc() if sort_order == "desc" else UserDB.created_at.asc())
    
    users = query.all()
    
    return {
        "users": users,
        "total": len(users)
    }

@app.get("/admin/activities")
def get_activities(
    current_admin: AdminDB = Depends(get_current_admin),
    db: Session = Depends(get_db),
    filter: str = "all",
    time_range: str = "24h"
):
    """Get user activities for admin monitoring"""
    query = db.query(ActivityLogDB)
    
    # Apply time range filter
    if time_range == "1h":
        since = datetime.utcnow() - timedelta(hours=1)
        query = query.filter(ActivityLogDB.timestamp >= since)
    elif time_range == "24h":
        since = datetime.utcnow() - timedelta(hours=24)
        query = query.filter(ActivityLogDB.timestamp >= since)
    elif time_range == "7d":
        since = datetime.utcnow() - timedelta(days=7)
        query = query.filter(ActivityLogDB.timestamp >= since)
    elif time_range == "30d":
        since = datetime.utcnow() - timedelta(days=30)
        query = query.filter(ActivityLogDB.timestamp >= since)
    
    # Apply activity filter
    if filter == "login":
        query = query.filter(ActivityLogDB.type.in_(["login", "logout", "login_failed"]))
    elif filter == "posts":
        query = query.filter(ActivityLogDB.type.in_(["post_create", "post_view", "post_like"]))
    elif filter == "profile":
        query = query.filter(ActivityLogDB.type.in_(["profile_update", "password_change"]))
    elif filter == "security":
        query = query.filter(ActivityLogDB.type.in_(["login_failed", "password_change", "admin_login"]))
    
    activities = query.order_by(ActivityLogDB.timestamp.desc()).limit(100).all()
    
    # Convert to dict format
    activities_data = []
    for activity in activities:
        activity_dict = {
            "id": activity.id,
            "user_id": activity.user_id,
            "user_name": activity.user_name,
            "type": activity.type,
            "description": activity.description,
            "details": json.loads(activity.details) if activity.details else None,
            "ip_address": activity.ip_address,
            "user_agent": activity.user_agent,
            "timestamp": activity.timestamp
        }
        activities_data.append(activity_dict)
    
    return {
        "activities": activities_data,
        "total": len(activities_data)
    }

@app.post("/admin/users/{user_id}/activate")
def activate_user(user_id: str, current_admin: AdminDB = Depends(get_current_admin), db: Session = Depends(get_db)):
    """Activate a user"""
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = True
    db.commit()
    
    # Log admin action
    log_activity(
        db, current_admin.id, current_admin.name, "admin_action", 
        f"Admin {current_admin.name} activated user {user.name}",
        {"action": "activate_user", "target_user_id": user_id, "admin_action": True}
    )
    
    return {"message": "User activated successfully"}

@app.post("/admin/users/{user_id}/deactivate")
def deactivate_user(user_id: str, current_admin: AdminDB = Depends(get_current_admin), db: Session = Depends(get_db)):
    """Deactivate a user"""
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = False
    db.commit()
    
    # Log admin action
    log_activity(
        db, current_admin.id, current_admin.name, "admin_action", 
        f"Admin {current_admin.name} deactivated user {user.name}",
        {"action": "deactivate_user", "target_user_id": user_id, "admin_action": True}
    )
    
    return {"message": "User deactivated successfully"}

@app.delete("/admin/users/{user_id}")
def delete_user(user_id: str, current_admin: AdminDB = Depends(get_current_admin), db: Session = Depends(get_db)):
    """Delete a user"""
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_name = user.name
    db.delete(user)
    db.commit()
    
    # Log admin action
    log_activity(
        db, current_admin.id, current_admin.name, "admin_action", 
        f"Admin {current_admin.name} deleted user {user_name}",
        {"action": "delete_user", "target_user_id": user_id, "admin_action": True}
    )
    
    return {"message": "User deleted successfully"}

@app.get("/admin/users/{user_id}")
def get_user_details(user_id: str, current_admin: AdminDB = Depends(get_current_admin), db: Session = Depends(get_db)):
    """Get detailed user information"""
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get user's activity history
    user_activities = db.query(ActivityLogDB).filter(ActivityLogDB.user_id == user_id).order_by(ActivityLogDB.timestamp.desc()).limit(20).all()
    
    activities_data = []
    for activity in user_activities:
        activity_dict = {
            "id": activity.id,
            "type": activity.type,
            "description": activity.description,
            "details": json.loads(activity.details) if activity.details else None,
            "ip_address": activity.ip_address,
            "timestamp": activity.timestamp
        }
        activities_data.append(activity_dict)
    
    return {
        "user": user,
        "recent_activities": activities_data
    }

# User Protected Endpoints
@app.put("/profile", response_model=User)
def update_profile(name: str, current_user: UserDB = Depends(get_current_user), db: Session = Depends(get_db)):
    """Update user profile"""
    old_name = current_user.name
    current_user.name = name
    db.commit()
    db.refresh(current_user)
    
    # Log profile update
    log_activity(
        db, current_user.id, current_user.name, "profile_update", 
        f"User updated profile name from {old_name} to {name}",
        {"old_name": old_name, "new_name": name}
    )
    
    return current_user

# Health check
@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    """Health check endpoint"""
    try:
        user_count = db.query(UserDB).count()
        admin_count = db.query(AdminDB).count()
        activity_count = db.query(ActivityLogDB).count()
        return {
            "status": "healthy", 
            "users_count": user_count,
            "admins_count": admin_count,
            "activities_count": activity_count
        }
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

