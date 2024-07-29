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
import axios from "axios"
import { ProductTypes } from "../utils/types"

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

function UpdateStoreProduct() {
  const product = useLoaderData() as ProductTypes
  const [storeProduct, setStoreProduct] = useState({
    name: product.name,
    branch: product.branch,
    CP: product.CP,
    SP: product.SP,
    qty: product.store,
    add: 0,
    release: 0,
    newQty: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState("")
  const navigate = useNavigate()
  const { id } = useParams()

  function getNewQty() {
    const newQty =
      Number(storeProduct.qty) +
      Number(storeProduct.add) -
      Number(storeProduct.release)
    setStoreProduct({ ...storeProduct, newQty })
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
      await customFetch.patch(`/store/${id}`, data)
      toast.success("Store Product Updated")
      navigate("/dashboard/store")
      setIsSubmitting("")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.msg)
        navigate("/dashboard/store")
        setIsSubmitting("")
      }
    }
  }

  return (
    <main className='py-5'>
      <h1 className='md:text-2xl lg:text-4xl mb-2 lg:mb-5 font-bold'>
        Edit Store Product
      </h1>
      <section className='bg-white px-2 py-5 rounded-md'>
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
              value={storeProduct.name}
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
              onChange={(e) =>
                setStoreProduct({ ...storeProduct, name: e.target.value })
              }
              readOnly
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block'>branch</label>
            <input
              type='text'
              name='branch'
              required
              value={storeProduct.branch}
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
              onChange={(e) =>
                setStoreProduct({ ...storeProduct, branch: e.target.value })
              }
              readOnly
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block'>cost price</label>
            <input
              type='number'
              name='CP'
              required
              value={storeProduct.CP}
              readOnly
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
              onChange={(e) =>
                setStoreProduct({ ...storeProduct, CP: Number(e.target.value) })
              }
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block'>selling price</label>
            <input
              type='number'
              name='SP'
              required
              value={storeProduct.SP}
              readOnly
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
              onChange={(e) =>
                setStoreProduct({ ...storeProduct, SP: Number(e.target.value) })
              }
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block'>initial qty</label>
            <input
              type='number'
              required
              value={storeProduct.qty}
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
              readOnly
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block'>add</label>
            <input
              type='number'
              required
              value={storeProduct.add}
              min={0}
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
              onChange={(e) =>
                setStoreProduct({
                  ...storeProduct,
                  add: Number(e.target.value),
                })
              }
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block'>release</label>
            <input
              type='number'
              name='release'
              required
              value={storeProduct.release}
              min={0}
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
              onChange={(e) =>
                setStoreProduct({
                  ...storeProduct,
                  release: Number(e.target.value),
                })
              }
            />
          </div>
          <div className='w-full mt-3'>
            <label className='capitalize block'>new qty</label>
            <input
              type='number'
              name='store'
              required
              value={storeProduct.newQty}
              className={`border capitalize border-blue-200 w-full rounded p-2 mt-1 outline-0`}
              readOnly
            />
          </div>

          <button
            type='submit'
            className={`bg-blue-500 p-2 rounded text-white hover:bg-blue-700 ease-in-out duration-300 self-end ${
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

export default UpdateStoreProduct
