# Education Backend

## Environment

1. Copy `.env.example` to `.env` and fill values.
2. Provide `JWT_SECRET`
3. Provide `REDIS_URL`

## Setup

```bash
npm install
npm run dev
npm run socket:dev # server for socket
```

## Key Routes

- `POST /api/v1/auth/login` — login, returns access + refresh tokens.
- `POST /api/v1/auth/logout` — revokes the active refresh token.
- `POST /api/v1/auth/change-password` — requests a password reset email.

## User API

PENDING

Sessions capture membership metadata when the customer provides a loyalty number or opts into the program. Orders accrue loyalty points for members.