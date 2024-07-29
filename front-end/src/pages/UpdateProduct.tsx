import { FormEvent, useState, useEffect } from "react"
import customFetch from "../utils/customFetch"
import { toast } from "react-toastify"
import {
  useNavigate,
  useParams,
  useLoaderData,
  LoaderFunction,
  LoaderFunctionArgs,
} from "react-router-dom"
import { ProductTypes } from "../utils/types"
import axios from "axios"

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  try {
    const {
      data: { product },
    } = await customFetch.get(`/product/${params.id}`)
    return product
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error?.response?.data?.msg)
    }
  }
}

function UpdateProduct() {
  const product = useLoaderData() as ProductTypes

  const [targetProduct, setTargetProduct] = useState({
    name: product.name,
    branch: product.branch,
    CP: product.CP,
    SP: product.SP,
    qty: product.qty,
    add: 0,
    newQty: 0,
  })

  const [isSubmitting, setIsSubmitting] = useState("")
  const navigate = useNavigate()
  const { id } = useParams()

  function getNewQty() {
    const newQty = Number(targetProduct.qty) + Number(targetProduct.add)
    setTargetProduct({ ...targetProduct, newQty })
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getNewQty()
    }, 500)
    return () => clearTimeout(timeoutId)
  })

  // submit form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)
    setIsSubmitting("submitting")
    try {
      await customFetch.patch(`/product/${id}`, data)
      toast.success("Product Updated")
      navigate("/dashboard/products")
      setIsSubmitting("")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.msg)
        setIsSubmitting("")
      }
    }
  }

  return (
    <main className='py-5'>
      <h1 className='md:text-2xl lg:text-4xl mb-2 lg:mb-5 font-bold'>
        Update Product
      </h1>
      <section className='bg-[var(--bgColor)] px-2 py-5 rounded-md'>
        <form
          onSubmit={handleSubmit}
          className='grid md:grid-cols-2 lg:grid-cols-3 gap-2'
        >
          <div className='w-full mt-3'>
            <label className='capitalize block'>name</label>
            <input
              type='text'
              name='name'
              required
              value={targetProduct.name}
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
              onChange={(e) =>
                setTargetProduct({ ...targetProduct, name: e.target.value })
              }
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block'>branch</label>
            <input
              type='text'
              name='branch'
              required
              value={targetProduct.branch}
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
              onChange={(e) =>
                setTargetProduct({ ...targetProduct, branch: e.target.value })
              }
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block'>cost price</label>
            <input
              type='number'
              name='CP'
              required
              value={targetProduct.CP}
              min={0}
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
              onChange={(e) =>
                setTargetProduct({
                  ...targetProduct,
                  CP: Number(e.target.value),
                })
              }
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block'>selling price</label>
            <input
              type='number'
              name='SP'
              required
              value={targetProduct.SP}
              min={0}
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
              onChange={(e) =>
                setTargetProduct({
                  ...targetProduct,
                  SP: Number(e.target.value),
                })
              }
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block'>initial qty</label>
            <input
              type='number'
              required
              value={targetProduct.qty}
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
              readOnly
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block'>add</label>
            <input
              type='number'
              required
              value={targetProduct.add}
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
              onChange={(e) =>
                setTargetProduct({
                  ...targetProduct,
                  add: Number(e.target.value),
                })
              }
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block'>new qty</label>
            <input
              type='number'
              name='qty'
              required
              value={targetProduct.newQty}
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
              readOnly
            />
          </div>

          <button
            type='submit'
            className={`bg-[var(--primary)] p-2 rounded text-white hover:bg-[var(--hoverColor)] ease-in-out duration-300 self-end ${
              isSubmitting === "submitting" && "cursor-wait"
            }`}
          >
            Edit Product
          </button>
        </form>
      </section>
    </main>
  )
}

export default UpdateProduct
