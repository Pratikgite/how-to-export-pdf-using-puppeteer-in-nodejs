const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const endpoints = require("./routes/endPoint");

app.get("/", async(req, res) => {
    res.send("working fine...");
});

endpoints(app);

app.listen(3000, async(err) => {
    if(err) console.log("Error: ", err);
    console.log("Server Works fine...");
});