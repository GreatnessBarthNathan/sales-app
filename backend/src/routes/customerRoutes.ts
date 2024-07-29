import { Router } from "express"
import {
  createCustomer,
  getAllCustomers,
  getSingleCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerControllers"
import { permissions } from "../middleware/permissions"

const router = Router()

router.post("/", permissions, createCustomer)

router.get("/", getAllCustomers)

router.get("/:id", permissions, getSingleCustomer)

router.patch("/:id", permissions, updateCustomer)

router.delete("/:id", permissions, deleteCustomer)

export default router
