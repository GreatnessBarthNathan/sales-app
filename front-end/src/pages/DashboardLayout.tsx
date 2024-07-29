import { createContext, useContext, useState, useEffect } from "react"
import { redirect, useLoaderData, useNavigate } from "react-router-dom"
import { Outlet, useNavigation } from "react-router-dom"
import BigSidebar from "../components/BigSidebar"
import SmallSidebar from "../components/SmallSidebar"
import Navbar from "../components/Navbar"
import Loading from "../components/Loading"
import customFetch from "../utils/customFetch"
import {
  ProductTypes,
  OrderType,
  ExpenseType,
  UserTypes,
  TransactionType,
} from "../utils/types"
import axios from "axios"
import { toast } from "react-toastify"

type ValueTypes = {
  currentUser: UserTypes
  allProducts: ProductTypes[]
  products: ProductTypes[]
  getProducts: () => void
  submitting: boolean
  logout: () => void
  fetchExpenses: () => Promise<ExpenseType[]>
  fetchOrders: () => Promise<OrderType[]>
  showSidebar: boolean
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>
  fetchUsers: () => Promise<UserTypes[]>
  fetchCash: () => Promise<TransactionType[]>
  fetchBank: () => Promise<TransactionType[]>

}

export const loader = async () => {
  try {
    const {
      data: { user },
    } = await customFetch.get("/user/current-user")
    const {
      data: { products },
    } = await customFetch.get("/product")

    return { user, products }
  } catch (error) {
    return redirect("/")
  }
}

type CombinedTypes = {
  products: ProductTypes[]
  user: UserTypes
}
const DashboardContext = createContext<ValueTypes | undefined>(undefined)

function DashboardLayout() {
  const { user: currentUser, products: allProducts } =
    useLoaderData() as CombinedTypes

  const [submitting] = useState(false)
  const [products, setProducts] = useState<ProductTypes[]>([])
  const [showSidebar, setShowSidebar] = useState(false)

  const navigate = useNavigate()

  const navigation = useNavigation()
  const isLoading = navigation.state === "loading"

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      const {
        data: { users },
      } = await customFetch.get("/user")
      return users
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.msg)
        return
      }
    }
  }

  // FETCH EXPENSES
  const fetchExpenses = async () => {
    try {
      const {
        data: { expenses },
      } = await customFetch.get("/expense")
      return expenses
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.msg)
        return
      }
    }
  }

  // FETCH CASH
  const fetchCash = async () => {
    try {
      const {
        data: { cash },
      } = await customFetch.get("/cash")
      return cash
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.msg)
      }
    }
  }

  // FETCH BANK
  const fetchBank = async () => {
    try {
      const {
        data: { bank },
      } = await customFetch.get("/bank")
      return bank
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.msg)
      }
    }
  }

  // GET PRODUCTS
  const getProducts = async () => {
    try {
      const {
        data: { products },
      } = await customFetch.get("/product")

      setProducts(products)
    } catch (error) {
      console.log(error)
    }
  }

  // FETCH ORDERS
  const fetchOrders = async () => {
    try {
      const {
        data: { orders },
      } = await customFetch.get("/order")

      return orders
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.msg)
      }
    }
  }

  // LOGOUT
  const logout = async () => {
    try {
      await customFetch.get("/auth/logout")
      toast.success("...logged out")
      navigate("/")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.msg)
        return
      }
    }
  }

  // STORE
  useEffect(() => {
    getProducts()
  }, [])

  const values = {
    currentUser,
    allProducts,
    products,
    getProducts,
    submitting,
    logout,
    fetchExpenses,
    fetchOrders,
    setShowSidebar,
    showSidebar,
    fetchUsers,
    fetchCash,
    fetchBank,
   
  }
  return (
    <>
      <DashboardContext.Provider value={values}>
        <main className='grid lg:grid-cols-5 h-[100dvh] overflow-hidden'>
          <BigSidebar />
          <div className='lg:col-span-4 overflow-auto'>
            <SmallSidebar />
            <Navbar />
            <div className='p-2 lg:p-10 relative'>
              {isLoading ? <Loading /> : <Outlet />}
            </div>
          </div>
        </main>
      </DashboardContext.Provider>
    </>
  )
}

export const useDashboardContext = () => {
  const context = useContext(DashboardContext)
  if (context === undefined)
    throw new Error(
      "useDashboardContext must be used within Dashboard Context Provider"
    )
  return context
}

export default DashboardLayout
