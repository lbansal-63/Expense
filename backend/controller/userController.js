const fs = require('fs');
const path = require('path');
const { error, success } = require('../utils/handler');
const userModel = require('../db/userModel');

const dbPath = path.join(__dirname, '../db/localDb.json');

// Helper to read DB
const readDB = () => {
    try {
        if (!fs.existsSync(dbPath)) {
             fs.writeFileSync(dbPath, JSON.stringify({ users: [] }, null, 2));
        }
        const data = fs.readFileSync(dbPath, 'utf8');
        const parsed = JSON.parse(data);
        if (!parsed.users) parsed.users = [];
        return parsed;
    } catch (err) {
        console.error("Error reading DB:", err);
        return { users: [] };
    }
};

// Helper to write DB
const writeDB = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.send(error(400, "Email and password Required!!"));
        }
        
        if (useMock) {
            const db = readDB();
            const user = db.users.find(u => u.email === email && u.password === password);
            if (!user) {
                return res.send(error(401, "User Not Found!! Please Sign Up"));
            }
            return res.send(success(201, user));
        }

        // MongoDB mode
        const user = await userModel.findOne({ email });
        if (!user || user.password !== password) {
            return res.send(error(401, "Invalid email or password"));
        }
        return res.send(success(200, user));

    } catch (err) {
        return res.send(error(500, err.message));
    }
};

const signupContorller = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.send(error(401, "Enter Every Field!!!"));
        }
        
        if (useMock) {
            const db = readDB();
            const existingUser = db.users.find(u => u.email === email);
            if (existingUser) {
                 return res.send(error(400, "User already exists with this email!"));
            }
            
            const newUser = {
                _id: Date.now().toString(),
                username,
                email,
                password,
                expense_id: [],
                preferredCurrency: 'INR',
                savingsGoal: 0,
                savingsTarget: 0,
                createdAt: new Date().toISOString()
            };
            
            db.users.push(newUser);
            writeDB(db);
            return res.send(success(201, "user is created"));
        }

        // MongoDB mode
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.send(error(400, "User already exists with this email!"));
        }

        const newUser = await userModel.create({
            username,
            email,
            password
        });
        return res.send(success(201, "User created successfully"));

    } catch (err) {
        return res.send(error(500, err.message));
    }
};

const logoutController = async (req, res) => {
    return res.send(success(200, "Logged out"));
};

const updateUserController = async (req, res) => {
    try {
        const { id, username, email, avatar, preferredCurrency, savingsGoal, savingsTarget } = req.body;
        if (!id) return res.send(error(400, "User ID is required"));

        if (useMock) {
            const db = readDB();
            const userIndex = db.users.findIndex(u => u._id === id);
            if (userIndex === -1) return res.send(error(404, "User not found"));

            if (username) db.users[userIndex].username = username;
            if (email) db.users[userIndex].email = email;
            if (avatar) db.users[userIndex].avatar = avatar;
            if (preferredCurrency) db.users[userIndex].preferredCurrency = preferredCurrency;
            if (savingsGoal !== undefined) db.users[userIndex].savingsGoal = savingsGoal;
            if (savingsTarget !== undefined) db.users[userIndex].savingsTarget = savingsTarget;

            writeDB(db);
            return res.send(success(200, db.users[userIndex]));
        }

        // MongoDB mode
        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            { username, email, avatar, preferredCurrency, savingsGoal, savingsTarget },
            { new: true }
        );
        if (!updatedUser) return res.send(error(404, "User not found"));
        return res.send(success(200, updatedUser));

    } catch (err) {
        return res.send(error(500, err.message));
    }
};

module.exports = {
    loginController,
    logoutController,
    signupContorller,
    updateUserController
}