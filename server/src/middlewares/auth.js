import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token, auth denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Just attach decoded payload, no DB call
    req.user = decoded; // contains userId, role, etc.
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default protect;
