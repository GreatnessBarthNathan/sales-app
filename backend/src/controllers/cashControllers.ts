import { Response } from "express"
import { AuthenticatedRequest } from "middleware/authMiddleware"
import Cash from "../models/cashModel"
import Bank from "../models/bankModel"
import { StatusCodes } from "http-status-codes"
import { BadRequestError } from "../errors/customErrors"
import dayjs from "dayjs"

export const createCashRecord = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { amount, remark, action } = req.body
  if (!amount || !remark || !action)
    throw new BadRequestError("please enter all values")

  const enteredAt = dayjs(new Date(Date.now())).format("YYYY-MM-DD")
  const enteredBy = req.user?.userName

  if (action === "to bank") {
    await Bank.create({
      amount,
      remark: "Cash paid into bank",
      action: "add",
      enteredBy,
      enteredAt,
    })

    await Cash.create({
      amount,
      remark,
      action: "release",
      enteredAt,
      enteredBy,
    })
    res.status(StatusCodes.CREATED).json({ msg: "record created" })
    return
  }

  await Cash.create({ amount, remark, action, enteredAt, enteredBy })
  res.status(StatusCodes.CREATED).json({ msg: "record created" })
}

export const allCashRecords = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const cash = await Cash.find({})
  res.status(StatusCodes.OK).json({ cash })
}
export const singleCashRecord = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  res.send("single cash record")
}
export const updateCashRecord = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  res.send("update cash record")
}
export const deleteCashRecord = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  res.send("delete cash record")
}
