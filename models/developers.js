let mongoose = require('mongoose');

let developerSchema = mongoose.Schema({
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    level: {
        type: String,
        required: true
    },
    address: {
        unit: String,
        street: String,
        suburb: String,
        state: String
    }
});

developerSchema.pre('save', function(){
    this.level = this.level.toUpperCase();
});


module.exports = mongoose.model('Developer', developerSchema);