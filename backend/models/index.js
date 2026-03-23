const sequelize = require('../config/database');
const User = require('./User');
const Case = require('./Case');
const Consultation = require('./Consultation');
const Document = require('./Document');
const CaseUpdate = require('./CaseUpdate');

// User <-> Case relationships
User.hasMany(Case, { as: 'CitizenCases', foreignKey: 'citizenId' });
User.hasMany(Case, { as: 'LawyerCases', foreignKey: 'lawyerId' });
Case.belongsTo(User, { as: 'Citizen', foreignKey: 'citizenId' });
Case.belongsTo(User, { as: 'Lawyer', foreignKey: 'lawyerId' });

// User <-> Consultation relationships
User.hasMany(Consultation, { as: 'CitizenConsultations', foreignKey: 'citizenId' });
User.hasMany(Consultation, { as: 'LawyerConsultations', foreignKey: 'lawyerId' });
Consultation.belongsTo(User, { as: 'Citizen', foreignKey: 'citizenId' });
Consultation.belongsTo(User, { as: 'Lawyer', foreignKey: 'lawyerId' });

// User <-> Document relationships
User.hasMany(Document, { as: 'UploadedDocuments', foreignKey: 'uploadedBy' });
Document.belongsTo(User, { as: 'Uploader', foreignKey: 'uploadedBy' });

// Case <-> Document relationships
Case.hasMany(Document, { as: 'Documents', foreignKey: 'caseId' });
Document.belongsTo(Case, { as: 'Case', foreignKey: 'caseId' });

// Case <-> CaseUpdate relationships
Case.hasMany(CaseUpdate, { as: 'Updates', foreignKey: 'caseId' });
CaseUpdate.belongsTo(Case, { as: 'Case', foreignKey: 'caseId' });

// User <-> CaseUpdate relationships
User.hasMany(CaseUpdate, { as: 'AddedUpdates', foreignKey: 'addedBy' });
CaseUpdate.belongsTo(User, { as: 'Creator', foreignKey: 'addedBy' });

module.exports = {
  sequelize,
  User,
  Case,
  Consultation,
  Document,
  CaseUpdate
};
