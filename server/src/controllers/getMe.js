import User from "../models/User.js";

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password'); // exclude password
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user); // sends back entire user object except password
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};
