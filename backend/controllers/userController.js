const { User } = require('../models');

// Get all verified lawyers
exports.getLawyers = async (req, res) => {
  try {
    const lawyers = await User.findAll({
      where: { 
        role: 'lawyer',
        // In a strict prod environment we'd uncomment:
        // isVerified: true 
      },
      attributes: { exclude: ['password'] }
    });

    res.status(200).json(lawyers);
  } catch (error) {
    console.error('Error fetching lawyers:', error);
    res.status(500).json({ message: 'Failed to fetch lawyers' });
  }
};

// Update User Profile (Works for both Citizens and Lawyers)
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    // Disallow updating sensitive fields directly via this route
    delete updateData.password;
    delete updateData.role;
    delete updateData.isVerified;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update(updateData);

    // Return the updated user without the password
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};
