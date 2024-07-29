import { AuthenticatedRequest } from "../middleware/authMiddleware"
import { Response } from "express"
import Product from "../models/productModel"
import {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} from "../errors/customErrors"
import { StatusCodes } from "http-status-codes"

// CREATE STORE PRODUCT
export const createStoreProduct = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name, store } = req.body

  if (!name || !store) throw new BadRequestError("Please provide all values")

  if (req.user?.role !== "admin")
    throw new UnAuthorizedError("Not permitted to perform this task")
  const product = await Product.findOne({ name })
  if (!product) throw new NotFoundError("product does not exist")
  if (product.store > 0)
    throw new BadRequestError("This product is already in store")

  await Product.findOneAndUpdate(
    { name },
    { store },
    { new: true, runValidators: true }
  )
  res.status(StatusCodes.OK).json({ msg: "Product added to store" })
}

// UPDATE STORE PRODUCT
export const updateStore = async (req: AuthenticatedRequest, res: Response) => {
  const { name, branch, CP, SP, store, release } = req.body

  if (!name || !branch || !CP || !SP || !store)
    throw new BadRequestError("Please provide all values")
  if (req.user?.role !== "admin")
    throw new UnAuthorizedError("Not permitted to perform this task")

  const product = await Product.findOne({ name })

  if (!product) throw new NotFoundError("Product not found")

  product.qty = Number(release) + Number(product.qty)
  await Product.findOneAndUpdate(
    { name },
    { ...req.body, qty: product.qty },
    {
      new: true,
      runValidators: true,
    }
  )

  res.status(StatusCodes.OK).json({ msg: "store product updated" })
}

// CALCULATE WORTH OF GOODS IN STORE
export const calcStoreWorth = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  // if (req.user?.role !== "admin")
  //   throw new UnAuthorizedError("Not permitted to perform this task")
  const products = await Product.find({ store: { $gte: 1 } }).sort({ name: 1 })

  const storeWorth = await products.reduce(
    (total, value) => {
      total.totalCost += value.CP * value.store
      total.totalWorth += value.SP * value.store
      return total
    },
    { totalCost: 0, totalWorth: 0 }
  )

  res.status(StatusCodes.OK).json({ products, storeWorth })
}
