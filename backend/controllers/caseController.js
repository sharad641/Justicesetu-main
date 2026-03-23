const { Case } = require('../models');

// Get all cases (For Lawyer/Admin)
// Alternatively, get cases for currently logged in Citizen
exports.getCases = async (req, res) => {
  try {
    let cases;
    if (req.user.role === 'citizen') {
      cases = await Case.findAll({ where: { citizenId: req.user.id } });
    } else if (req.user.role === 'lawyer') {
      cases = await Case.findAll({ where: { lawyerId: req.user.id } });
    } else {
      cases = await Case.findAll();
    }
    res.json(cases);
  } catch (error) {
    console.error('Fetch cases error:', error);
    res.status(500).json({ message: 'Server error fetching cases' });
  }
};

// Create a new case
exports.createCase = async (req, res) => {
  try {
    const { title, description, court, cvrNumber } = req.body;
    
    // In a real app, cvrNumber might be generated automatically
    const newCase = await Case.create({
      title,
      description,
      court,
      cvrNumber,
      citizenId: req.user.role === 'citizen' ? req.user.id : req.body.citizenId,
      lawyerId: req.user.role === 'lawyer' ? req.user.id : req.body.lawyerId || null,
    });

    res.status(201).json(newCase);
  } catch (error) {
    console.error('Case creation error:', error);
    res.status(500).json({ message: 'Server error creating case' });
  }
};

// Track case by CVR
exports.trackCase = async (req, res) => {
  try {
    const { cvr } = req.params;
    const caseData = await Case.findOne({ where: { cvrNumber: cvr } });

    if (!caseData) {
      return res.status(404).json({ message: 'Case not found with this CVR number' });
    }

    res.json(caseData);
  } catch (error) {
    console.error('Case tracking error:', error);
    res.status(500).json({ message: 'Server error tracking case' });
  }
};
