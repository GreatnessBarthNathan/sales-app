import {
  FormEvent,
  useContext,
  createContext,
  ChangeEvent,
  useState,
  useEffect,
} from "react"
import customFetch from "../utils/customFetch"
import { toast } from "react-toastify"
import { useNavigate, useLoaderData } from "react-router-dom"
import axios from "axios"
import SearchOrderProduct from "../components/SearchOrderProduct"
import { useDashboardContext } from "./DashboardLayout"
import { OrderItemsType, CustomerType } from "../utils/types"
import OrderItems from "../components/OrderItems"
import EditOrderPrice from "../components/EditOrderPrice"
import TransactionDetails from "../components/TransactionDetails"

type ValueTypes = {
  submitSearchOrderProduct: (e: FormEvent<HTMLFormElement>) => void
  total: number
  cash: number
  bank: number
  transaction: string
  balance: number
  setCash: React.Dispatch<React.SetStateAction<number>>
  setBank: React.Dispatch<React.SetStateAction<number>>
  productNames: string[]
  orderItems: OrderItemsType[]
  increment: (id: string) => void
  decrement: (id: string) => void
  deleteItem: (id: string) => void
  openEditOrderPrice: (id: string) => void
  closeEditOrderPrice: () => void
  submitEditPriceForm: (e: FormEvent<HTMLFormElement>) => void
  findCustomer: (e: ChangeEvent<HTMLInputElement>) => void
  customerName: string
  setTransaction: React.Dispatch<React.SetStateAction<string>>
}

const CreateOrderContext = createContext<ValueTypes | undefined>(undefined)

export const loader = async () => {
  try {
    const {
      data: { customers },
    } = await customFetch.get("/customer")
    return { customers }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return toast.error(error.response?.data?.msg)
    }
  }
}

function getLocalStorage() {
  let orderItems: OrderItemsType[]
  if (localStorage.getItem("orderItems") === null) {
    orderItems = []
  } else {
    orderItems = JSON.parse(localStorage.getItem("orderItems") as string)
  }
  return orderItems
}

type CustomerTypeArray = {
  customers: CustomerType[]
}

