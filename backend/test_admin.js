const { User, Case, Consultation } = require('./models');

async function testStats() {
  try {
    const totalCitizens = await User.count({ where: { role: 'citizen' } });
    const totalLawyers = await User.count({ where: { role: 'lawyer' } });
    const totalCases = await Case.count();
    const activeCases = await Case.count({ where: { status: 'active' } });
    const totalConsultations = await Consultation.count();

    const pendingLawyers = await User.count({
      where: { role: 'lawyer', isVerified: false }
    });

    console.log(JSON.stringify({
      citizens: totalCitizens,
      lawyers: totalLawyers,
      totalCases,
      activeCases,
      totalConsultations,
      pendingLawyers
    }));
  } catch (error) {
    console.error("Admin stats error:", error);
  } finally {
    process.exit(0);
  }
}

testStats();
