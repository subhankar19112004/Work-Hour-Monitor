import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
  try {
    // Extract the token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token, auth denied" });

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    

    // Attach the decoded user data to req.user
    req.user = decoded;

    console.log("Decoded user data:", decoded);  // Check the decoded token

    next();  // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default protect;
