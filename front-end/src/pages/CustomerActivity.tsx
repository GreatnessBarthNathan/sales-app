import { useEffect, useState } from "react"

import {
  LoaderFunction,
  LoaderFunctionArgs,
  useLoaderData,
  useParams,
} from "react-router-dom"
import customFetch from "../utils/customFetch"
import { CustomerType, OrderType } from "../utils/types"
import { useDashboardContext } from "./DashboardLayout"
import SingleCustomerActivity from "../components/SingleCustomerActivity"

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  try {
    const {
      data: { customers },
    } = await customFetch.get("/customer")

    const customer = customers.find(
      (customer: CustomerType) => customer.phoneNumber === params.id
    )
    return customer
  } catch (error) {
    return error
  }
}

function CustomerActivity() {
  const customer = useLoaderData() as CustomerType
  const [customerOrders, setCustomerOrders] = useState<OrderType[]>([])
  const [customerDebt, setCustomerDebt] = useState(0)
  const { fetchOrders } = useDashboardContext()
  const { id } = useParams()

  const loadPage = async () => {
    const orders = await fetchOrders()
    const customerOrders = orders.filter(
      (order) => order.customer.phoneNumber === id
    )

    const totalDebt = customerOrders.reduce((total, order) => {
      total += order.balance as number
      return total
    }, 0)
    setCustomerOrders(customerOrders)
    setCustomerDebt(totalDebt)
  }

  useEffect(() => {
    loadPage()
  }, [])
  return (
    <main>
      <h1 className='capitalize text-sm md:text-2xl lg:text-3xl font-bold'>
        {customer.firstName + " " + customer.lastName + "'s"} Orders
      </h1>
      {/* HEADER */}

      <h2 className='mt-5 md:mt-10 text-right text-sm md:text-base font-bold'>
        Total Debt -{" "}
        {new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
        }).format(customerDebt)}
      </h2>

      {customerOrders.length < 1 ? (
        <h1 className='text-center font-bold mt-5'>No activities</h1>
      ) : (
        <>
          {customerOrders.map((order) => (
            <SingleCustomerActivity key={order._id} {...order} />
          ))}
        </>
      )}
    </main>
  )
}

export default CustomerActivity
