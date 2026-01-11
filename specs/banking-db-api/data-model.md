# Data Model: Banking Database API

## Entity Relationships

### User Entity
```mermaid
classDiagram
    class User {
        +int user_id (PK)
        +str username (unique)
        +str password (hashed)
        +str first_name
        +str last_name
        +date date_of_birth
        +str email
        +str phone
        +str address
        +datetime created_at
        +datetime updated_at
    }
```

**Relationships:**
- One-to-many with Account (user_id → account.user_id)
- One-to-many with Beneficiary (user_id → beneficiary.user_id)

### Account Entity
```mermaid
classDiagram
    class Account {
        +int account_id (PK)
        +int user_id (FK)
        +str account_type
        +decimal balance
        +date open_date
        +datetime created_at
        +datetime updated_at
    }
```

**Relationships:**
- Many-to-one with User (account.user_id → user.user_id)
- One-to-many with Transaction (account_id → transaction.account_id)
- One-to-many with Loan (account_id → loan.account_id)
- One-to-many with Beneficiary (account_id → beneficiary.account_id)
- One-to-many with MobileTopUp (account_id → topup.account_id)
- One-to-many with Bill (account_id → bill.account_id)

### Transaction Entity
```mermaid
classDiagram
    class Transaction {
        +int transaction_id (PK)
        +int account_id (FK)
        +str transaction_type
        +datetime transaction_date
        +decimal amount
        +str description
        +datetime created_at
    }
```

**Relationships:**
- Many-to-one with Account (transaction.account_id → account.account_id)

### Loan Entity
```mermaid
classDiagram
    class Loan {
        +int loan_id (PK)
        +int account_id (FK)
        +str loan_type
        +decimal loan_amount
        +decimal paid_amount
        +decimal interest_amount
        +float interest_rate
        +int loan_term
        +date approval_date
        +date paid_date (nullable)
        +datetime created_at
        +datetime updated_at
    }
```

**Relationships:**
- Many-to-one with Account (loan.account_id → account.account_id)

### Beneficiary Entity
```mermaid
classDiagram
    class Beneficiary {
        +int beneficiary_id (PK)
        +int user_id (FK)
        +int account_id (FK)
        +str recipient_name
        +str account_number
        +str bank_name
        +datetime created_at
    }
```

**Relationships:**
- Many-to-one with User (beneficiary.user_id → user.user_id)
- Many-to-one with Account (beneficiary.account_id → account.account_id)

### MobileTopUp Entity
```mermaid
classDiagram
    class MobileTopUp {
        +int topup_id (PK)
        +int account_id (FK)
        +str mobile_number
        +decimal topup_amount
        +datetime topup_date
        +datetime created_at
    }
```

**Relationships:**
- Many-to-one with Account (topup.account_id → account.account_id)

### BILLNO Entity
```mermaid
classDiagram
    class BILLNO {
        +str bill_no (PK)
        +decimal bill_amount
        +str bill_type
        +date due_date
        +bool bill_paid
        +datetime created_at
        +datetime updated_at
    }
```

## Bill Entity
```mermaid
classDiagram
    class Bill {
        +int billpaid_id (PK)
        +str bill_no (FK)
        +int account_id (FK)
        +str bill_type
        +decimal amount_due
        +date due_date
        +date paid_date (nullable)
        +bool paid
        +datetime created_at
        +datetime updated_at
    }
```

**Relationships:**
- Many-to-one with BILLNO (bill.bill_no → billno.bill_no)
- Many-to-one with Account (bill.account_id → account.account_id)

## Database Schema

### Table Creation Order
1. User
2. Account
3. BILLNO
4. Transaction
5. Loan
6. Beneficiary
7. MobileTopUp
8. Bill

### Indexes
- User.username (unique index)
- Account.user_id (foreign key index)
- Transaction.account_id (foreign key index)
- Loan.account_id (foreign key index)
- Beneficiary.user_id (foreign key index)
- Beneficiary.account_id (foreign key index)
- MobileTopUp.account_id (foreign key index)
- Bill.bill_no (foreign key index)
- Bill.account_id (foreign key index)

### Constraints
- User.username must be unique
- Account.balance must be >= 0
- Transaction.amount must be > 0
- Loan.loan_amount must be > 0
- Loan.paid_amount must be <= loan_amount
- MobileTopUp.topup_amount must be > 0
- Bill.amount_due must be > 0