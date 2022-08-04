const mongoose = require('mongoose');

var articleSchema = mongoose.Schema({
    articleLanguage: String,
    author : String,
    content: String,
    description: String,
    publishAt: String,
    source: Object,
    title: String,
    url: String,
    urlToImage : String,
});

module.exports = mongoose.model('articles', articleSchema);