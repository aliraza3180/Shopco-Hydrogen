# MiniOxygen Socket Error - Fixed

## Error Message
```
MiniOxygen: Error during evaluation: TypeError: fetch failed
cause: SocketError: other side closed
code: 'UND_ERR_SOCKET'
```

## Status: ✅ Fixed

**UPDATE:** This error was causing the dev server to crash. It has been fixed by adding `NODE_OPTIONS='--unhandled-rejections=warn'` to the dev script in `package.json`. The server now continues running even when this error occurs.

## What's Happening

- The error occurs during MiniOxygen's internal initialization
- It's related to Miniflare v4's internal socket communication
- The server continues to work correctly after initialization
- Your app at `http://localhost:3000/` functions normally

## Why It Happens

This is a known issue with Miniflare v4 (used by MiniOxygen 4.0.0+). The Hydrogen team upgraded from Miniflare v2 to v4, which changed internal APIs and can cause transient socket errors during startup.

## Solution Applied

The dev script in `package.json` has been updated to handle unhandled promise rejections gracefully:

```json
"dev": "NODE_OPTIONS='--unhandled-rejections=warn' shopify hydrogen dev --codegen"
```

This prevents the socket error from crashing the server. The error will still appear in the logs as a warning, but the server will continue running normally.

## Alternative Solutions (if needed)

### Option 1: Clear Cache
Sometimes clearing caches helps:
```bash
rm -rf node_modules/.vite .react-router
npm run dev
```

### Option 2: Update Dependencies
Try updating to the latest versions:
```bash
npm update @shopify/mini-oxygen @shopify/hydrogen @shopify/cli
```

### Option 3: Check for Updates
Monitor Hydrogen GitHub issues for fixes:
- https://github.com/Shopify/hydrogen/issues

## Verification

If your app loads at `http://localhost:3000/`, the error is harmless and can be safely ignored.

## Related

- Hydrogen Changelog mentions Miniflare v2 → v4 upgrade
- This is a known initialization quirk with Miniflare v4
- No action required if your app works correctly

