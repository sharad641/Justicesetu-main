const { Document, Case, User } = require('../models');

// Upload a document
exports.uploadDocument = async (req, res) => {
  try {
    const { filename, fileUrl, fileType, caseId } = req.body;
    const uploadedBy = req.user.id;

    if (!filename || !fileUrl) {
      return res.status(400).json({ message: 'Filename and secure URL are required' });
    }

    const document = await Document.create({
      filename,
      fileUrl,
      fileType: fileType || 'application/pdf',
      uploadedBy,
      caseId: caseId || null
    });

    res.status(201).json({
      message: 'Document securely uploaded to vault',
      document
    });
  } catch (error) {
    console.error("Document upload error:", error);
    res.status(500).json({ message: 'Failed to upload document', error: error.message });
  }
};

// Get personal documents
exports.getMyDocuments = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Fetch all documents uploaded by this user
    const documents = await Document.findAll({
      where: { uploadedBy: userId },
      include: [{ model: Case, as: 'Case', attributes: ['title', 'cvrNumber'] }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(documents);
  } catch (error) {
    console.error("Fetch docs error:", error);
    res.status(500).json({ message: 'Failed to fetch vault contents', error: error.message });
  }
};
