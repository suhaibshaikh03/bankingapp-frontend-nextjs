# Quickstart Guide: Banking Database API

## Getting Started

### Prerequisites
- Python 3.9+
- pip package manager
- MySQL database (or compatible database)
- Node.js and npm (for frontend integration)

### Local Development Setup

1. **Clone and Navigate to Backend Directory**
```bash
mkdir banking-app-backend
cd banking-app-backend
```

2. **Create Virtual Environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install Dependencies**
```bash
pip install fastapi uvicorn sqlmodel python-jose[cryptography] passlib[bcrypt] python-dotenv
```

4. **Create Environment File**
```bash
touch .env
```

Add the following to your `.env` file:
```
DATABASE_URL=sqlite:///./banking_app.db
SECRET_KEY=your-secret-key-change-this-to-a-random-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

5. **Initialize the Project Structure**
Create the directory structure as defined in plan.md:
```
banking-app-backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── account.py
│   │   ├── transaction.py
│   │   ├── loan.py
│   │   ├── beneficiary.py
│   │   ├── mobile_topup.py
│   │   └── bill.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── account.py
│   │   ├── transaction.py
│   │   ├── loan.py
│   │   ├── beneficiary.py
│   │   ├── mobile_topup.py
│   │   └── bill.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── accounts.py
│   │   ├── transactions.py
│   │   ├── loans.py
│   │   ├── beneficiaries.py
│   │   ├── topups.py
│   │   └── bills.py
│   └── utils/
│       ├── __init__.py
│       ├── security.py
│       └── validators.py
```

## Running the Application

### Development
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Frontend Integration

### Connecting Frontend to Backend
1. Ensure CORS is configured in FastAPI to allow requests from http://localhost:3000
2. Set up API client in Next.js to make requests to https://bankingapp-backend-580700595487.europe-west1.run.app/
3. Handle JWT tokens for authentication

### Example API Call from Frontend
```javascript
// Example login call
const login = async (credentials) => {
  const response = await fetch('https://bankingapp-backend-580700595487.europe-west1.run.app/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (response.ok) {
    const data = await response.json();
    // Store token and redirect
    localStorage.setItem('token', data.access_token);
    window.location.href = '/dashboard';
  }
};
```

## Common Commands

### Database Migrations (when using Alembic)
```bash
# Initialize Alembic (first time only)
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Initial migration"

# Apply migration
alembic upgrade head
```

### Running Tests
```bash
pytest
```

## Troubleshooting

### Common Issues
1. **Database Connection**: Ensure DATABASE_URL is properly configured in .env
2. **CORS Errors**: Verify CORS middleware allows requests from frontend origin
3. **JWT Authentication**: Check that tokens are properly included in request headers
4. **Port Conflicts**: Ensure ports 8000 (backend) and 3000 (frontend) are available

### Debugging Tips
- Enable logging in FastAPI for request/response inspection
- Use environment-specific configurations
- Check database connection before starting the application
- Verify all dependencies are properly installed