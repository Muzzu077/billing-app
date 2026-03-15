const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function runSetup() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ DATABASE_URL not found in .env');
    process.exit(1);
  }

  const urlObj = new URL(connectionString);
  const dbName = urlObj.pathname.slice(1) || 'billing'; // extract db name
  
  // 1. Connect to 'postgres' default database first to ensure the 'billing' db exists
  urlObj.pathname = '/postgres';
  const initPool = new Pool({
    connectionString: urlObj.toString(),
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
  });

  try {
    console.log(`⏳ Checking for database "${dbName}"...`);
    await initPool.query(`CREATE DATABASE ${dbName}`);
    console.log(`✅ Created database "${dbName}"`);
  } catch (e) {
    if (e.code === '42P04') { // duplicate_database
      console.log(`ℹ️ Database "${dbName}" already exists.`);
    } else {
      console.error('❌ Failed creating database:', e.message);
    }
  } finally {
    await initPool.end();
  }

  // 2. Now connect to target database to create schema
  const pool = new Pool({
    connectionString: connectionString,
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
  });

  try {

    const sqlPath = path.join(__dirname, '../billing-app-setup.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('⏳ Running billing-app-setup.sql...');
    await pool.query(sql);
    console.log('✅ Database tables and schema created successfully!');

  } catch (error) {
    console.error('❌ Failed to execute SQL setup:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runSetup();
