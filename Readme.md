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
- `POST /api/drops` - Insert a new drop
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

## Database and Schema Setup

The project uses **Sequelize** as the ORM. The SQL schema is automatically managed through:
- **`sequelize.sync({ alter: true })`**: This command is called when the database connects, ensuring that the tables are created or updated to match the models defined in the code without losing existing data (where possible).
- This approach simplifies the setup as there's no need to manually run `.sql` files to create the schema.

## Architecture Decisions

### 60-Second Reservation Expiry
To handle the 60-second expiration logic for sneaker reservations, we implemented a background job architecture:
- **`node-cron`**: We use a cron job that runs every minute (`* * * * *`).
- **Processing**: The job queries all `ACTIVE` reservations that have expired (`expiresAt < now`).
- **Restoration**: For each expired reservation, it:
    1. Updates the status to `EXPIRED`.
    2. Increments the `availableStock` on the associated sneaker drop.
    3. Broadcasts the updated stock to all connected clients via **Socket.io**.

### Concurrency Handling
Preventing multiple users from claiming the same last item is critical in a high-demand drop environment. We handled this using:
- **Sequelize Transactions**: All stock deductions and reservation creations are wrapped in a database transaction to ensure atomicity.
- **Row-Level Locking**: We use `lock: t.LOCK.UPDATE` within the transaction during the `findOne` query for the drop. This puts a "SELECT FOR UPDATE" lock on the specific sneaker drop row, preventing other concurrent transactions from reading or modifying the stock until the current transaction commits or rolls back.
- **Stock Validation**: Inside the locked transaction, we check if `availableStock > 0` before proceeding. This guarantees that stock is only deducted if it's truly available, even under heavy concurrent load.

---
