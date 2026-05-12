const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const connectDb = require('./db/db');
const userRouter = require('./router/userRouter')
const expenseRouter = require('./router/expenseRouter')
const budgetRouter = require('./router/budgetRouter')
const tagRouter = require('./router/tagRouter')
const aiRouter = require('./router/aiRouter')
const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', userRouter)
app.use('/expenses', expenseRouter)
app.use('/budgets', budgetRouter)
app.use('/tags', tagRouter)
app.use('/ai', aiRouter)

// Connect to MongoDB
connectDb();

const port = process.env.PORT || process.env.PORT_NO || 4000;
app.listen(port , ()=>{
        console.log(`Server running on port ${port}`);
})