const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CaseUpdate = sequelize.define('CaseUpdate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  caseId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  updateText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  addedBy: {
    type: DataTypes.UUID,
    allowNull: false,
  }
}, {
  timestamps: true,
});

module.exports = CaseUpdate;
