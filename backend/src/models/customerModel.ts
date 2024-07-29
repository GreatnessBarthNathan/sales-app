import mongoose from "mongoose"

const CustomerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phoneNumber: {
    type: String,
    minLength: 11,
    maxLength: 11,
    trim: true,
  },
  role: {
    type: String,
    default: "customer",
  },
  bonus: Number,
})

export default mongoose.model("Customer", CustomerSchema)