function CreateOrder() {
  const { allProducts } = useDashboardContext()
  const productNames = allProducts.map((product) => product.name).sort()
  const [orderItems, setOrderItems] = useState<OrderItemsType[]>(
    getLocalStorage()
  )
  const [showEditPrice, setShowEditPrice] = useState(false)
  const [editID, setEditID] = useState("")
  const [total, setTotal] = useState(0)
  const [transaction, setTransaction] = useState("cash")
  const [cash, setCash] = useState(0)
  const [bank, setBank] = useState(0)
  const [balance, setBalance] = useState(0)
  const [customerName, setCustomerName] = useState("Anonymous")
  const [customer, setCustomer] = useState<CustomerType>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    role: "",
    _id: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()
  const { customers } = useLoaderData() as CustomerTypeArray

  // SUBMIT SEARCH PRODUCT FORM
  const submitSearchOrderProduct = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const select = formData.get("product")
    const product = allProducts.find((product) => product.name === select)
    if (!product) throw new Error("product does not exist")
    const alreadySelected = orderItems.find(
      (item) => item.name === product.name
    )
    if (alreadySelected) {
      toast.error("Item already selected")
      return
    }
    setOrderItems([
      ...orderItems,
      {
        name: product.name,
        cost: product.CP,
        price: product.SP,
        pcs: 1,
        subTotal: product.SP,
        returned: false,
        diff: 0,
        productId: product._id,
      },
    ])
  }

  // INCREASE QUANTITY
  const increment = (id: string) => {
    const products = orderItems.map((item: OrderItemsType) => {
      // for items sold in half
      if (item.productId === id && item.name === "polyplus") {
        item.pcs += 0.5
        item.subTotal = item.pcs * item.price
      }
      if (item.productId === id && item.name !== "polyplus") {
        item.pcs += 1
        item.subTotal = item.pcs * item.price
      }
      return item
    })
    setOrderItems(products)
  }

  // DECREASE QUANTITY
  const decrement = (id: string) => {
    const products = orderItems.map((item: OrderItemsType) => {
      // for items sold in half
      if (
        item.productId === id &&
        item.name === "polyplus" &&
        item.pcs !== 0.5
      ) {
        item.pcs -= 0.5
        item.subTotal = item.pcs * item.price
      }

      // for items sold in whole
      if (item.productId === id && item.name !== "polyplus" && item.pcs !== 1) {
        item.pcs -= 1
        item.subTotal = item.pcs * item.price
      }
      return item
    })
    setOrderItems(products)
  }

  // DELETE ORDER ITEM
  const deleteItem = (id: string) => {
    const products = orderItems.filter(
      (item: OrderItemsType) => item.productId !== id
    )
    setOrderItems(products)
  }

  const openEditOrderPrice = (id: string) => {
    setEditID(id)
    setShowEditPrice(true)
  }

  const closeEditOrderPrice = () => {
    setShowEditPrice(false)
  }

  // SUBMIT EDIT PRICE FORM
  const submitEditPriceForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const price = Number(new FormData(e.currentTarget).get("price"))

    const products = orderItems.map((item: OrderItemsType) => {
      if (item.productId === editID) {
        item.price = price
        item.subTotal = item.pcs * item.price
      }
      return item
    })
    setOrderItems(products)
    setEditID("")
    setShowEditPrice(false)
  }

  //  Get Total
  const getTotal = () => {
    const orderTotal = orderItems.reduce(
      (total: number, item: OrderItemsType) => {
        total += item.subTotal
        return total
      },
      0
    )
    setTotal(orderTotal)
 
    // calculate the diff for items
    orderItems.forEach((item) => {
      item.diff = item.subTotal - item.cost * item.pcs
    })
  }

  // clear cart
  const clearCart = () => {
    setOrderItems([])
    localStorage.removeItem("orderItem")
  }

  // calculate balance
  const getBalance = () => {
    if (transaction === "cash") {
      setBalance(0)
    } else {
      setBalance(total - (cash + bank))
    }
  }

  // FIND CUSTOMER
  const findCustomer = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length === 0) setCustomerName("Anonymous")

    if (e.target.value.length > 0 && e.target.value.length < 11)
      setCustomerName("customer not found")

    if (e.target.value.length === 11) {
      const customer = customers.find(
        (customer) => customer.phoneNumber === e.target.value
      )

      if (customer) {
        setCustomerName(`${customer?.firstName} ${customer?.lastName}`)
        setCustomer({
          ...customer,
          firstName: customer?.firstName as string,
          lastName: customer?.lastName as string,
          phoneNumber: customer?.phoneNumber as string,
          role: customer?.role as string,
          _id: customer?._id as string,
        })
      }
      if (!customer) setCustomerName("customer not found")
    }
  }

  // SUBMIT ORDER
  const submitOrder = async () => {
    if (transaction === "cash" && cash + bank !== total) {
      toast.error("Invalid calculation")
      return
    }

    if (transaction === "credit" && cash + bank >= total) {
      toast.error("Invalid calculation")
      return
    }

    if (customerName === "customer not found") {
      toast.error("please enter valid customer")
      return
    }

    if (transaction === "credit" && customerName === "Anonymous") {
      toast.error("please enter customer for credit transaction")
      return
    }

    setIsSubmitting(true)
    const data = { items: orderItems, total, cash, bank, balance, customer }

    try {
      await customFetch.post("/order", data)
      toast.success("Order created")
      navigate("/dashboard/orders")
      setIsSubmitting(false)
      localStorage.removeItem("orderItems")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.msg)
        setIsSubmitting(false)
      }
    }
  }

  useEffect(() => {
    getTotal()
  }, [orderItems])

  useEffect(() => {
    const intervalID = setInterval(() => {
      getBalance()
    })
    return () => clearInterval(intervalID)
  })

  useEffect(() => {
    localStorage.setItem("orderItems", JSON.stringify(orderItems))
  }, [orderItems])

  const values = {
    submitSearchOrderProduct,
    productNames,
    orderItems,
    increment,
    decrement,
    deleteItem,
    openEditOrderPrice,
    closeEditOrderPrice,
    submitEditPriceForm,
    total,
    cash,
    bank,
    transaction,
    balance,
    setCash,
    setBank,
    findCustomer,
    customerName,
    setTransaction,
  }
  return (
    <CreateOrderContext.Provider value={values}>
      <main className='py-5'>
        <h1 className='md:text-2xl lg:text-4xl mb-2 lg:mb-5 font-bold'>
          Create New Order
        </h1>
        <section className='bg-white px-2 py-5 rounded-md shadow'>
          <SearchOrderProduct />
        </section>

        {/* TABLE HEAD */}
        <div className='grid grid-cols-5 mt-10 text-left border border-b-slate-600 p-3 font-bold bg-white'>
          <h2 className='col-span-2 text-[8px] md:text-sm lg:text-base'>
            Item
          </h2>
          <h2 className='text-[8px] md:text-sm lg:text-base'>Price</h2>
          <h2 className='text-[8px] md:text-sm lg:text-base'>Quantity</h2>
          <h2 className='text-[8px] md:text-sm lg:text-base'>Subtotal</h2>
        </div>

        {/* TABLE BODY */}
        <div className='border border-[whitesmoke]'>
          {orderItems.map((item) => (
            <OrderItems key={item.productId} {...item} />
          ))}
        </div>

        {/* TABLE FOOTER */}
        <div
          className={`${
            orderItems.length < 1 && "hidden"
          } grid grid-cols-3 gap-2 mt-5 border border-[whitesmoke] border-t-slate-600 pt-5`}
        >
          <TransactionDetails />
        </div>

        {/* CLEAR CART & SUBMIT BTNS */}
        <div
          className={`${
            orderItems.length < 1 && "hidden"
          } flex justify-between mt-3 `}
        >
          {/* clear cart btn */}
          <button
            className='bg-red-600 rounded px-5 text-white hover:bg-red-800 ease-in-out duration-300 text-xs md:text-base'
            onClick={clearCart}
          >
            Clear Cart
          </button>

          {/* Submit btn */}
          <button
            className={`bg-green-700 py-2 px-5 rounded text-white hover:bg-green-900 ease-in-out duration-300 text-xs md:text-base ${
              isSubmitting && "cursor-wait"
            }`}
            onClick={submitOrder}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Confirm Order"}
          </button>
        </div>
        {showEditPrice && <EditOrderPrice />}
      </main>
    </CreateOrderContext.Provider>
  )
}

export const useCreateOrderContext = () => {
  const context = useContext(CreateOrderContext)
  if (context === undefined)
    throw new Error(
      "useCreateOrderContext must be used within Create Order Context Provider"
    )
  return context
}

export default CreateOrder
