import { BadRequestError, NotFoundError } from "../errors/customErrors"
import { Response } from "express"
import { AuthenticatedRequest } from "../middleware/authMiddleware"
import { StatusCodes } from "http-status-codes"
import Customer from "../models/customerModel"

export const createCustomer = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { firstName, lastName, phoneNumber } = req.body
  if (!firstName || !lastName || !phoneNumber)
    throw new BadRequestError("Please enter all fields")

  const alreadyExists = await Customer.findOne({ phoneNumber })
  if (alreadyExists) throw new BadRequestError("This customer already exists")

  await Customer.create(req.body)
  res.status(StatusCodes.CREATED).json({ msg: "customer account created" })
}

export const getAllCustomers = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const customers = await Customer.find({})
  res.status(StatusCodes.OK).json({ count: customers.length, customers })
}

export const getSingleCustomer = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const customer = await Customer.findOne({ _id: req.params.id })
  if (!customer)
    throw new NotFoundError(`No customer found with the id: ${req.params.id}`)
  res.status(StatusCodes.OK).json({ customer })
}

export const updateCustomer = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { firstName, lastName, phoneNumber } = req.body
  if (!firstName || !lastName || !phoneNumber)
    throw new BadRequestError("Please provide all values")

  const customer = await Customer.findOne({ _id: req.params.id })
  if (!customer)
    throw new NotFoundError(`No customer found with the id: ${req.params.id}`)

  await Customer.findOneAndUpdate(
    { _id: req.params.id },
    { ...req.body },
    { runValidators: true, new: true }
  )
  res.status(StatusCodes.OK).json({ msg: "customer record updated" })
}

export const deleteCustomer = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const customer = await Customer.findOne({ _id: req.params.id })
  if (!customer)
    throw new NotFoundError(`No customer found with the id: ${req.params.id}`)
  await Customer.findOneAndDelete({ _id: req.params.id })
  res.status(StatusCodes.OK).json({ msg: "customer deleted" })
}
