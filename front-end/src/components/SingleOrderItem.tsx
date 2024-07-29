import { OrderItemsType } from "../utils/types"
import { BsArrowReturnLeft } from "react-icons/bs"
import { useDashboardContext } from "../pages/DashboardLayout"
import { useOrderContext } from "../pages/AllOrders"


function SingleOrderItem({
  name,
  price,
  pcs,
  subTotal,
  returned,
  orderId,
  _id,
}: OrderItemsType) {
  const { currentUser } = useDashboardContext()
  const { setShowReturnItemModal, setIDs, IDs } = useOrderContext()

  
  return (
    <div
      className={`grid grid-cols-10 gap-2 ${
        returned ? "bg-red-100 text-slate-500" : "bg-white"
      }`}
    >
      <h2 className='col-span-3 p-2 capitalize text-[8px] md:text-base'>
        {name}
      </h2>
      <h2 className='p-2 text-[8px] md:text-base'>{pcs}</h2>
      <h2 className='col-span-2 p-2 text-[8px] md:text-base'>
        {new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
        }).format(price)}
      </h2>
      <h2 className='col-span-2 p-2 text-[8px] md:text-base'>
        {new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
        }).format(subTotal)}
      </h2>
      <div className='col-span-2 p-2 flex justify-between items-center text-[8px] space-x-1 md:text-base'>
        <h2>{returned ? "true" : "false"}</h2>
        <button
          onClick={() => {
            setShowReturnItemModal(true)
            setIDs({
              ...IDs,
              orderId: String(orderId),
              itemId: _id as string,
            })
          }}
        >
          {currentUser.role === "admin" && <BsArrowReturnLeft />}
        </button>
      </div>
    </div>
  )
}

export default SingleOrderItem
