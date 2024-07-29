import { useState, useEffect } from "react"
import { OrderType } from "../utils/types"
import OrderTableHead from "./OrderTableHead"
import OrderFooter from "./OrderFooter"
import customFetch from "../utils/customFetch"
import { useDashboardContext } from "../pages/DashboardLayout"
import { BsArrowReturnLeft } from "react-icons/bs"
import CustomerActivityReturnModal from "./modals/CustomerActivityReturnModal"
import { toast } from "react-toastify"
import axios from "axios"

function SingleCustomerActivity({
  _id,
  total,
  enteredAt,
  orderItems,
  balance,
}: OrderType) {
  const { currentUser } = useDashboardContext()
  const editedDate = new Date(enteredAt)
  const [soldBy, setSoldBy] = useState("")
  const [showMore, setShowMore] = useState(false)
  const [showReturnItemModal, setShowReturnItemModal] = useState(false)
  const [IDs, setIDs] = useState({ orderId: "", itemId: "" })

  const getSoldBy = async () => {
    try {
      const {
        data: { soldBy },
      } = await customFetch.get(`/order/${_id}`)
      setSoldBy(soldBy)
    } catch (error) {
      console.log(error)
    }
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
    getSoldBy()
  }, [])

  return (
    <main>
      <div
        className={`flex justify-between items-center gap-2 mt-2 rounded shadow text-[8px] md:text-base ${
          showMore
            ? "bg-blue-300 text-white font-semibold rounded-none"
            : "bg-white"
        }`}
      >
        <h2 className='p-2 '>
          {new Intl.DateTimeFormat("es").format(editedDate)}
        </h2>
        <h2 className='p-2 '>
          {orderItems.length} Item{orderItems.length > 1 && "s"}
        </h2>
        <h2 className={`p-2 ${showMore && "hidden"}`}>
          Total:{" "}
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(total)}
        </h2>
        <h2 className={`p-2 ${showMore && "hidden"}`}>
          Balance:{" "}
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(balance as number)}
        </h2>
        <button
          className={`p-2 ${
            showMore ? "text-red-700" : "text-blue-500"
          } hover:text-blue-700`}
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "close" : "view"}
        </button>
      </div>

      <section
        className={`${
          showMore
            ? "h-[160px] md:h-[200px] overflow-auto ease-in-out duration-300"
            : "h-0 overflow-auto ease-in-out duration-300"
        } ease-in-out duration-200`}
      >
        <OrderTableHead />

        <div className='bg-white rounded-md shadow-md'>
          {orderItems.map((item) => {
            return (
              <div
                className={`grid grid-cols-10 gap-2 ${
                  item.returned ? "bg-red-100 text-slate-500" : "bg-white"
                }`}
              >
                <h2 className='col-span-3 p-2 capitalize text-[8px] md:text-base'>
                  {item.name}
                </h2>
                <h2 className='p-2 text-[8px] md:text-base'>{item.pcs}</h2>
                <h2 className='col-span-2 p-2 text-[8px] md:text-base'>
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(item.price)}
                </h2>
                <h2 className='col-span-2 p-2 text-[8px] md:text-base'>
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(item.subTotal)}
                </h2>
                <div className='col-span-2 p-2 flex justify-between items-center text-[8px] space-x-1 md:text-base'>
                  <h2>{item.returned ? "true" : "false"}</h2>
                  <button
                    onClick={() => {
                      setShowReturnItemModal(true)
                      setIDs({
                        ...IDs,
                        orderId: _id,
                        itemId: item._id as string,
                      })
                    }}
                  >
                    {currentUser.role === "admin" && <BsArrowReturnLeft />}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <OrderFooter
          soldBy={soldBy}
          total={total}
          balance={balance as number}
          _id={_id}
        />
      </section>

      {showReturnItemModal && (
        <CustomerActivityReturnModal
          returnItem={returnItem}
          setShowReturnItemModal={setShowReturnItemModal}
        />
      )}
    </main>
  )
}

export default SingleCustomerActivity
