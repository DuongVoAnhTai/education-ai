# Education-AI (monorepo)

This repository contains three projects:
----- Stand at root folder
- `be` — backend (Nextjs) - npm dev:be
- `fe-administrator` — frontend (Nextjs) - npm dev:fe-admin
- `fe-user` — frontend (Nextjs) - npm dev:fe-user

This repo is set up as a npm workspace. The preferred package manager is npm.

## Quick start (recommended: npm)

You can run the package scripts directly with npm:

```powershell
# At root
npm run dev:be
npm run dev:fe-user
npm run dev:fe-admin
npm run socket # server for socket
```

```powershell
# backend
cd /be
npm install
npm run dev
```

```powershell
# frontend
cd /fe-user
npm install
npm run dev

cd /fe-administrator
npm install
npm run dev
```

In backend contains socket server:
```powershell
# backend
cd /be
npm run socket:dev
```