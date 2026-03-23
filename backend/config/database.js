require('dotenv').config();
const { Sequelize } = require('sequelize');
const path = require('path');

const databaseUrl = process.env.DATABASE_URL;
const useSQLite = process.env.USE_SQLITE === 'true';
let sequelize;

console.log('DEBUG: DATABASE_URL present:', !!databaseUrl);
console.log('DEBUG: USE_SQLITE is:', process.env.USE_SQLITE);

if (databaseUrl && databaseUrl.startsWith('postgres') && !useSQLite) {
  console.log('>>> [BOOT] Connecting to PostgreSQL (Supabase)...');
  console.log('>>> [BOOT] If this hangs or times out, check your network or ISP firewall.');
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  console.log('Falling back to local SQLite Database...');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'database.sqlite'),
    logging: false
  });
}

module.exports = sequelize;
