const { GoogleGenerativeAI } = require("@google/generative-ai");
const { error, success } = require('../utils/handler');

const getFinancialAdvice = async (req, res) => {
    try {
        const { expenses, budgetStats, userName } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.send(error(500, "Gemini API Key is missing in .env file"));
        }

        // Initialize inside the handler to ensure env vars are ready
        console.log("Using Gemini API Key:", process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 5)}...` : "MISSING");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }, { apiVersion: 'v1' });

        // Prepare the context for AI
        const prompt = `
            You are a professional financial advisor. Analyze the following expense data for ${userName || 'the user'} and provide short, actionable, and encouraging financial advice.
            
            Expense Summary:
            ${JSON.stringify(expenses, null, 2)}
            
            Budget Stats:
            ${JSON.stringify(budgetStats, null, 2)}
            
            Please provide:
            1. A brief summary of spending habits.
            2. Top 3 tips to save money based on the categories spent.
            3. A motivational closing statement.
            
            Keep the response concise and format it using Markdown.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return res.send(success(200, text));
    } catch (e) {
        console.error("AI Advice Error:", e);
        return res.send(error(500, e.message));
    }
};

module.exports = { getFinancialAdvice };
