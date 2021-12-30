module.exports = function(app) {
    app.use("/keywords", require('./keywords'));
    app.use("/categories", require('./categories'));
    app.use("/articles", require('./articles'));
    app.use("/saved-articles", require('./savedArticles'));
};