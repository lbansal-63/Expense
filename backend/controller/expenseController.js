const fs = require('fs');
const path = require('path');
const { error, success } = require('../utils/handler');

const dbPath = path.join(__dirname, '../db/localDb.json');

// Helper to read DB
const readDB = () => {
    try {
        if (!fs.existsSync(dbPath)) {
            fs.writeFileSync(dbPath, JSON.stringify({ users: [], expenses: [] }, null, 2));
        }
        const data = fs.readFileSync(dbPath, 'utf8');
        const parsed = JSON.parse(data);
        if (!parsed.expenses) parsed.expenses = [];
        return parsed;
    } catch (err) {
        console.error("Error reading DB:", err);
        return { users: [], expenses: [] };
    }
};

// Helper to write DB
const writeDB = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Try to require models; keep working even if models don't export (mock mode)
let expenseModel, userModel, tagModel;
try { expenseModel = require('../db/expenseModel'); } catch (e) { expenseModel = null; }
try { userModel = require('../db/userModel'); } catch (e) { userModel = null; }
try { tagModel = require('../db/tagModel'); } catch (e) { tagModel = null; }

const useMock = process.env.MONGO_URI ? false : true; // Use MongoDB if URI is present

const genId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2,8)}`;

const createExpense = async (req, res) => {
  try {
    const { amount, category, date, usersid, description, tags, currency, isRecurring, recurringFrequency, splitWith } = req.body;
    if (!amount || !category || !date || !usersid) return res.send(error(401, 'All Details Are Required'));

    if (useMock) {
      const id = genId();
      const item = {
        _id: id,
        amount: Number(amount),
        category,
        date: new Date(date),
        usersid,
        description: description || '',
        tags: tags || [],
        currency: currency || 'INR',
        isRecurring: !!isRecurring,
        recurringFrequency: recurringFrequency || 'none',
        splitWith: splitWith || [],
        isEdited: false,
      };
      
      const db = readDB();
      db.expenses.push(item);
      const userIdx = db.users.findIndex(u => u._id === usersid);
      if (userIdx !== -1) {
        if (!db.users[userIdx].expense_id) db.users[userIdx].expense_id = [];
        db.users[userIdx].expense_id.push(id);
      }
      writeDB(db);
      
      return res.send(success(200, item));
    }

    // DB mode
    const expenseData = { amount, category, date: new Date(date), usersid, description, tags: tags || [], currency: currency || 'INR', isRecurring: isRecurring || false, recurringFrequency: recurringFrequency || 'none', splitWith: splitWith || [] };
    const newExpense = await expenseModel.create(expenseData);
    if (userModel) {
      const user = await userModel.findById(usersid).populate('expense_id');
      if (user) {
        user.expense_id.push(newExpense._id);
        await user.save();
      }
    }
    // update tags if tagModel exists
    if (tagModel && tags && tags.length > 0) {
      for (let t of tags) {
        await tagModel.findOneAndUpdate({ userId: usersid, tagName: t }, { $inc: { usageCount: 1 } }, { upsert: true });
      }
    }
    return res.send(success(200, newExpense));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const updateExpense = async (req, res) => {
  try {
    const { expenseId, userId, ...updateData } = req.body;
    if (!expenseId || !userId) return res.send(error(401, 'Expense ID and User ID are required'));

    if (useMock) {
      const db = readDB();
      const idx = db.expenses.findIndex(e => e._id === expenseId);
      if (idx === -1) return res.send(error(401, 'Expense not found'));
      const exp = db.expenses[idx];
      if (exp.usersid !== userId) return res.send(error(401, 'Unauthorized'));
      const updated = { ...exp, ...updateData, isEdited: true };
      db.expenses[idx] = updated;
      writeDB(db);
      return res.send(success(200, updated));
    }

    const expense = await expenseModel.findById(expenseId);
    if (!expense) return res.send(error(401, 'Expense not found'));
    if (expense.usersid.toString() !== userId) return res.send(error(401, 'Unauthorized'));
    const updatedExpense = await expenseModel.findByIdAndUpdate(expenseId, { ...updateData, isEdited: true }, { new: true });
    return res.send(success(200, updatedExpense));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { expenseId, userId } = req.body;
    if (!expenseId || !userId) return res.send(error(401, 'ExpenseId & userId required'));
    if (useMock) {
      const db = readDB();
      const idx = db.expenses.findIndex(e => e._id === expenseId);
      if (idx === -1) return res.send(error(401, 'Invalid Expense or User'));
      const expense = db.expenses[idx];
      if (expense.usersid !== userId) return res.send(error(401, 'Unauthorized'));
      db.expenses.splice(idx, 1);
      const userIdx = db.users.findIndex(u => u._id === userId);
      if (userIdx !== -1 && db.users[userIdx].expense_id) {
        db.users[userIdx].expense_id = db.users[userIdx].expense_id.filter(id => id !== expenseId);
      }
      writeDB(db);
      return res.send(success(201, { response: 'Successfully Deleted' }));
    }

    const expense = await expenseModel.findById(expenseId);
    const user = await userModel.findById(userId);
    if (!expense || !user) return res.send(error(401, 'Invalid Expense or User'));
    if (user.expense_id.includes(expenseId)) {
      await expenseModel.findByIdAndDelete(expenseId);
      const index = user.expense_id.indexOf(expenseId);
      user.expense_id.splice(index, 1);
    }
    await user.save();
    return res.send(success(201, { response: 'Successfully Deleted' }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.send(error(401, 'userId required'));
    if (useMock) {
      const db = readDB();
      const user = db.users.find(u => u._id === userId);
      const ids = (user && user.expense_id) ? user.expense_id : [];
      const expenses = db.expenses.filter(e => ids.includes(e._id)).sort((a,b)=> new Date(b.date)- new Date(a.date));
      return res.send(success(200, expenses));
    }
    const user = await userModel.findById(userId).populate('expense_id');
    const expenses = (user && user.expense_id) ? user.expense_id.sort((a,b)=> new Date(b.date)- new Date(a.date)) : [];
    return res.send(success(200, expenses));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getFilteredExpenses = async (req, res) => {
  try {
    const { userId, startDate, endDate, category, minAmount, maxAmount, tags } = req.body;
    if (!userId) return res.send(error(401, 'userId required'));
    if (useMock) {
      const db = readDB();
      const user = db.users.find(u => u._id === userId);
      const ids = (user && user.expense_id) ? user.expense_id : [];
      let expenses = db.expenses.filter(e => ids.includes(e._id));
      if (startDate) expenses = expenses.filter(e => new Date(e.date) >= new Date(startDate));
      if (endDate) expenses = expenses.filter(e => new Date(e.date) <= new Date(endDate));
      if (category) expenses = expenses.filter(e => e.category === category);
      if (minAmount) expenses = expenses.filter(e => e.amount >= Number(minAmount));
      if (maxAmount) expenses = expenses.filter(e => e.amount <= Number(maxAmount));
      if (tags && tags.length>0) expenses = expenses.filter(e => e.tags && e.tags.some(t=> tags.includes(t)));
      expenses = expenses.sort((a,b)=> new Date(b.date)- new Date(a.date));
      return res.send(success(200, expenses));
    }
    let query = { usersid: userId };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (category) query.category = category;
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }
    if (tags && tags.length>0) query.tags = { $in: tags };
    const expenses = await expenseModel.find(query).sort({ date: -1 });
    return res.send(success(200, expenses));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getCategoryExpense = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.send(error(401, 'userId required'));
    let expenses;
    if (useMock) {
      const db = readDB();
      const user = db.users.find(u => u._id === userId);
      const ids = (user && user.expense_id) ? user.expense_id : [];
      expenses = db.expenses.filter(e => ids.includes(e._id));
    } else {
      expenses = await expenseModel.find({ usersid: userId });
    }
    const categoryData = {};
    expenses.forEach(exp => { categoryData[exp.category] = (categoryData[exp.category] || 0) + Number(exp.amount); });
    return res.send(success(200, categoryData));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getExpenseStats = async (req, res) => {
  try {
    const { userId, days = 30 } = req.body;
    if (!userId) return res.send(error(401, 'userId required'));
    const startDate = new Date(); startDate.setDate(startDate.getDate() - days);
    let expenses;
    if (useMock) {
      const db = readDB();
      const user = db.users.find(u => u._id === userId);
      const ids = (user && user.expense_id) ? user.expense_id : [];
      expenses = db.expenses.filter(e => ids.includes(e._id) && new Date(e.date) >= startDate);
    } else {
      expenses = await expenseModel.find({ usersid: userId, date: { $gte: startDate } });
    }
    const totalSpent = expenses.reduce((s, e) => s + Number(e.amount), 0);
    const avgPerDay = totalSpent / days;
    const categoryBreakdown = {};
    expenses.forEach(exp => { categoryBreakdown[exp.category] = (categoryBreakdown[exp.category] || 0) + Number(exp.amount); });
    return res.send(success(200, { totalSpent, avgPerDay: avgPerDay.toFixed(2), expenseCount: expenses.length, categoryBreakdown }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const sendExpenseReport = async (req, res) => {
  try {
    const { userId, recipientEmail } = req.body;
    if (!userId || !recipientEmail) {
      return res.send(error(401, 'userId and recipientEmail are required'));
    }

    const { sendEmailWithAttachment } = require('../utils/emailSend');
    
    let expenses = [];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if (useMock) {
      const db = readDB();
      const user = db.users.find(u => u._id === userId);
      const ids = (user && user.expense_id) ? user.expense_id : [];
      expenses = db.expenses
        .filter(e => ids.includes(e._id))
        .filter(e => new Date(e.date) >= thirtyDaysAgo);
    } else {
      const user = await userModel.findById(userId).populate('expense_id');
      if (!user) {
        return res.send(error(401, 'User not found'));
      }
      expenses = (user.expense_id || []).filter(e => new Date(e.date) >= thirtyDaysAgo);
    }
    
    if (expenses.length === 0) {
      return res.send(error(400, 'No expenses found for the last 30 days'));
    }

    await sendEmailWithAttachment(recipientEmail, expenses);
    return res.send(success(200, { message: 'Email sent successfully' }));
  } catch (e) {
    console.error('Email send error:', e);
    return res.send(error(500, e.message));
  }
};

const sendSplitInvites = async (req, res) => {
  try {
    const { creatorName, creatorEmail, recipients, expenseDetails } = req.body;
    
    if (!creatorName || !creatorEmail || !recipients || !Array.isArray(recipients)) {
      return res.send(error(401, 'Missing required fields'));
    }

    const { sendSplitInvites: sendInvites } = require('../utils/emailSend');
    
    // Send invites to all recipients
    await sendInvites(creatorName, creatorEmail, recipients, expenseDetails);
    
    return res.send(success(200, { message: 'Invites sent successfully' }));
  } catch (e) {
    console.error('Split invite error:', e);
    return res.send(error(500, e.message));
  }
};

module.exports = { createExpense, updateExpense, deleteExpense, getAllExpenses, getFilteredExpenses, getCategoryExpense, getExpenseStats, sendExpenseReport, sendSplitInvites };
