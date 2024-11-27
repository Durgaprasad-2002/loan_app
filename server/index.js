const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { router: authRouter } = require("./routes/User");
const LoanRouter = require("./routes/loan");
const adminRouter = require("./routes/admin");
const connectDB = require("./Connect");

dotenv.config();

var bodyParser = require("body-parser");

connectDB();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/api/loan", LoanRouter);
app.use("/api/admin", adminRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
