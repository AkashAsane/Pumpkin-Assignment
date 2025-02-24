const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const signUp = async (req, res) => {
    const { email, mobile, password } = req.body;
    try {
      
        if (!email || !mobile || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

     
        const hashedPassword = await bcrypt.hash(password, 12);

        
        const newUser = await User.create({
            email,
            mobile,
            password: hashedPassword,
            isOnline: false, 
        });

      
        res.status(201).json({
            message: "User created successfully",
            user: {
                email: newUser.email,
                mobile: newUser.mobile,
                isOnline: newUser.isOnline,
                _id: newUser._id,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Error creating user", error: err.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
   
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

     
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

     
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

 
        user.isOnline = true;
        await user.save();

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                email: user.email,
                mobile: user.mobile,
                isOnline: user.isOnline,
                _id: user._id,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Error logging in", error: err.message });
    }
};

module.exports = { signUp, login };
