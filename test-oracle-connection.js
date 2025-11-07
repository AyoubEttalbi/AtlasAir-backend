// Test Oracle database connection with new credentials
require('dotenv').config();
const oracledb = require('oracledb');

async function testConnection() {
  let connection;
  
  try {
    console.log('🔌 Testing Oracle Database Connection...\n');
    console.log('Configuration:');
    console.log('  Host:', process.env.DB_HOST || 'localhost');
    console.log('  Port:', process.env.DB_PORT || '1521');
    console.log('  Username:', process.env.DB_USERNAME);
    console.log('  Service Name:', process.env.DB_SERVICE_NAME);
    console.log('');

    // Check if Instant Client is available
    try {
      const clientVersion = oracledb.oracleClientVersionString;
      if (clientVersion) {
        console.log('✅ Oracle Client detected:', clientVersion);
        console.log('   Mode: THICK (using Instant Client)\n');
      } else {
        console.log('⚠️  Oracle Client NOT detected - Using THIN mode\n');
      }
    } catch (err) {
      console.log('⚠️  Could not detect Oracle Client version\n');
    }

    // Attempt connection
    console.log('Attempting to connect...');
    
    connection = await oracledb.getConnection({
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      connectString: `${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '1521'}/${process.env.DB_SERVICE_NAME}`
    });

    console.log('✅ Connection successful!\n');

    // Test a simple query
    console.log('Testing query...');
    const result = await connection.execute(
      `SELECT 
        SYS_CONTEXT('USERENV', 'SESSION_USER') AS current_user,
        SYS_CONTEXT('USERENV', 'DB_NAME') AS database_name,
        SYS_CONTEXT('USERENV', 'SERVER_HOST') AS server_host
      FROM DUAL`
    );

    console.log('✅ Query executed successfully!\n');
    console.log('Connection Details:');
    console.log('  Current User:', result.rows[0][0]);
    console.log('  Database Name:', result.rows[0][1]);
    console.log('  Server Host:', result.rows[0][2]);
    console.log('\n🎉 Database connection test PASSED!');

  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
    console.error('\nTroubleshooting:');
    
    if (error.message.includes('NJS-503') || error.message.includes('NJS-007')) {
      console.error('  - Oracle Instant Client may not be installed or configured');
      console.error('  - Check that Instant Client is in your PATH');
    } else if (error.message.includes('ORA-01017')) {
      console.error('  - Invalid username or password');
    } else if (error.message.includes('ORA-12514')) {
      console.error('  - Service name not found. Check DB_SERVICE_NAME in .env');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('  - Cannot connect to host. Is Oracle Database running?');
    } else if (error.message.includes('NJS-518')) {
      console.error('  - Connection timeout. Check host and port settings');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('\n✅ Connection closed');
      } catch (err) {
        // Ignore close errors
      }
    }
  }
}

testConnection();

