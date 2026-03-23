const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Case = sequelize.define('Case', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  cvrNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'pending', 'closed', 'resolved'),
    defaultValue: 'active',
  },
  court: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nextHearingDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  citizenId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  lawyerId: {
    type: DataTypes.UUID,
    allowNull: true,
  }
}, {
  timestamps: true,
});

module.exports = Case;
