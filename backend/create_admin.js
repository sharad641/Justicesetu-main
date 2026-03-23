const bcrypt = require('bcrypt');
const { User } = require('./models');

async function createAdmin() {
  try {
    const adminEmail = 'admin@justicesetu.com';
    let admin = await User.findOne({ where: { email: adminEmail } });

    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      admin = await User.create({
        name: 'System Admin',
        email: adminEmail,
        phone: '0000000000',
        password: hashedPassword,
        role: 'admin',
        isVerified: true
      });
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin user already exists.');
    }

    console.log(`
--- ADMIN CREDENTIALS ---
Email: ${adminEmail}
Password: admin123
-------------------------
    `);

  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    process.exit(0);
  }
}

createAdmin();
