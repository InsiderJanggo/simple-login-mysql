module.exports = (app) => {
    app.use("/blog", require("./blog"))
}