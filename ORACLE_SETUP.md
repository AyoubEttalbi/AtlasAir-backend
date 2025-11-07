# Oracle Database Setup Troubleshooting Guide

## Finding Your Oracle Service Name and Username

### Step 1: Find the Service Name

You have several options to find your Oracle service name:

#### Option A: Using SQL*Plus (Command Line)

1. Open **Command Prompt** (cmd) or **PowerShell**
2. Type one of these commands:

   **Try with XE:**
   ```bash
   sqlplus root/Ayoubettalbi2004@localhost:1521/XE
   ```
   
   **Or try with XEPDB1:**
   ```bash
   sqlplus root/Ayoubettalbi2004@localhost:1521/XEPDB1
   ```

3. If one of them works and connects, that's your service name!

4. Once connected, run this query to see all available services:
   ```sql
   SELECT name FROM v$services;
   ```

#### Option B: Using SQL Developer (GUI)

1. Open **Oracle SQL Developer**
2. Click **New Connection** (green plus icon)
3. Fill in:
   - **Username**: `root` or `ayoub_admin`
   - **Password**: `Ayoubettalbi2004`
   - **Hostname**: `localhost` or `127.0.0.1`
   - **Port**: `1521`
   - **Service name**: Try `XE` or `XEPDB1`

4. Click **Test** - if it says "Success", note the service name you used
5. The **Service name** field shows what works

#### Option C: Check APEX Connection String

Since you have APEX running, check the connection string:
- Look at your APEX URL: `http://127.0.0.1:8080/apex/...`
- The connection string might be in APEX settings
- Or check the database connection details in APEX

### Step 2: Verify the Username

Oracle typically doesn't use "root" as a username. Common options:

1. **Try `ayoub_admin`** (the APEX username you mentioned):
   ```env
   DB_USERNAME=ayoub_admin
   ```

2. **Or check if you need to create a user**:
   ```sql
   -- Connect as SYSTEM or SYS first
   CREATE USER flight_user IDENTIFIED BY Ayoubettalbi2004;
   GRANT CONNECT, RESOURCE, DBA TO flight_user;
   ```

### Step 3: Update Your .env File

Once you know the correct service name and username, update your `.env`:

```env
DB_ENABLED=true
DB_HOST=127.0.0.1
DB_PORT=1521
DB_USERNAME=ayoub_admin          # or root, or the username that works
DB_PASSWORD=Ayoubettalbi2004
DB_SERVICE_NAME=XE               # or XEPDB1, or the service name you found
DB_SYNCHRONIZE=true
```

### Step 4: Common Service Names

Based on Oracle Database versions:
- **Oracle XE 18c/19c**: Usually `XE`
- **Oracle XE 21c**: Usually `XEPDB1`
- **Oracle Standard/Enterprise**: Usually `ORCL` or custom name

### Step 5: Verify Database is Running

Make sure:
1. Oracle Database service is running (check Windows Services)
2. Oracle Listener is running (check Windows Services - "OracleServiceXE" or similar)
3. Port 1521 is not blocked by firewall

### Quick Test Commands

**Test connection with different service names:**
```bash
# Try XE
sqlplus root/Ayoubettalbi2004@127.0.0.1:1521/XE

# Try XEPDB1  
sqlplus root/Ayoubettalbi2004@127.0.0.1:1521/XEPDB1

# Try with ayoub_admin username
sqlplus ayoub_admin/Ayoubettalbi2004@127.0.0.1:1521/XE
```

**Check if listener is running:**
```bash
lsnrctl status
```

**Check registered services:**
```bash
lsnrctl services
```

## Still Having Issues?

If you're still getting errors:

1. **Check Oracle Database is running:**
   - Windows Services → Look for "OracleServiceXE" or similar
   - Make sure it's "Running"

2. **Check the listener:**
   - Windows Services → Look for "OracleOraDB21Home1TNSListener" or similar
   - Make sure it's "Running"

3. **Check port 1521:**
   ```bash
   netstat -an | findstr 1521
   ```
   Should show LISTENING on port 1521

4. **Try connecting with different username:**
   - Try `ayoub_admin` instead of `root`
   - Oracle APEX username might be different from database username

5. **Share the output:**
   - Run `SELECT name FROM v$services;` and share the results
   - Share any error messages you get when testing connections


