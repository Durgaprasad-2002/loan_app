const express = require("express");
const Loan = require("../model/Loan");
const Repayment = require("../model/Repayment");
const { authMiddleware } = require("./User");
const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { amount, tenure, userId } = req.body;
    const term = tenure;

    if (![1, 2, 3].includes(term)) {
      return res.status(400).json({ error: "Term must be 1, 2, or 3 weeks" });
    }

    const weeklyAmount = Math.floor((amount / term) * 100) / 100;
    const finalWeekAmount = amount - weeklyAmount * (term - 1);

    const loan = await Loan.create({ userId, amount, term });

    for (let i = 0; i < term; i++) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + (i + 1) * 7);
      await Repayment.create({
        loanId: loan._id,
        dueDate,
        amount: i === term - 1 ? finalWeekAmount : weeklyAmount,
      });
    }

    res.status(201).json({ message: "Loan created!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/repay/:repaymentId", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    const repayment = await Repayment.findById(req.params.repaymentId).populate(
      "loanId"
    );

    if (
      !repayment ||
      repayment.status === "PAID" ||
      repayment.loanId.status !== "APPROVED"
    ) {
      return res
        .status(400)
        .json({ error: "Invalid repayment or loan not approved" });
    }

    if (amount < repayment.amount) {
      return res.status(400).json({
        error:
          "Repayment amount must be greater than or equal to the due amount",
      });
    }

    repayment.status = "PAID";
    await repayment.save();

    const allRepayments = await Repayment.find({
      loanId: repayment.loanId._id,
    });
    if (allRepayments.every((rep) => rep.status === "PAID")) {
      repayment.loanId.status = "PAID";
      await repayment.loanId.save();
    }

    res.json({ message: "Repayment successful!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/repayments/:userId", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;

    const activeLoans = await Loan.find({
      userId: userId,
      status: { $ne: "PAID" },
    });

    const loanIds = activeLoans.map((loan) => loan._id);

    const pendingRepayments = await Repayment.find({
      loanId: { $in: loanIds },
      status: "PENDING",
    }).populate("loanId", "amount term");

    res.json(
      pendingRepayments.map((repayment) => ({
        repaymentId: repayment._id,
        loanId: repayment.loanId._id,
        loanAmount: repayment.loanId.amount,
        loanTerm: repayment.loanId.term,
        dueDate: repayment.dueDate,
        dueAmount: repayment.amount,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/loans/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const [pendingLoans, approvedLoans, paidLoans] = await Promise.all([
      Loan.find({ userId: userId, status: "PENDING" }).populate("repayments"),
      Loan.find({ userId: userId, status: "APPROVED" }).populate("repayments"),
      Loan.find({ userId: userId, status: "PAID" }),
    ]);

    res.json({
      pending: pendingLoans,
      approved: approvedLoans,
      paid: paidLoans,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
