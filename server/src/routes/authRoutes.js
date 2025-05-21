import express from "express";
import { login, register } from "../controllers/auth.js";

const router = express.Router();

// POST route to register a new user
router.post("/register", register);

// POST route to log in a user
router.post("/login", login);

export default router;
