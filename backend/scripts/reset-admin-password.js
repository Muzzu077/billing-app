const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function resetPassword() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ DATABASE_URL not found in .env');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: connectionString,
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
  });

  try {
    const username = 'AyeshaEle';
    const password = 'Afaanreyo';

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    console.log(`⏳ Updating password for admin "${username}"...`);
    
    // Check if admin exists
    const check = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    if (check.rows.length === 0) {
      console.log(`ℹ️ Admin "${username}" does not exist. Creating instead...`);
      await pool.query(
        'INSERT INTO admins (username, password, display_name, price_multiplier) VALUES ($1, $2, $3, $4)',
        [username, hash, 'Ayesha Electrical', 1.0]
      );
    } else {
      await pool.query('UPDATE admins SET password = $1 WHERE username = $2', [hash, username]);
    }
    
    console.log(`✅ Password successfully updated/created for "${username}"!`);

  } catch (error) {
    console.error('❌ Failed to update password:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

resetPassword();
