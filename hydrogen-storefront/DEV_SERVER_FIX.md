# Dev Server Crash Fix

## Problem
The dev server was crashing due to an unhandled promise rejection when MiniOxygen tries to fetch the Hydrogen changelog. The socket error (`UND_ERR_SOCKET`) was causing the Node.js process to exit.

## Solution
Added `NODE_OPTIONS='--unhandled-rejections=warn'` to the dev script. This prevents unhandled promise rejections from crashing the server, instead logging them as warnings.

## How to Use
Simply run:
```bash
npm run dev
```

The server should now continue running even if the changelog fetch fails.

## Alternative Solutions
If the issue persists, you can also:

1. **Clear all caches:**
   ```bash
   rm -rf node_modules/.vite .react-router dist
   npm run dev
   ```

2. **Use a different port:**
   ```bash
   PORT=3001 npm run dev
   ```

3. **Check for port conflicts:**
   ```bash
   lsof -ti:3000 | xargs kill -9
   npm run dev
   ```

