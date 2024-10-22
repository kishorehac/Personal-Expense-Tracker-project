###
Personal Expense Tracker 

## Description
A RESTful API for managing personal financial records, allowing users to record their income and expenses, retrieve past transactions, and get summaries.

## Setup and Run Instructions
npm init -y
npm install express body-parser cors bcrypt jsonwebtoken sqlite3
npm install
node app.js

### Prerequisites
- Node.js (>= 12.x)
- npm (Node package manager)

### API Documentation
### Authentication
User Registration
Endpoint: POST /register
Request Body:
json
{
    "username": "your_username",
    "password": "your_password"
}
###
User Login
Endpoint: POST /login
Request Body:
json
{
    "username": "your_username",
    "password": "your_password"
}
###
Transactions
Add a New Transaction
Endpoint: POST /transactions
Authorization: Bearer token
Request Body:
json
{
    "type": "expense",
    "category": "Food",
    "amount": 10.5,
    "date": "2024-01-01",
    "description": "Groceries"
}
###
Get All Transactions
Endpoint: GET /transactions
Authorization: Bearer token
###
Get a Transaction by ID
Endpoint: GET /transactions/:id
Authorization: Bearer token
###
Update a Transaction by ID
Endpoint: PUT /transactions/:id
Authorization: Bearer token
Request Body:
json
{
    "type": "expense",
    "category": "Dining",
    "amount": 20.0,
    "date": "2024-01-02",
    "description": "Dinner out"
}
###
Delete a Transaction by ID
Endpoint: DELETE /transactions/:id
Authorization: Bearer token
###
Get Transaction Summary
Endpoint: GET /summary
Authorization: Bearer token

### Error Handling
Common errors and responses are documented in the API documentation section.

### Image

[Screenshot (46)](https://github.com/user-attachments/assets/47c8bd48-b8e6-4782-9007-3cde9b1e251c)
![Screenshot (47)](https://github.com/user-attachments/assets/9fcb5df3-5b74-480e-9b72-82ae71f5ab40)
![Screenshot (48)](https://github.com/user-attachments/assets/a642e779-576e-446d-bfa8-856737670cef)
![Screenshot (49)](https://github.com/user-attachments/assets/44cf510e-1894-4062-bdae-235a16e1f328)
![Screenshot (50)](https://github.com/user-attachments/assets/654ee37b-9c63-4756-8819-65a5caa79043)
![Screenshot (51)](https://github.com/user-attachments/assets/8f1402cc-6bee-48c1-b71f-993c804376b4)
![Screenshot (52)](https://github.com/user-attachments/assets/cd079c29-15e0-4a04-8fe1-f1e4b5b52b0a)
![Screenshot (53)](https://github.com/user-attachments/assets/b1fe1b77-99e7-4cd0-ac76-9eefe175f7b8)


###
Use npm install to install the packages.

Export the express instance using the default export syntax.

Use Common JS module syntax.


