let mongoose = require('mongoose');

let taskSchema = mongoose.Schema({
    name: String,
    assign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Developer'
    },
    due: Date,
    status: String,
    desc: String
});

module.exports = mongoose.model('Task', taskSchema);