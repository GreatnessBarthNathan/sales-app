import { useState, FormEvent } from "react"
import { useDashboardContext } from "./DashboardLayout"
import { OrderItemsType, OrderType } from "../utils/types"
import SearchHistoryForm from "../components/SearchHistoryForm"
import Loading from "../components/Loading"
import SingleOrder from "../components/SingleOrder"

function History() {
  const { fetchOrders, products } = useDashboardContext()
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState<OrderType[]>([])
  const [totalSold, setTotalSold] = useState(0)
  const [date, setDate] = useState("")

  // get product name
  const productNames = products.map((product) => product.name)

  // Submit form
  const searchHistory = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const from = new FormData(e.currentTarget).get("from")
    const to = new FormData(e.currentTarget).get("to")
    const product = new FormData(e.currentTarget).get("product")

    if (from === null || to === null || product === null) {
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
    const orders = await fetchOrders()

    // get orders
    const newOrders = orders.filter((order) => {
      let itemName = order.orderItems.find((item) => item.name === product)

      if (
        order.enteredAt >= from &&
        order.enteredAt <= to &&
        itemName?.name === product
      ) {
        return order
      }
      return null
    })
    setOrders(newOrders)

    // total qty sold
    let emptyArray: OrderItemsType[] = []

    newOrders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (item.name === product && !item.returned) {
          emptyArray.push(item)
        }
      })
    })

    let totalSold = emptyArray.reduce((total, item) => {
      total += item.pcs
      return total
    }, 0)
    setTotalSold(totalSold)
    setLoading(false)
  }

  return (
    <main>
      <h1 className='md:text-2xl lg:text-4xl mb-2 lg:mb-5 mt-5'>
        Product Sales History
      </h1>

      <section className='pb-5'>
        <div className='bg-white p-2 rounded-md py-3 shadow'>
          <SearchHistoryForm
            searchHistory={searchHistory}
            productNames={productNames}
          />
        </div>
        {orders.length > 0 && (
          <div className='flex items-center justify-between mt-5 text-[9px] md:text-sm lg:text-base px-2'>
            <h1>
              Appeared in{" "}
              <span className='text-blue-800 font-semibold'>
                {orders.length} Order{orders.length > 1 && "s"}
              </span>{" "}
              for <span className='text-blue-800 font-semibold'>{date}</span>
            </h1>

            <h1 className='text-blue-800 font-bold'>Qty Sold: {totalSold}</h1>
          </div>
        )}
        {loading ? (
          <Loading />
        ) : (
          <>
            {/* HEADER */}
            {orders.length < 1 ? (
              <h1 className='text-center font-semibold mt-10'>
                No orders found. Enter product and date to get history
              </h1>
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
    </main>
  )
}

export default History
