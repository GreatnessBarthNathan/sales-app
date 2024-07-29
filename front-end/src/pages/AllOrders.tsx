import {
  useEffect,
  useState,
  FormEvent,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
} from "react"
import { useDashboardContext } from "./DashboardLayout"
import SearchOrderForm from "../components/SearchOrderForm"
import SingleOrder from "../components/SingleOrder"
import Loading from "../components/Loading"
import { ExpenseType, OrderType } from "../utils/types"
import dayjs from "dayjs"
import axios from "axios"
import { toast } from "react-toastify"
import { AnalysisType } from "../utils/types"
import Analysis from "../components/Analysis"
import ReturnItemModal from "../components/modals/ReturnItemModal"
import customFetch from "../utils/customFetch"

type IDType = {
  orderId: string
  itemId: string
}
type ValueTypes = {
  showReturnItemModal: boolean
  setShowReturnItemModal: Dispatch<SetStateAction<boolean>>
  IDs: IDType
  setIDs: Dispatch<SetStateAction<IDType>>
  returnItem: () => void
}

const OrderContext = createContext<ValueTypes | undefined>(undefined)

function AllOrders() {
  const { fetchOrders, fetchExpenses } = useDashboardContext()
  const [orders, setOrders] = useState<OrderType[]>([])
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState("")
  const [displayedExpenses, setDisplayedExpenses] = useState<ExpenseType[]>([])
  const [analysis, setAnalysis] = useState<AnalysisType>({
    total: 0,
    totalReturned: 0,
    grossProfit: 0,
    expenses: 0,
    netProfit: 0,
    totalCash: 0,
    totalBank: 0,
  })
  const [showReturnItemModal, setShowReturnItemModal] = useState(false)
  const [IDs, setIDs] = useState<IDType>({ orderId: "", itemId: "" })

  // GET ORDERS
  const getOrders = async () => {
    setLoading(true)
    const today = dayjs(new Date(Date.now())).format("YYYY-MM-DD")

    setDate(
      new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
        new Date(Date.now())
      )
    )

    try {
      // orders
      const orders = await fetchOrders()
      const todayOrders = orders.filter(
        (order: OrderType) =>
          (order.enteredAt as string) >= today &&
          (order.enteredAt as string) <= today
      )

      setOrders(todayOrders)
      // expenses
      const expenses = await fetchExpenses()
      const todayExpenses = expenses.filter(
        (expense: ExpenseType) =>
          (expense.enteredAt as string) >= today &&
          (expense.enteredAt as string) <= today
      )
      setDisplayedExpenses(todayExpenses)
      setLoading(false)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.msg)
        return
      }
    }
  }

  // FILTER ORDERS
  const searchOrders = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const from = new FormData(e.currentTarget).get("from")
    const to = new FormData(e.currentTarget).get("to")

    if (from === null || to === null) {
      console.error("Date range is not specified")
      return
    }
    const newFrom = new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
    }).format(new Date(from as string))
    const newTo = new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
    }).format(new Date(to as string))

    setDate(`${newFrom} - ${newTo}`)

    // order
    const orders = await fetchOrders()
    const newOrders = orders.filter(
      (order: OrderType) => order.enteredAt >= from && order.enteredAt <= to
    )

    setOrders(newOrders)

    // expenses
    const expenses = await fetchExpenses()
    const newExpenses = expenses.filter(
      (expense: ExpenseType) =>
        (expense.enteredAt as string) >= from &&
        (expense.enteredAt as string) <= to
    )
    setDisplayedExpenses(newExpenses)
    setLoading(false)
  }

  // CALCULATE PROFIT
  const calculateProfit = async () => {
    let grossProfit: number = 0
    let totalReturned: number = 0

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (!item.returned) {
          grossProfit += item.diff
        }
        if (item.returned) {
          totalReturned += item.subTotal
        }
      })
    })

    const expenses = displayedExpenses.reduce((total, value) => {
      total += value.amount as number
      return total
    }, 0)

    const totals = orders.reduce(
      (total, order) => {
        total.totalOrders += order.total

        if (order.cash !== undefined) total.totalCash += order.cash

        if (order.bank !== undefined) total.totalBank += order.bank

        return total
      },
      { totalOrders: 0, totalCash: 0, totalBank: 0 }
    )
    const analysis: AnalysisType = {
      total: totals.totalOrders,
      totalBank: totals.totalBank,
      totalCash: totals.totalCash,
      totalReturned,
      grossProfit,
      expenses,
      netProfit: grossProfit - expenses,
    }

    setAnalysis(analysis)
  }

  // RETURN ITEM
  const returnItem = async () => {
    try {
      await customFetch.get(
        `/order/return-item?orderId=${IDs.orderId}&&itemId=${IDs.itemId}`
      )
      location.reload()
      toast.success("Item successfully returned")
      setIDs({ orderId: "", itemId: "" })
      setShowReturnItemModal(false)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.msg)
        setShowReturnItemModal(false)
      }
    }
  }

  useEffect(() => {
    getOrders()
  }, [])

  useEffect(() => {
    calculateProfit()
  }, [orders, displayedExpenses, date])

  const values = {
    showReturnItemModal,
    setShowReturnItemModal,
    IDs,
    setIDs,
    returnItem,
  }

  return (
    <OrderContext.Provider value={values}>
      <main>
        <div className='flex justify-between'>
          <h1 className='md:text-2xl lg:text-4xl mb-1 mt-5'>Orders</h1>
          <Analysis analysis={analysis} />
        </div>
        <section className='pb-5'>
          <div className='bg-white p-2 rounded-md py-3 shadow'>
            <SearchOrderForm searchOrders={searchOrders} />
          </div>
          <h1 className='mt-5 text-xs md:text-sm lg:text-base'>
            Showing{" "}
            <span className='text-blue-800 font-semibold'>
              {orders.length} Result{orders.length > 1 && "s"}
            </span>{" "}
            for <span className='text-blue-800 font-semibold'>{date}</span>
          </h1>
          {loading ? (
            <Loading />
          ) : (
            <>
              {/* HEADER */}
              {orders.length < 1 ? (
                <h1 className='text-center font-bold'>No orders available</h1>
              ) : (
                <>
                  <div>
                    {orders?.map((order) => {
                      return <SingleOrder key={order._id} {...order} />
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </section>
        {showReturnItemModal && <ReturnItemModal />}
      </main>
    </OrderContext.Provider>
  )
}

export const useOrderContext = () => {
  const context = useContext(OrderContext)
  if (context === undefined)
    throw new Error(
      "useOrderContext must be used within Order Context Provider"
    )
  return context
}

export default AllOrders
