import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"

    console.log("Token received in middleware:", token);  // Log token for debugging

    if (!token) {
      console.log("No token found in Authorization header");
      return res.status(401).json({ msg: 'No token, auth denied' });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded user data in middleware:", decoded);  // Log decoded token data

    // Attach decoded user data to req.user
    req.user = decoded;

    // Debug: Log req.user to verify it is set correctly
    console.log("req.user set in protect middleware:", req.user);

    next();  // Pass control to the next middleware/controller
  } catch (err) {
    console.log("Error in token verification:", err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default protect;
