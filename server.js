require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/payment", require("/routes/payment"));

app.listen(5000, () => {
    console.log("Backend running on port 5000");
});

