# TransitOps Backend

TransitOps is a production-ready Transport Management ERP built with Node.js, Express.js, and PostgreSQL.

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database Driver:** `pg` (PostgreSQL Client)
- **Security:** bcrypt, jsonwebtoken (JWT)
- **Validation:** express-validator
- **File Uploads:** multer

## Getting Started

### Prerequisites
- Node.js (>= 18.0.0)
- PostgreSQL database instance

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env` file.

### Running the Application
- **Development mode (with nodemon):**
  ```bash
  npm run dev
  ```
- **Production mode:**
  ```bash
  npm start
  ```
