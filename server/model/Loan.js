const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  term: { type: Number, required: true },
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "PAID"],
    default: "PENDING",
  },
  repayments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Repayment" }],
});

module.exports = mongoose.model("Loan", loanSchema);
