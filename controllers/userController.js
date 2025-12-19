import User from "../models/User.js";

export const addUser = async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(200).json({ 
        success: true, 
        user: existingUser,
        message: "User already exists"
      });
    }
    
    const user = await User.create(req.body);
    res.status(201).json({ success: true, user });
  } catch (err) {
    console.error(err);
    
    // Handle duplicate key error
    if (err.code === 11000) {
      // Try to find and return the existing user
      try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
          return res.status(200).json({ 
            success: true, 
            user: existingUser,
            message: "User already exists"
          });
        }
      } catch (findErr) {
        console.error('Error finding existing user:', findErr);
      }
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Error adding user", 
      error: err.message 
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching users", error: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching user", error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating user", error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting user", error: err.message });
  }
};
