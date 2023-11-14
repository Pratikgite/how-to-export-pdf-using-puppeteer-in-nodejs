const endPoints = (app) => {
    app.use("/nodejs", require("./pdf-export"));
};

module.exports = endPoints;