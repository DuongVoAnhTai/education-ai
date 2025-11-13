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

- `POST /api/v1/auth/signup` — signup
- `POST /api/v1/auth/login` — login, returns access + refresh tokens.
- `POST /api/v1/auth/logout` — revokes the active refresh token.
- `POST /api/v1/auth/forgot-password` — forgot-password
- `POST /api/v1/auth/reset-password` — reset-password
- `POST /api/v1/auth/change-password` — requests a password reset email.

## User API

- `GET / PUT /api/v1/users/me` — profile
- `PUT /api/v1/users/change-password` - change-password user
- `GET /api/v1/users/exercise-results` - user exercise result
- `GET /api/v1/users/search` - search user
- `GET / POST /api/v1/users` — manage users (get all, create new)
- `GET / PUT / DELETE /api/v1/users/[id]` — manage specific user by ID

## Admin API

- `GET /api/v1/admin/overview` — admin overview summary

## Cloudinary API

- `GET /api/v1/cloudinary-signature` — get cloudinary signature for direct uploads

## Conversations API

- `GET / POST /api/v1/conversations` — manage conversations (get all, create new)
- `GET / PUT / DELETE /api/v1/conversations/[id]` — manage specific conversation by ID
- `POST /api/v1/conversations/[id]/message` — send message in a conversation

## Dashboard API

- `GET /api/v1/dashboard/summary` — dashboard summary

## Questions API

- `GET / POST /api/v1/questions/[id]/answer-keys` — manage answer keys for a question
- `GET / PUT / DELETE /api/v1/questions/[id]/answer-keys/[keyId]` — manage specific answer key
- `GET / POST /api/v1/questions/[id]/answers` — manage answers for a question
- `GET / POST /api/v1/questions/[id]/options` — manage options for a question
- `GET / PUT / DELETE /api/v1/questions/[id]/options/[optionId]` — manage specific option
- `GET / PUT / DELETE /api/v1/questions/[id]` — manage specific question by ID

## Resources API

- `GET / PUT / DELETE /api/v1/resources/[id]` — manage specific resource by ID

## Skills API

- `GET / POST /api/v1/skills` — manage skills (get all, create new)
- `GET / PUT / DELETE /api/v1/skills/[id]` — manage specific skill by ID
- `GET / POST /api/v1/skills/[id]/exercises` — manage exercises for a skill
- `GET / PUT / DELETE /api/v1/skills/[id]/exercises/[exerciseId]` — manage specific exercise
- `GET / POST /api/v1/skills/[id]/exercises/[exerciseId]/questions` — manage questions for an exercise
- `GET /api/v1/skills/[id]/exercises/[exerciseId]/results` — get exercise results
- `POST /api/v1/skills/[id]/exercises/[exerciseId]/submit` — submit exercise
- `GET / POST /api/v1/skills/[id]/resources` — manage resources for a skill
- `GET / POST /api/v1/skills/[id]/tags` — manage tags for a skill
- `GET / PUT / DELETE /api/v1/skills/[id]/tags/[tagId]` — manage specific tag for a skill

## Tag API

- `GET / POST /api/v1/tag` — manage tags (get all, create new)

PENDING

Sessions capture membership metadata when the customer provides a loyalty number or opts into the program. Orders accrue loyalty points for members.
