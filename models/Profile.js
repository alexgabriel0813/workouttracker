const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creating Schema
const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    handle: {
        type: String,
        required: true,
        max: 40
    },
    location: {
        type: String
    },
    goal: {
        type: String
    },
    weight: {
        type: String
    },
    age: {
        type: String
    },
    height: {
        type: String
    },
    bio: {
        type: String
    },
    social: {
        facebook: {
            type: String
        },
        twitter: {
            type: String
        },
        instagram: {
            type: String
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
    
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);