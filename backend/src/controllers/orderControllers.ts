import {
  NotFoundError,
  UnAuthorizedError,
  UnauthenticatedError,
} from "../errors/customErrors"
import { AuthenticatedRequest } from "../middleware/authMiddleware"
import { Response } from "express"
import Order from "../models/orderModel"
import Product from "../models/productModel"
import User from "../models/userModel"
import Expense from "../models/expensesModel"
import { StatusCodes } from "http-status-codes"
import dayjs from "dayjs"
import Cash from "../models/cashModel"
import Bank from "../models/bankModel"

// CREATE ORDER
export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  const { total, items, balance, cash, bank, customer } = req.body
  if (!total || !items) throw new NotFoundError("Missing fields")

  req.body.enteredAt = dayjs(new Date(Date.now())).format("YYYY-MM-DD")
  const orderItems = items

  // check for correct product
  for (let orderItem of orderItems) {
    let existingItem = await Product.findOne({ _id: orderItem.productId })
    if (!existingItem)
      throw new NotFoundError(`No product with id: ${orderItem.productId}`)

    // update inventory
    existingItem.qty -= orderItem.pcs
    await Product.findOneAndUpdate(
      { _id: orderItem.productId },
      { qty: existingItem.qty },
      { new: true, runValidators: true }
    )
  }

  await Order.create({
    total,
    orderItems,
    balance,
    cash,
    bank,
    userId: req.user?.userId,
    customer,
    enteredAt: req.body.enteredAt,
  })

  if (cash > 0) {
    await Cash.create({
      amount: cash,
      enteredBy: req.user?.userName,
      enteredAt: req.body.enteredAt,
    })
  }
  if (bank > 0) {
    await Bank.create({
      amount: bank,
      enteredBy: req.user?.userName,
      enteredAt: req.body.enteredAt,
    })
  }

  res.status(StatusCodes.CREATED).json({ msg: "Order Created" })
}

// GET ALL ORDERS
export const getAllOrders = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const orders = await Order.find({}).sort({ enteredAt: -1 })
  res.status(StatusCodes.OK).json({ count: orders.length, orders })
}

// GET SINGLE ORDER
export const singleOrder = async (req: AuthenticatedRequest, res: Response) => {
  const order = await Order.findOne({ _id: req.params.id })
  if (!order) throw new NotFoundError("This order does not exist")

  const user = await User.findOne({ _id: order.userId })
  if (!user) throw new NotFoundError("No user found")

  res.status(StatusCodes.OK).json({ soldBy: user.firstName, order })
}

// DELETE ORDER .... THIS WILL NOT BE CARRIED OUT THOUGH
export const deleteOrder = async (req: AuthenticatedRequest, res: Response) => {
  if (req.user?.role !== "admin") throw new UnAuthorizedError("Not Permitted")

  const order = await Order.findOne({ _id: req.params.id })
  if (!order)
    throw new NotFoundError(`No order found with id: ${req.params.id}`)

  for (let item of order.orderItems) {
    const product = await Product.findOne({ _id: item.productId })

    if (!product) throw new NotFoundError("Product does not exist")
    product.qty += item.pcs

    await Product.findOneAndUpdate(
      { _id: item.productId },
      { qty: product.qty },
      { new: true, runValidators: true }
    )
  }

  await Order.findOneAndDelete({ _id: req.params.id })
  res.status(StatusCodes.OK).json({ msg: "Order deleted" })
}

// RETURN ITEM
export const returnItem = async (req: AuthenticatedRequest, res: Response) => {
  if (req.user?.role !== "admin") throw new UnAuthorizedError("Not permitted")

  const { orderId, itemId } = req.query
  if (!orderId || !itemId) throw new UnauthenticatedError("Invalid credentials")

  const order = await Order.findOne({ _id: orderId })
  if (!order) throw new NotFoundError("Order does not exist")

  order.orderItems.forEach(async (item) => {
    const targetItem = order.orderItems.find(
      (item) => String(item._id) === itemId
    )

    if (!targetItem) throw new NotFoundError("Item does not exist")

    if (targetItem.returned)
      throw new UnauthenticatedError("Item already returned")

    if (item === targetItem) {
      const product = await Product.findOne({ _id: targetItem.productId })
      if (!product) throw new NotFoundError("Product not found")
      product.qty += targetItem.pcs
      await Product.findOneAndUpdate(
        { _id: product._id },
        { qty: product.qty },
        { new: true, runValidators: true }
      )
    }
  })

  const newOrderItems = order.orderItems.map((item) => {
    if (String(item._id) === itemId) {
      item.returned = true
    }
    return item
  })
  await Order.findOneAndUpdate(
    { _id: orderId },
    { orderItems: newOrderItems },
    { new: true, runValidators: true }
  )

  res.status(StatusCodes.OK).json({ msg: "Item returned & Inventory updated" })
}

// UPDATE ORDER
export const updateOrder = async (req: AuthenticatedRequest, res: Response) => {
  const order = await Order.findById(req.params.id)
  if (!order) throw new NotFoundError("order not found")

  await Order.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { runValidators: true, new: true }
  )
  res.status(StatusCodes.OK).json({ msg: "order updated" })
}

// CALCULATE PROFIT
export const getProfit = async (req: AuthenticatedRequest, res: Response) => {
  let grossProfit: number = 0

  if (req.user?.role !== "admin")
    throw new UnAuthorizedError("Not permitted to perform this task")

  const orders = await Order.find({})

  for (let order of orders) {
    for (let item of order.orderItems) {
      if (!item.returned) {
        grossProfit += item.diff
      }
    }
  }

  const expenses = await Expense.find({})
  const totalExpenses = expenses.reduce((total, value) => {
    total += value.amount as number
    return total
  }, 0)

  const analysis: {
    grossProfit: number
    totalExpenses: number
    netProfit: number
  } = {
    grossProfit,
    totalExpenses,
    netProfit: grossProfit - totalExpenses,
  }
  res.status(StatusCodes.OK).json({ analysis })
}
