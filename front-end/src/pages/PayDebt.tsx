import {
  LoaderFunction,
  LoaderFunctionArgs,
  useLoaderData,
  useParams,
  useNavigate,
} from "react-router-dom"
import customFetch from "../utils/customFetch"
import { OrderType } from "../utils/types"
import { useState, FormEvent } from "react"
import { toast } from "react-toastify"
import axios from "axios"

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  try {
    const {
      data: { order },
    } = await customFetch.get(`/order/${params.id}`)
    return order
  } catch (error) {
    return error
  }
}

function PayDebt() {
  const order = useLoaderData() as OrderType
  const [submitting, setSubmitting] = useState("")
  const [inputs, setInputs] = useState({
    previousDebt: order.balance,
    amountPaid: 0,
    currentDebt: order.balance,
  })
  const navigate = useNavigate()
  const { id } = useParams()

  // HANDLE SUBMIT
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting("submitting")
    try {
      await customFetch.patch(`/order/${id}`, { balance: inputs.currentDebt })
      toast.success("payment added")
      navigate("/dashboard/customers")
      setSubmitting("")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.msg)
        setSubmitting("")
      }
    }
  }

  return (
    <main>
      <h1 className='md:text-2xl lg:text-4xl mb-2 lg:mb-5 font-semibold uppercase'>
        {order.customer.firstName + " " + order.customer.lastName + "'s" + " "}{" "}
        DEBT PAYMENT
      </h1>
      <section className='bg-white px-2 py-5 rounded-md'>
        <form onSubmit={handleSubmit} className='grid gap-2'>
          <div className='w-full mt-3'>
            <label className='capitalize block font-semibold'>
              previous debt
            </label>
            <p
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
            >
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(inputs.previousDebt as number)}
            </p>
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block font-semibold'>
              Amount paid
            </label>
            <input
              type='text'
              name='amount paid'
              required
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  currentDebt:
                    (inputs.previousDebt as number) - Number(e.target.value),
                })
              }
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block font-semibold'>
              current debt
            </label>
            <p
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
            >
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(inputs.currentDebt as number)}
            </p>
          </div>

          <button
            type='submit'
            className={`bg-blue-500 p-2 rounded text-white hover:bg-blue-700 ease-in-out duration-300 self-end
             ${submitting === "submitting" && "cursor-wait"}
            `}
          >
            Pay Debt
          </button>
        </form>
      </section>
    </main>
  )
}

export default PayDebt
