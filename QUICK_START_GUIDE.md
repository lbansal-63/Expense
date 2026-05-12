# Quick Start Guide - Expense Tracker Pro

## 🚀 Getting Started

### Step 1: Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Step 2: Start the Application

```bash
# Terminal 1 - Start Backend Server
cd backend
npm run dev

# Terminal 2 - Start Frontend Application  
cd frontend
npm start
```

The application will open at `http://localhost:3000`

---

## 📱 How to Use Each Feature

### 1️⃣ Create an Expense

1. Click on the "Home" tab
2. Fill in the form on the right:
   - **Amount**: Enter expense amount
   - **Category**: Select from dropdown (Grocery, Food, etc.)
   - **Date**: Pick the date
   - **Currency**: Choose currency (INR, USD, EUR, GBP)
   - **Description** (Optional): Add notes
   - **Tags** (Optional): Add custom tags for organization

3. Click "+ Add Expense"
4. See your expense in the Recent Expenses list

---

### 2️⃣ Edit or Delete Expenses

1. Find the expense in your list
2. Click **Edit** button to modify it
3. Update any field (amount, category, date, tags, etc.)
4. Click "Update Expense"
5. To delete, click **Delete** button

---

### 3️⃣ Set Budget Limits

1. Click on the "Budgets" tab
2. Click "+ Add Budget"
3. Fill in:
   - **Category**: Which category to budget for
   - **Limit Amount**: Maximum spending
   - **Period**: Daily/Weekly/Monthly/Yearly
   - **Alert Threshold**: When to alert (e.g., 80%)
   - **Currency**: Select currency

4. View your budget status with progress bars
5. See real-time alerts when nearing limit

**Example**: Set ₹5000 monthly budget for Grocery. You'll get alerted at ₹4000 (80%)

---

### 4️⃣ View Analytics

1. Click on the "Analytics" tab
2. Choose time range:
   - Last 7 days
   - Last 30 days
   - Last 90 days
   - Last year

3. View:
   - **Spending Trend**: Line chart showing daily spending
   - **Category Breakdown**: Pie chart by category
   - **Key Metrics**: Total spent, avg per day, etc.

---

### 5️⃣ Create & Manage Tags

1. Click on the "Tags" tab
2. Click "+ Add Tag"
3. Enter tag name (e.g., "Emergency", "Gas Bill")
4. Choose a color
5. Click "Create Tag"
6. Use tags when creating/editing expenses
7. Track tag usage statistics

---

### 6️⃣ Apply Filters

1. Click on the "Filters" tab
2. Click "Advanced Filters"
3. Set your criteria:
   - **Date Range**: From & To dates
   - **Category**: Select specific category
   - **Amount Range**: Min to Max
   - **Tags**: Select specific tags

4. Click "Apply Filters"
5. See filtered results
6. Click "Export CSV" to download

---

### 7️⃣ Add Recurring Expenses

1. Click "+ Add Recurring Expense"
2. Fill in:
   - **Amount**: Monthly bill amount
   - **Category**: Choose category (e.g., Food)
   - **Frequency**: Daily/Weekly/Monthly/Yearly
   - **Start Date**: When to start
   - **End Date** (Optional): When to stop
   - **Description**: Bill name

3. Example: Set ₹500 weekly for gym subscription

---

### 8️⃣ Split Expenses with Friends

1. Click "+ Split Expense"
2. Fill in:
   - **Amount**: Total amount
   - **Category**: Type of expense
   - **Date**: When
   - **Description**: What for
   - **Add People**: Enter friends' emails

3. The app auto-calculates each person's share
4. Perfect for roommates, group outings, etc.

---

### 9️⃣ Export Your Data

#### Export All Expenses:
1. Go to "Home" tab
2. Click "Export All" button
3. CSV file downloads to your computer

#### Export Filtered Expenses:
1. Go to "Filters" tab
2. Apply your filters
3. Click "Export CSV"
4. Get only filtered data in CSV format

**Use Cases**: Backup data, analyze in Excel, share with accountant

---

## 💡 Pro Tips

1. **Color-Code Your Categories**: Use different colors for budgets
2. **Use Tags Strategically**: Tag by project, person, or purpose
3. **Set Multiple Budgets**: Monitor spending in different areas
4. **Check Analytics Weekly**: Understand spending patterns
5. **Export Monthly**: Keep backups of your data
6. **Split Fairly**: Always split exact amounts with friends
7. **Use Recurring**: Schedule monthly/annual expenses once

---

## ⚙️ Keyboard Shortcuts

- **Enter Key**: Add tag (when in tag input)
- **Tab**: Move between form fields

---

## 🎨 UI Features

### Icons & Colors
- 🟢 **Green**: Grocery
- 🟡 **Yellow**: Vehicle
- 🔴 **Red**: Food
- 🔵 **Blue**: Travel
- 🟣 **Purple**: Fun
- 🩷 **Pink**: Shopping
- ⚫ **Gray**: Other

### Progress Bars
- 🟢 Green: Budget OK (0-79%)
- 🟡 Yellow: Budget Alert (80-99%)
- 🔴 Red: Budget Exceeded (100%+)

---

## 🔒 Data Security

- Your data is stored in MongoDB
- Authentication with login credentials
- Expenses linked to your user ID
- No data is shared between users

---

## ❓ FAQ

**Q: Can I change currency after creating an expense?**
A: Yes! Use the Edit button to change currency.

**Q: Do recurring expenses auto-create?**
A: They're tracked for reference. Create manually or set reminders.

**Q: Can I export to PDF?**
A: Currently CSV only. Excel can convert to PDF.

**Q: What if I forget a tag?**
A: Edit the expense and add it later.

**Q: How do I change my preferred currency?**
A: Use Currency Selector in the expense form.

**Q: Can I delete a budget?**
A: Yes! Click the delete (trash) button in budget card.

---

## 🆘 Troubleshooting

**Problem**: Expenses not showing up
- Solution: Refresh the page or log out and back in

**Problem**: Budget alert not showing
- Solution: Ensure alert threshold is set correctly

**Problem**: Can't add tags
- Solution: Tag name might already exist - use different name

**Problem**: Export file is empty
- Solution: Check if you have expenses in selected date range

---

## 🎯 Common Workflows

### Morning Routine
1. Check Analytics for yesterday's spending
2. View Budget Status
3. Add any outstanding expenses

### Weekly Review
1. Filter expenses by week
2. Check all categories in Analytics
3. Export for records

### Monthly Planning
1. Review monthly analytics
2. Adjust budgets if needed
3. Create recurring expenses
4. Export report for records

---

## 🚀 Next Features Coming

- 📧 Email alerts for budget exceeded
- 📱 Mobile app version
- 🤖 AI spending insights
- 📸 Receipt scanning
- 👥 Family expense sharing
- 📊 Detailed reports

---

## 💬 Need Help?

- Check PROJECT_EXPANSION_SUMMARY.md for technical details
- Review components code in your editor
- Test features with sample data
- Check browser console for errors

---

**Happy Expense Tracking! 💰**
