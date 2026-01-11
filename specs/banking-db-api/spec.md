# Banking Database API Specification

## Feature Description
Create a database and API routes for a banking application using SQLModel ORM and FastAPI. The database should be based on an existing MySQL schema with tables for users, accounts, transactions, loans, beneficiaries, mobile top-ups, and bills. The API should follow RESTful principles with proper CRUD operations and organized into separate modules by entity type.

## Key Entities
- **Users**: User account information (username, password, personal details)
- **Accounts**: Bank accounts linked to users (account type, balance)
- **Transactions**: Financial transactions (type, amount, description)
- **Loans**: Loan information (type, amount, terms, payment status)
- **Beneficiaries**: Beneficiary accounts for transfers
- **MobileTopUps**: Mobile recharge transactions
- **Bills**: Bill payment information

## User Scenarios & Testing

### Scenario 1: User Management
- As a banking admin, I want to create, read, update, and delete user accounts
- As a banking admin, I want to authenticate users securely

### Scenario 2: Account Management
- As a user, I want to view my account details and balance
- As a banking admin, I want to create and manage user accounts

### Scenario 3: Transaction Processing
- As a user, I want to view my transaction history
- As a banking system, I want to process deposits, withdrawals, and transfers

### Scenario 4: Loan Management
- As a user, I want to apply for loans and view loan status
- As a banking admin, I want to approve and manage loans

### Scenario 5: Payment Services
- As a user, I want to make bill payments and mobile top-ups
- As a banking admin, I want to manage beneficiaries

## Functional Requirements

### FR1: Database Model Requirements
- R1.1: Users table with fields: user_id (PK), username (unique), password, first_name, last_name, date_of_birth, email, phone, address
- R1.2: Accounts table with fields: account_id (PK), user_id (FK), account_type, balance, open_date
- R1.3: Transactions table with fields: transaction_id (PK), account_id (FK), transaction_type, transaction_date, amount, description
- R1.4: Loans table with fields: loan_id (PK), account_id (FK), loan_type, loan_amount, paid_amount, interest_amount, interest_rate, loan_term, approval_date, paid_date
- R1.5: Beneficiaries table with fields: beneficiary_id (PK), user_id (FK), account_id (FK), recipient_name, account_number, bank_name
- R1.6: MobileTopUps table with fields: topup_id (PK), account_id (FK), mobile_number, topup_amount, topup_date
- R1.7: BILLNO table with fields: bill_no (PK), bill_amount, bill_type, due_date, bill_paid
- R1.8: Bills table with fields: billpaid_id (PK), bill_no (FK), account_id (FK), bill_type, amount_due, due_date, paid_date, paid

### FR2: API Endpoint Requirements
- R2.1: User management endpoints (GET, POST, PUT, DELETE) at /users/
- R2.2: Account management endpoints (GET, POST, PUT, DELETE) at /accounts/
- R2.3: Transaction endpoints (GET, POST) at /transactions/
- R2.4: Loan management endpoints (GET, POST, PUT) at /loans/
- R2.5: Beneficiary management endpoints (GET, POST, DELETE) at /beneficiaries/
- R2.6: Mobile top-up endpoints (GET, POST) at /topups/
- R2.7: Bill payment endpoints (GET, POST) at /bills/

### FR3: Security Requirements
- R3.1: Secure password storage using hashing
- R3.2: Proper authentication and authorization mechanisms
- R3.3: Input validation for all API endpoints

### FR4: Data Integrity Requirements
- R3.1: Foreign key constraints maintained
- R3.2: Proper cascading deletes where appropriate
- R3.3: Data validation at the model level

## Success Criteria
- 95% of API requests complete successfully
- Database operations complete within 500ms
- All CRUD operations available for each entity
- API endpoints organized into logical modules
- Dependency injection properly implemented for database sessions
- All foreign key relationships properly enforced
- Support for concurrent access without data corruption

## Assumptions
- The database URL is stored in a .env file in the fastapi-backend folder as DATABASE_URL
- The application will use SQLModel ORM for database operations
- FastAPI will be used for the API framework with proper dependency injection
- Sessions will be managed using the provided get_session function
- The database engine will be created using create_engine from SQLModel

## Dependencies
- SQLModel ORM
- FastAPI
- Environment variable management for database connection
- Database driver (likely asyncpg for PostgreSQL or PyMySQL for MySQL)

## Documentation Resources
For the most up-to-date documentation and best practices, use the Context7 MCP server:

### Using Context7 MCP Server for Latest Docs
The Context7 MCP server is configured with:
- Server URL: https://mcp.context7.com/mcp
- API Key: ctx7sk-e9a27e9d-df01-4c72-950f-54810d940ac8

To get the latest SQLModel, FastAPI, and other library documentation directly from the terminal:

1. Use the Context7 tools directly:
```bash
python .claude/skills/fetch-library-docs/scripts/mcp-client.py call -s "npx -y @upstash/context7-mcp" -t query-docs -p '{"libraryId": "/websites/sqlmodel_tiangolo", "query": "your SQLModel query here"}'

python .claude/skills/fetch-library-docs/scripts/mcp-client.py call -s "npx -y @upstash/context7-mcp" -t query-docs -p '{"libraryId": "/tiangolo/fastapi", "query": "your FastAPI query here"}'
```

2. Or use the fetch-docs script:
```bash
bash .claude/skills/fetch-library-docs/scripts/fetch-docs.sh --library-id /websites/sqlmodel_tiangolo --topic "your topic" --content-type examples,api-ref
```

Common library IDs:
- SQLModel: `/websites/sqlmodel_tiangolo`
- FastAPI: `/tiangolo/fastapi`
- SQLAlchemy: `/sqlalchemy/sqlalchemy`
- Pydantic: `/pydantic/pydantic`

## Constraints
- Must use SQLModel ORM as specified
- Must follow RESTful API design principles
- Must implement proper error handling
- Must use dependency injection for database sessions
- Same type of API routes should be grouped in separate folders