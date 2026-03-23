const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('citizen', 'lawyer', 'admin'),
    defaultValue: 'citizen',
    allowNull: false,
  },
  specialization: {
    type: DataTypes.STRING, 
    allowNull: true,
  },
  barCouncilId: {
    type: DataTypes.STRING, 
    allowNull: true,
  },
  experienceYears: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  reviewsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  consultationFee: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN, 
    defaultValue: false,
  }
}, {
  timestamps: true,
});

module.exports = User;
