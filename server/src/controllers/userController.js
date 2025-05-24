import User from '../models/User.js';

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Extract only the fields we allow to update
    const { profileUrl, age, gender } = req.body;

    const updateData = {};

    if (profileUrl !== undefined) updateData.profileUrl = profileUrl;
    if (age !== undefined) updateData.age = age;
    if (gender !== undefined) {
  // Capitalize first letter only
  updateData.gender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
}

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password'); // do not return password

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      msg: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Profile update error:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
