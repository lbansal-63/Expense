const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Note: listModels might not be available on the main class in all versions
        // but we can try to see if it works.
        console.log("Key:", process.env.GEMINI_API_KEY ? "Present" : "Missing");
        // Actually, the SDK doesn't have a direct listModels on the genAI object usually.
        // It's part of the GenerativeAI interface but often hidden.
        
        // Let's try to just hit a known model with a very simple prompt.
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("test");
        console.log("Success with gemini-pro");
    } catch (e) {
        console.error("Failed with gemini-pro:", e.message);
        
        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent("test");
            console.log("Success with gemini-1.5-flash");
        } catch (e2) {
            console.error("Failed with gemini-1.5-flash:", e2.message);
        }
    }
}

listModels();
