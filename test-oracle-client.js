// Quick test to verify Oracle Instant Client is detected
const oracledb = require('oracledb');
const fs = require('fs');
const path = require('path');

console.log('Testing Oracle Instant Client detection...\n');

// Check if DLL files exist
const instantClientPath = 'C:\\instantclient_23_9';
const ociDll = path.join(instantClientPath, 'oci.dll');
const oraocieiDll = path.join(instantClientPath, 'oraociei.dll');

console.log('Checking Instant Client files:');
console.log('  Path:', instantClientPath);
console.log('  oci.dll exists:', fs.existsSync(ociDll) ? '✅ YES' : '❌ NO');
console.log('  oraociei.dll exists:', fs.existsSync(oraocieiDll) ? '✅ YES' : '❌ NO');
console.log('');

// Check PATH
const pathEnv = process.env.PATH || '';
const inPath = pathEnv.includes(instantClientPath);
console.log('PATH contains Instant Client:', inPath ? '✅ YES' : '❌ NO');
console.log('');

// Check if Instant Client is available
try {
  // Try to initialize (this will detect Instant Client)
  console.log('Oracle driver version:', oracledb.versionString);
  const clientVersion = oracledb.oracleClientVersionString;
  console.log('Oracle client library version:', clientVersion || 'Not detected');
  console.log('');
  
  // Check if we're in Thin mode or Thick mode
  if (clientVersion) {
    console.log('✅ Instant Client detected - Using THICK mode');
    console.log('   This supports Oracle 11g!');
    console.log('   You can now set DB_ENABLED=true in your .env file');
  } else {
    console.log('⚠️  Instant Client NOT detected - Using THIN mode');
    console.log('   Thin mode does NOT support Oracle 11g');
    console.log('');
    console.log('Troubleshooting:');
    if (!fs.existsSync(ociDll)) {
      console.log('  ❌ oci.dll not found at expected location');
    }
    if (!inPath) {
      console.log('  ❌ Instant Client path not in PATH environment variable');
      console.log('     Try restarting your terminal/IDE');
    }
    if (fs.existsSync(ociDll) && inPath) {
      console.log('  ⚠️  Files exist and PATH is set, but node-oracledb still not detecting');
      console.log('     Try:');
      console.log('     1. Close ALL terminal windows and reopen');
      console.log('     2. Restart your IDE/editor');
      console.log('     3. Restart your computer again');
    }
  }
  
  console.log('\n✅ Test completed!');
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('\nInstant Client may not be properly configured.');
}

