const { sequelize, Consultation, Case } = require('./models');

async function migrate() {
  await sequelize.sync();
  
  const consultations = await Consultation.findAll();
  let created = 0;
  
  for (const c of consultations) {
    // Check if this citizen and lawyer already have a case
    const existing = await Case.findOne({
       where: { citizenId: c.citizenId, lawyerId: c.lawyerId }
    });
    
    if (!existing) {
      const cvrNumber = 'CVR' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);
      await Case.create({
        title: 'Legal Consultation Case',
        description: c.issueDescription || 'No description provided',
        court: 'Pending Assignment',
        cvrNumber: cvrNumber,
        citizenId: c.citizenId,
        lawyerId: c.lawyerId,
        status: 'active'
      });
      created++;
    }
  }
  
  console.log(`Migration complete. Created ${created} missing cases.`);
  process.exit(0);
}

migrate();
