import { Router } from "express"
import {
  createOrder,
  getAllOrders,
  deleteOrder,
  returnItem,
  singleOrder,
  getProfit,
  updateOrder,
} from "../controllers/orderControllers"
import { permissions } from "../middleware/permissions"

const router = Router()

router.post("/", permissions, createOrder)

router.get("/", getAllOrders)

router.get("/return-item", permissions, returnItem)

router.get("/profit", permissions, getProfit)

router.patch("/:id", permissions, updateOrder)

router.delete("/:id", permissions, deleteOrder)

router.get("/:id", permissions, singleOrder)

export default router
