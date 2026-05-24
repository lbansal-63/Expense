const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.log('ℹ️  MONGO_URI not set — running without DB (mock mode)');
        global.isMockMode = true;
        return;
    }
    
    try {
        console.log("🔄 Connecting to configured MongoDB Atlas...");
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 });
        console.log("✅ MongoDB Connected Successfully!");
        global.isMockMode = false;
    } catch (error) {
        console.log("❌ MongoDB Connection Failed:", error.message);
        console.log("🔄 Attempting fallback to local MongoDB (mongodb://127.0.0.1:27017/expense)...");
        try {
            await mongoose.connect("mongodb://127.0.0.1:27017/expense", { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 });
            console.log("✅ Connected to Local MongoDB Successfully!");
            global.isMockMode = false;
        } catch (localError) {
            console.log("❌ Local MongoDB Connection Failed:", localError.message);
            console.log("ℹ️  Running in mock mode (local json/in-memory database).");
            global.isMockMode = true;
        }
    }
};

module.exports = connectDB;