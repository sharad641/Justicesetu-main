const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileType: {
    type: DataTypes.STRING,
    defaultValue: 'application/pdf',
  },
  uploadedBy: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  caseId: {
    type: DataTypes.UUID,
    allowNull: true,
  }
}, {
  timestamps: true,
});

module.exports = Document;
