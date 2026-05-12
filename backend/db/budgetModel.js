/*const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'users'
    },
    category : {
        type : String,
        required : true,
    },
    limitAmount : {
        type : Number,
        required : true
    },
    period : {
        type : String,
        enum : ['daily', 'weekly', 'monthly', 'yearly'],
        default : 'monthly'
    },
    currency : {
        type : String,
        default : 'INR'
    },
    alertThreshold : {
        type : Number,
        default : 80  // Alert when 80% of budget is spent
    },
    isActive : {
        type : Boolean,
        default : true
    }
}, {
    timestamps : true
})

const budgetModel = mongoose.model('budgets', budgetSchema);

module.exports = budgetModel;
*/
