/*const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    usersid : {
        type :  mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'users'
    },
    amount : {
        type : Number,
        required : true 
    },
    category : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        default : ''
    },
    date : {
        type: Date,
        required : true,
    },
    tags : [{
        type : String,
        default : []
    }],
    currency : {
        type : String,
        default : 'INR'
    },
    isRecurring : {
        type : Boolean,
        default : false
    },
    recurringFrequency : {
        type : String,
        enum : ['daily', 'weekly', 'monthly', 'yearly', 'none'],
        default : 'none'
    },
    splitWith : [{
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'users'
        },
        amount : Number
    }],
    isEdited : {
        type : Boolean,
        default : false
    },
    originalExpenseId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'expenses',
        default : null
    }
},{
    timestamps : true
})

const expenseModel = mongoose.model('expenses' , expenseSchema);

module.exports = expenseModel;
*/