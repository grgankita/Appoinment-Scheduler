import { Transaction } from "../models/TransactionModel.js";
import { EsewaPaymentGateway, EsewaCheckStatus } from "esewajs";
import { v4 as uuidv4 } from "uuid";

const EsewaInitiatePayment = async (req, res) => {
  const { amount, profname, slotdate, slottime } = req.body;

  try {
    // Validate inputs
    if (!amount || !profname || !slotdate || !slottime) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (amount, profname, slotdate, slottime) are required",
      });
    }

    // Validate environment config
    if (
      !process.env.MERCHANT_ID ||
      !process.env.SECRET ||
      !process.env.SUCCESS_URL ||
      !process.env.FAILURE_URL ||
      !process.env.ESEWAPAYMENT_URL
    ) {
      return res.status(500).json({
        success: false,
        message: "Esewa configuration missing",
      });
    }

    const id = uuidv4(); // unique ID for this transaction

    // Initiate payment
    const reqPayment = await EsewaPaymentGateway(
      amount,
      0,
      0,
      0,
      id,
      process.env.MERCHANT_ID,
      process.env.SECRET,
      process.env.SUCCESS_URL,
      process.env.FAILURE_URL,
      process.env.ESEWAPAYMENT_URL
    );

    if (!reqPayment || reqPayment.status !== 200) {
      return res.status(400).json({
        success: false,
        message: "Error initiating eSewa payment",
      });
    }

    // Save the appointment transaction
    const transaction = new Transaction({
      id,
      amount,
      professional_name: profname,
      appointment_date: slotdate,
      appointment_time: slottime,
      status: "PENDING",
    });

    await transaction.save();

    const redirectUrl =
      reqPayment?.request?.res?.responseUrl || process.env.ESEWAPAYMENT_URL;

    return res.status(200).json({
      success: true,
      url: redirectUrl,
      message: "eSewa Payment URL generated",
    });
  } catch (error) {
    console.error(" Error in EsewaInitiatePayment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const paymentStatus = async (req, res) => {
  const { id } = req.body;

  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Find the transaction by id
    const transaction = await Transaction.findOne({ id });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    const paymentStatusCheck = await EsewaCheckStatus(
      transaction.amount,
      transaction.id,
      process.env.MERCHANT_ID,
      process.env.ESEWAPAYMENT_STATUS_CHECK_URL
    );

    if (paymentStatusCheck.status === 200) {
      // Update the transaction status
      transaction.status = paymentStatusCheck.data.status;
      await transaction.save();

      res.status(200).json({
        success: true,
        message: "Transaction status updated successfully",
        data: {
          transaction_id: transaction.id,
          status: transaction.status,
          amount: transaction.amount,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to verify payment status",
      });
    }
  } catch (error) {
    console.error("Error updating transaction status:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export { EsewaInitiatePayment, paymentStatus };
