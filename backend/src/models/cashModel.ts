import mongoose from "mongoose"

const CashSchema = new mongoose.Schema({
  amount: Number,
  remark: {
    type: String,
    default: "Cash from sales order",
  },
  action: {
    type: String,
    default: "add",
  },
  enteredBy: String,
  enteredAt: String,
})

export default mongoose.model("Cash", CashSchema)
