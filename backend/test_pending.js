const { User } = require('./models');

async function testPending() {
  try {
    const lawyers = await User.findAll({
      where: { role: 'lawyer', isVerified: false },
      attributes: ['id', 'name', 'email', 'specialization', 'barCouncilId', 'createdAt']
    });
    console.log(JSON.stringify(lawyers));
  } catch (err) {
    console.error("Pending stats error:", err.message);
  } finally {
    process.exit(0);
  }
}
testPending();
