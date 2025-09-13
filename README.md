This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## USER MANUAL:

- We use PostGreSQL for this project, we will use it on 'supabase' website which support for PostGre

- To push data in file /prisma/schema.prisma to supabase, we will use:

```bash
npx prisma migrate dev --name init
# or
npx prisma db push
# (search prisma document for details)
```
    
- To seed db, we will use:

```bash 
npx prisma db seed
```    