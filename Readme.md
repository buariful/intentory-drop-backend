# Sneaker Drop Backend

This is the backend for the Sneaker Drop application, built with Node.js, Express, and Sequelize (PostgreSQL). It handles user authentication, sneaker drop management, reservations, and real-time stock updates via Socket.io.

## Technologies Used

- **Node.js**: Runtime environment
- **Express**: Web framework
- **Sequelize**: ORM for PostgreSQL
- **Socket.io**: Real-time bidirectional communication
- **node-cron**: Background job scheduling
- **JWT**: JSON Web Tokens for authentication
- **Zod**: Schema validation
- **Bcrypt**: Password hashing

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database

## Installation

1.  **Clone the repository** (if not already done).
2.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```

## Environment Variables

Create a `.env` file in the `backend` directory and add the following:

```env
PORT=4000
DATABASE_URL=postgres://your_user:your_password@localhost:5432/your_db_name
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
```

## Running the Application

### Development Mode (with Nodemon)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will be running at `http://localhost:4000`.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new account
- `POST /api/auth/login` - Login to an existing account
- `POST /api/auth/logout` - Logout and invalidate session
- `POST /api/auth/refresh` - Refresh access token

### Sneaker Drops
- `GET /api/drops` - Fetch all active sneaker drops (includes active reservations and recent buyers)
- `POST /api/drops/:dropId/reserve` - Reserve a sneaker from a drop (valid for 60 seconds)
- `POST /api/drops/:reserveId/purchase` - Purchase a reserved sneaker

## Real-time Updates (WebSockets)

The backend uses Socket.io to broadcast stock changes.
- **Event**: `stock_update`
- **Payload**: `{ dropId, availableStock }`

## Background Jobs

A cron job runs every minute to automatically:
- Identify expired `ACTIVE` reservations.
- Mark them as `EXPIRED`.
- Restore the stock back to the associated sneaker drop.
- Broadcast the updated stock via WebSockets.
