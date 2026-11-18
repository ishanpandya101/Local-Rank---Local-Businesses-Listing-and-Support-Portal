import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/authMiddleware.js';
import { isDbConnected } from '../config/store.js';

const router = express.Router();

// Fallback users for offline/demo mode
const memoryUsers = [
  {
    _id: "u_admin_01",
    name: "Master Admin",
    email: "admin@localrank.com",
    role: "admin",
    status: "Active"
  },
  {
    _id: "u_owner_01",
    name: "Ishan (Partner)",
    email: "owner@localrank.com",
    role: "owner",
    status: "Active"
  },
  {
    _id: "u_customer_01",
    name: "Aarav Sharma",
    email: "user@localrank.com",
    role: "user",
    status: "Active"
  }
];

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'user', phone = '' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please fill in all required fields." });
    }

    if (isDbConnected()) {
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ msg: "User with this email already exists" });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        phone,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`
      });
      await user.save();

      const token = jwt.sign(
        { id: user._id, role: user.role, name: user.name },
        process.env.JWT_SECRET || 'Ishan@123SecureKey',
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        },
        msg: "User registered successfully!"
      });
    }

    // Memory Store Fallback
    const existing = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) return res.status(400).json({ msg: "User with this email already exists" });

    const newUser = {
      _id: "u_" + Date.now(),
      name,
      email,
      role,
      phone,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`,
      status: "Active"
    };
    memoryUsers.push(newUser);

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role, name: newUser.name },
      process.env.JWT_SECRET || 'Ishan@123SecureKey'
    );

    return res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar
      },
      msg: "Registered successfully!"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide email and password" });
    }

    // Quick admin / demo bypass for testing
    if ((email === "admin" || email === "admin@localrank.com") && (password === "1234" || password === "admin123")) {
      const token = jwt.sign({ id: "admin_id", role: "admin", name: "Ishan Admin" }, process.env.JWT_SECRET || 'Ishan@123SecureKey');
      return res.json({
        token,
        user: { id: "admin_id", name: "Ishan Admin", email: "admin@localrank.com", role: "admin" }
      });
    }

    if (isDbConnected()) {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "User not found with this email" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

      const token = jwt.sign(
        { id: user._id, role: user.role, name: user.name },
        process.env.JWT_SECRET || 'Ishan@123SecureKey',
        { expiresIn: '7d' }
      );

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        }
      });
    }

    // Memory Store Fallback
    const user = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Create guest user on the fly for ease of testing
      const guest = {
        _id: "u_" + Date.now(),
        name: email.split('@')[0],
        email,
        role: email.includes("admin") ? "admin" : (email.includes("owner") || email.includes("partner") ? "owner" : "user")
      };
      const token = jwt.sign({ id: guest._id, role: guest.role, name: guest.name }, process.env.JWT_SECRET || 'Ishan@123SecureKey');
      return res.json({ token, user: guest });
    }

    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET || 'Ishan@123SecureKey');
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET CURRENT USER PROFILE
router.get('/me', auth, async (req, res) => {
  try {
    if (isDbConnected()) {
      const user = await User.findById(req.user.id).select('-password');
      if (user) return res.json(user);
    }
    const found = memoryUsers.find(u => u._id === req.user.id);
    if (found) return res.json(found);

    res.json({
      id: req.user.id,
      name: req.user.name || "User",
      role: req.user.role || "user"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
