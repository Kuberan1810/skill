const express = require("express");
const crypto = require("crypto");
const razorpay = require("../razorpay");

const router = express.Router();

// CREATE ORDER
router.post("/create-order", async (req, res) => {
    try {
        const order = await razorpay.orders.create({
            amount: 1 * 100,
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        });

        res.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// VERIFY PAYMENT
router.post("/verify", (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expected = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign)
        .digest("hex");

    if (expected === razorpay_signature) {
        res.json({ status: "success" });
    } else {
        res.status(400).json({ status: "failed" });
    }
});

module.exports = router;
