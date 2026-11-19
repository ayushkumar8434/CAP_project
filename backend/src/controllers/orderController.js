import mongoose from "mongoose";
import Order from "../models/Order.js";

export async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
}

export async function getOrderById(req, res) {
  const { orderId } = req.params;

  if (!mongoose.isObjectIdOrHexString(orderId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID",
    });
  }

  try {
    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
}

export async function cancelOrder(req, res) {
  const { orderId } = req.params;

  if (!mongoose.isObjectIdOrHexString(orderId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID",
    });
  }

  try {
    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
        user: req.user.id,
        orderStatus: { $in: ["pending", "confirmed"] },
      },
      { $set: { orderStatus: "cancelled" } },
      { new: true, runValidators: true },
    );

    if (order) {
      return res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
        order,
      });
    }

    const existingOrder = await Order.findOne({
      _id: orderId,
      user: req.user.id,
    }).select("orderStatus");

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(409).json({
      success: false,
      message: "Only pending or confirmed orders can be cancelled",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  }
}
