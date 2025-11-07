# Oracle 11g Setup Guide

## Problem

Oracle Database 11g Express Edition is **not supported** by `node-oracledb` in **Thin mode** (the default). Thin mode requires Oracle Database 12.2 or later.

## Solutions

You have three options:

### Option 1: Install Oracle Instant Client (Recommended for 11g)

Oracle Instant Client enables **Thick mode**, which supports Oracle 11g.

#### Steps:

1. **Download Oracle Instant Client:**
   - Go to: https://www.oracle.com/database/technologies/instant-client/downloads.html
   - Download **Instant Client Basic Package** for Windows x64
   - Choose version that matches your Oracle 11g (usually 11.2 or 12.1 works)

2. **Install Oracle Instant Client:**
   - Extract the ZIP file to a location like `C:\oracle\instantclient_11_2`
   - **Important**: Add this path to your system PATH environment variable:
     - Windows: System Properties → Environment Variables → Add `C:\oracle\instantclient_11_2` to PATH

3. **Install the Visual C++ Redistributable:**
   - Oracle Instant Client requires Visual C++ Redistributable
   - Download from Microsoft if not already installed

4. **Restart your computer** (to ensure PATH changes take effect)

5. **Verify installation:**
   ```bash
   # Check if Oracle libraries are accessible
   # The node-oracledb will automatically detect Instant Client
   ```

6. **Restart your NestJS application:**
   ```bash
   npm run start:dev
   ```

The node-oracledb driver will automatically use Thick mode when Instant Client is detected.

### Option 2: Upgrade to Oracle 12c+ (Best Long-term Solution)

Upgrade to Oracle Database 12.2 or later to use Thin mode (no Instant Client needed).

- **Oracle XE 18c/19c/21c** all support Thin mode
- Download from Oracle's website
- This is the recommended approach for new projects

### Option 3: Use SQLite for Development (Temporary Workaround)

If you need to continue development immediately, you can use SQLite temporarily:

1. **Update `.env`:**
   ```env
   DB_ENABLED=false
   ```

2. **The application will automatically use SQLite in-memory database**
   - All your code will work
   - No database setup needed
   - Data won't persist (in-memory)
   - Perfect for development/testing

3. **When ready for Oracle:**
   - Install Instant Client (Option 1) or upgrade (Option 2)
   - Then set `DB_ENABLED=true` again

## Quick Test

After installing Instant Client, test the connection:

```bash
# Restart your terminal/command prompt
npm run start:dev
```

You should see:
- ✅ Database connected successfully
- ✅ No NJS-138 errors

## Verification

To verify Instant Client is installed correctly:

1. **Check PATH:**
   ```bash
   echo %PATH%
   # Should include your Instant Client path
   ```

2. **Check if node-oracledb detects it:**
   - The error will change from "NJS-138" to connection success
   - Or you'll see a different error (like connection refused, which means it's trying to connect)

## Troubleshooting

### "Cannot find module 'oracledb'"
- Run: `npm install oracledb`

### "Instant Client not found"
- Make sure Instant Client is in your PATH
- Restart your computer after adding to PATH
- Restart your terminal/IDE

### Still getting NJS-138
- Make sure you downloaded the correct version of Instant Client
- Check that the PATH is set correctly
- Try restarting your computer

## Recommended Path

For Oracle 11g:
1. **Short-term**: Use SQLite (set `DB_ENABLED=false`) to continue development
2. **Medium-term**: Install Oracle Instant Client for Thick mode
3. **Long-term**: Upgrade to Oracle 18c/19c/21c XE for better support

## Need Help?

If you're still having issues:
1. Share the exact error message
2. Confirm Instant Client is in your PATH
3. Check Oracle Database version: `SELECT * FROM v$version;`


