const { Case, CaseUpdate, User, Document } = require('../models');

// Add a real-time update to a specific case history
exports.addCaseUpdate = async (req, res) => {
  try {
    const { caseId, updateText } = req.body;
    const addedBy = req.user.id;

    if (req.user.role !== 'lawyer' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only lawyers or admins can add official updates' });
    }

    const newUpdate = await CaseUpdate.create({
      caseId,
      updateText,
      addedBy
    });

    res.status(201).json({ message: 'Case ledger securely updated', update: newUpdate });
  } catch (error) {
    console.error("Ledger update error:", error);
    res.status(500).json({ message: 'Failed to update ledger', error: error.message });
  }
};

// Public/Citizen facing tracking via CVR number
exports.getCaseHistory = async (req, res) => {
  try {
    const { cvr } = req.params;

    const caseData = await Case.findOne({
      where: { cvrNumber: cvr },
      include: [
        { model: CaseUpdate, as: 'Updates', order: [['createdAt', 'DESC']] },
        { model: Document, as: 'Documents', attributes: ['filename', 'createdAt'] },
        { model: User, as: 'Lawyer', attributes: ['name', 'specialization'] },
        { model: User, as: 'Citizen', attributes: ['name'] }
      ]
    });

    if (!caseData) {
      return res.status(404).json({ message: 'Invalid CVR Number' });
    }

    res.status(200).json(caseData);
  } catch (error) {
    console.error("Fetch history error:", error);
    res.status(500).json({ message: 'Failed to track case', error: error.message });
  }
};
