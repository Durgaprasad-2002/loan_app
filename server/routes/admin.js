const express = require("express");
const Loan = require("../model/Loan");
const Repayment = require("../model/Repayment");
const { authMiddleware } = require("./User");
const router = express.Router();

// Approve Pending Loans
router.put("/approve/:loanId", authMiddleware, async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.loanId);
    if (!loan || loan.status !== "PENDING") {
      return res
        .status(404)
        .json({ error: "Loan not found or already approved" });
    }
    loan.status = "APPROVED";
    await loan.save();
    res.json({ message: "Loan approved successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/status", authMiddleware, async (req, res) => {
  try {
    const [pendingLoans, approvedLoans, paidLoans] = await Promise.all([
      Loan.find({ status: "PENDING" })
        .populate("repayments")
        .populate("userId", "username"),
      Loan.find({ status: "APPROVED" })
        .populate("repayments")
        .populate("userId", "username"),
      Loan.find({ status: "PAID" })
        .populate("repayments")
        .populate("userId", "username"),
    ]);

    const formatLoanData = (loans) =>
      loans.map((loan) => ({
        customer: loan.userId.username,
        loanId: loan._id,
        status: loan.status,
        amount: loan.amount,
        term: loan.term,
        repayments: loan.repayments.map((rep) => ({
          dueDate: rep.dueDate,
          amount: rep.amount,
          status: rep.status,
        })),
      }));

    res.json({
      pending: formatLoanData(pendingLoans),
      approved: formatLoanData(approvedLoans),
      paid: formatLoanData(paidLoans),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
