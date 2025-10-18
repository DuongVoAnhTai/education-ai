This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Education AI User Web

### 1. Run the development server:

```bash
npm install
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### 2. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate 
```

## 🌐 API Documentation
### Available Endpoints

#### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/signup` - User registration

#### Users
- `GET /api/v1/users` - Get all users (protected)
- `GET /api/v1/users/:id` - Get user by ID (protected)
- `GET /api/v1/users/me` - Get user user profile (protected)
- `PUT /api/v1/users/:id` - Update user (protected)
- `DELETE /api/v1//users/:id` - Delete user (protected)