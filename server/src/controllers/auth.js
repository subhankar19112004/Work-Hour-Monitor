import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Default profile image if user doesn't provide one
const DEFAULT_PROFILE_URL = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

// Register user
export const register = async (req, res) => {
  try {
    const { name, email, password, age, gender, profileUrl } = req.body;

    // Basic validation
    if (!name || !email || !password || !age || !gender) {
      return res.status(400).json({ msg: 'Please fill all fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      role: 'employee',
      profileUrl: profileUrl || DEFAULT_PROFILE_URL, // use default if not provided
    });

    await newUser.save();

    // Create JWT payload
    const payload = {
      userId: newUser._id,
      role: newUser.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Please enter email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      userId: user._id,
      role: user.role,
      name: user.name,
      age: user.age,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      msg: 'Login successful',
      token,
      user: {
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        role: user.role,
        profileUrl: user.profileUrl || DEFAULT_PROFILE_URL,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};
