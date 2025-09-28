const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Admin = require('../models/Admin');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const parseArgs = () => {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--username' || a === '-u') out.username = args[++i];
    if (a === '--password' || a === '-p') out.password = args[++i];
  }
  return out;
};

(async () => {
  try {
    const { username: argUser, password: argPass } = parseArgs();
    const username = argUser || process.env.ADMIN_USERNAME;
    const password = argPass || process.env.ADMIN_PASSWORD;

    if (!username || !password) {
      console.error('ERROR: Please provide credentials. Use --username <name> --password <pass> or set ADMIN_USERNAME and ADMIN_PASSWORD in env.');
      process.exit(1);
    }

    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/billing-app';
    await mongoose.connect(mongoUri);

    let admin = await Admin.findOne({ username });
    if (!admin) {
      admin = new Admin({ username, displayName: username, priceMultiplier: 1, passwordHash: '' });
      await admin.setPassword(password);
      await admin.save();
      console.log(`Created admin user: ${username}`);
    } else {
      await admin.setPassword(password);
      await admin.save();
      console.log(`Updated password for admin user: ${username}`);
    }

    process.exit(0);
  } catch (err) {
    console.error('Failed to create/reset admin:', err);
    process.exit(1);
  }
})();
