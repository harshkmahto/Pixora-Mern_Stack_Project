const userModel = require("../models/user.model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

// Register User
async function registerUser(req, res) {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user' // Default to 'user' if role not provided
        });

        // Generate token
        const token = generateToken(user._id, user.role);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile: user.profile
            },
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Login User
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate token
        const token = generateToken(user._id, user.role);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile: user.profile
            },
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Get User Profile
async function getProfile(req, res) {
    try {
        const user = await userModel.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            user
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Update User Profile
async function updateProfile(req, res) {
    try {
        const { name, email } = req.body;

        const updateFields = {};
        if (name) updateFields.name = name;
        if (email) updateFields.email = email;

        if (req.file) {
            updateFields.profile = req.file.path; // new cloudinary image
        }

        const user = await userModel.findByIdAndUpdate(
            req.user.id,
            updateFields,
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({
            message: "Profile updated successfully",
            user
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Logout User
async function logoutUser(req, res) {
    try {
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0)
        });

        res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Get All Users (Admin Only)
async function getAllUsers(req, res) {
    try {
        const users = await userModel
            .find()
            .select('-password') // Never send password
            .sort({ createdAt: -1 }); // Latest users first

        res.status(200).json({
            totalUsers: users.length,
            users
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    logoutUser,
    getAllUsers
};