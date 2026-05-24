const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'users'
    },
    tagName : {
        type : String,
        required : true
    },
    color : {
        type : String,
        default : '#3B82F6'
    },
    usageCount : {
        type : Number,
        default : 0
    }
}, {
    timestamps : true
})

tagSchema.index({ userId : 1, tagName : 1 }, { unique : true });

const tagModel = mongoose.model('tags', tagSchema);

module.exports = tagModel;
