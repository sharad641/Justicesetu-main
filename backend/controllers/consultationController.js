const { Consultation, User, Case } = require('../models');

// Book a new consultation
exports.createConsultation = async (req, res) => {
  try {
    const { lawyerId, scheduledAt, issueDescription, paymentStatus } = req.body;
    
    // Auth user is the citizen making the booking
    const citizenId = req.user.id;

    if (!lawyerId || !scheduledAt || !issueDescription) {
      return res.status(400).json({ message: 'Lawyer, schedule time and issue description are required.' });
    }

    const consultation = await Consultation.create({
      citizenId,
      lawyerId,
      scheduledAt,
      issueDescription,
      paymentStatus: paymentStatus || 'paid', // Fake paid for now
      status: 'pending' // Default status
    });

    // Automatically create a case for this consultation
    const cvrNumber = 'CVR' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);
    const newCase = await Case.create({
      title: 'Legal Consultation Case',
      description: issueDescription,
      court: 'Pending Assignment',
      cvrNumber: cvrNumber,
      citizenId,
      lawyerId,
      status: 'active'
    });

    res.status(201).json({
      message: 'Consultation successfully booked and Case created!',
      consultation,
      case: newCase
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: 'Failed to book consultation', error: error.message });
  }
};

// Get consultations for the logged-in user (handles both citizen and lawyer)
exports.getMyConsultations = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let consultations;

    if (role === 'citizen') {
      // Citizen wants to see their bookings, include the Lawyer's details
      consultations = await Consultation.findAll({
        where: { citizenId: userId },
        include: [{ model: User, as: 'Lawyer', attributes: ['id', 'name', 'specialization', 'profileImage'] }],
        order: [['scheduledAt', 'ASC']]
      });
    } else if (role === 'lawyer') {
      // Lawyer wants to see their appointments, include the Citizen's details
      consultations = await Consultation.findAll({
        where: { lawyerId: userId },
        include: [{ model: User, as: 'Citizen', attributes: ['id', 'name', 'email'] }],
        order: [['scheduledAt', 'ASC']]
      });
    } else {
      return res.status(403).json({ message: 'Admins do not have personal consultations' });
    }

    res.status(200).json(consultations);
  } catch (error) {
    console.error("Fetch consultations error:", error);
    res.status(500).json({ message: 'Failed to fetch consultations', error: error.message });
  }
};

// Update meeting link for a consultation
exports.updateLink = async (req, res) => {
  try {
    const { link } = req.body;
    const { id } = req.params;
    
    const consultation = await Consultation.findByPk(id);
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    // Security check: Only involved citizen or lawyer can update
    if (consultation.citizenId !== req.user.id && consultation.lawyerId !== req.user.id) {
       return res.status(403).json({ message: 'Unauthorized to update this consultation' });
    }

    consultation.meetingLink = link;
    await consultation.save();

    res.status(200).json({ message: 'Meeting link updated successfully', consultation });
  } catch (error) {
    console.error("Link update error:", error);
    res.status(500).json({ message: 'Failed to update meeting link', error: error.message });
  }
};
