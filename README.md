# Wanderly API

Backend for **Wanderly**, a tourist spots information system. Tourists can browse spots, organized by category, and leave reviews. Admins manage the spots, categories and accounts.

Built for ITEC 116 (Systems Integration and Architecture 2) as the Final Project.

## Tech Stack

| Component | Technology |
|---|---|
| Backend framework | NestJS |
| ORM | TypeORM |
| Database | MySQL |
| Authentication | JWT (with bcrypt password hashing) |
| Validation | class-validator / class-transformer |
| API testing | Postman |

## Features

- JWT login with protected routes and role-based access (`tourist`, `admin`)
- Passwords hashed with bcrypt, never stored in plain text
- Input validation: unknown fields are rejected and bad values return `400`
- Consistent JSON error format through a global exception filter
- CRUD modules: Tourists, Admins, Categories, Tourist Spots, Reviews
- Filtering and pagination on list endpoints
- Relational database with foreign keys between spots, categories, tourists and reviews

## Project Structure

```
src/
  auth/         login, JWT, profile
  admins/       admin accounts
  tourists/     tourist accounts (registration)
  categories/   spot categories
  spots/        tourist spots
  reviews/      reviews of spots
  common/       guards, decorators, enums, filters, utils
```

## Run Locally

**Requirements:** Node.js 20+ and MySQL running on your machine.

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/strawcy/wanderly-api.git
   cd wanderly-api
   npm install
   ```
2. Create the database in MySQL:
   ```sql
   CREATE DATABASE wanderly_db;
   ```
3. Copy `.env.example` to `.env` and fill in your own values:
   ```bash
   cp .env.example .env
   ```
4. Start the server:
   ```bash
   npm run start:dev
   ```

The API runs at `http://localhost:3001/api/v1` (or the `PORT` you set). Tables are created automatically when `DB_SYNC=true`.

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port the API listens on |
| `DB_HOST`, `DB_PORT` | MySQL host and port |
| `DB_USERNAME`, `DB_PASSWORD` | MySQL credentials |
| `DB_NAME` | Database name (`wanderly_db`) |
| `DB_SYNC` | `true` creates or updates tables automatically (development only) |
| `JWT_SECRET` | Secret used to sign tokens |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `1h` |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Credentials for the default admin account |

## API Overview

All routes start with `/api/v1`. Send the token from login as `Authorization: Bearer <token>` on protected routes.

| Resource | Base path |
|---|---|
| Auth (login, profile) | `/auth` |
| Tourists | `/tourists` |
| Admins | `/admins` |
| Categories | `/categories` |
| Tourist spots | `/tourist-spots` |
| Reviews | `/reviews` |

A Postman collection with example requests is included in the project submission.

## Scripts

```bash
npm run start:dev   # development with auto-reload
npm run build       # compile to dist/
npm run start:prod  # run the compiled build
npm test            # unit tests
npm run test:e2e    # end-to-end tests
```

## Author

Eunice Villanueva, Cavite State University - Imus Campus
