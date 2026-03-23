const { sequelize } = require('./models');

async function migrateLink() {
  try {
    await sequelize.query('ALTER TABLE Consultations ADD COLUMN meetingLink VARCHAR(255);');
    console.log("Successfully added meetingLink column.");
  } catch (err) {
    if (err.message.includes("duplicate column name")) {
       console.log("Column already exists.");
    } else {
       console.error("Migration error:", err.message);
    }
  } finally {
    process.exit(0);
  }
}
migrateLink();
