const { User, Case, Consultation } = require('../models');

// Get ALL users for admin management table
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Admin getAllUsers error:", error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

// Fetch global platform statistics
exports.getAdminStats = async (req, res) => {
  try {
    // Basic role protection (real app would have a dedicated admin role or middleware)
    if (req.user.role !== 'citizen' && req.user.role !== 'admin' && req.user.role !== 'lawyer') {
       return res.status(403).json({ message: 'Unauthorized Access' });
    }

    const totalCitizens = await User.count({ where: { role: 'citizen' } });
    const totalLawyers = await User.count({ where: { role: 'lawyer' } });
    const totalCases = await Case.count();
    const activeCases = await Case.count({ where: { status: 'active' } });
    const totalConsultations = await Consultation.count();

    const pendingLawyers = await User.count({
      where: { role: 'lawyer', isVerified: false }
    });

    res.status(200).json({
      citizens: totalCitizens,
      lawyers: totalLawyers,
      totalCases,
      activeCases,
      totalConsultations,
      pendingLawyers
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ message: 'Failed to fetch global stats', error: error.message });
  }
};

// Fetch unverified lawyers waiting for Bar Council approval
exports.getPendingLawyers = async (req, res) => {
  try {
    const lawyers = await User.findAll({
      where: { role: 'lawyer', isVerified: false },
      attributes: ['id', 'name', 'email', 'specialization', 'barCouncilId', 'createdAt']
    });

    res.status(200).json(lawyers);
  } catch (error) {
    console.error("Fetch pending error:", error);
    res.status(500).json({ message: 'Failed to fetch pending queue', error: error.message });
  }
};

// Verify and approve a lawyer using their UUID
exports.verifyLawyer = async (req, res) => {
  try {
    const { id } = req.params;
    
    const lawyer = await User.findByPk(id);
    if (!lawyer || lawyer.role !== 'lawyer') {
      return res.status(404).json({ message: 'Lawyer not found' });
    }

    lawyer.isVerified = true;
    await lawyer.save();

    res.status(200).json({ message: 'Lawyer verified successfully', lawyer });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: 'Failed to verify lawyer', error: error.message });
  }
};
