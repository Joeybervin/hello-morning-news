const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    email: String,
    password: String,
    username : String,
    articlelist : [{type: mongoose.Schema.Types.ObjectId, ref: 'articles' }],
    token: String,
});

module.exports = mongoose.model('users', userSchema);