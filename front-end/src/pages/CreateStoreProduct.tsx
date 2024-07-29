import { FormEvent, useState } from "react"
import FormRow from "../components/FormRow"
import customFetch from "../utils/customFetch"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useDashboardContext } from "./DashboardLayout"

function CreateStoreProduct() {
  const { allProducts } = useDashboardContext()
  const [isSubmitting, setIsSubmitting] = useState("")
  const navigate = useNavigate()

  const productNames = allProducts.map((product) => product.name).sort()

  // submit form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)
    setIsSubmitting("submitting")
    try {
      await customFetch.post("/store", data)
      toast.success("store product created")
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
        New Store Product
      </h1>
      <section className='bg-[var(--bgColor)] px-2 py-5 rounded-md'>
        <form
          onSubmit={handleSubmit}
          className='grid md:grid-cols-2 lg:grid-cols-3 gap-2'
        >
          <div className='text-xs md:text-base'>
            <label className='block'>Search Product</label>
            <select
              name='name'
              id='name'
              className='p-2 md:p-2 bg-[whitesmoke] w-full rounded outline-none border mt-3 capitalize'
            >
              {productNames.map((optionValue: string) => {
                return (
                  <option key={optionValue} value={optionValue}>
                    {optionValue}
                  </option>
                )
              })}
            </select>
          </div>
          <FormRow type='number' labelText='quantity' name='store' required />
          <button
            type='submit'
            className={`bg-[var(--primary)] p-2 rounded text-white hover:bg-[var(--hoverColor)] ease-in-out duration-300 self-end ${
              isSubmitting === "submitting" && "cursor-wait"
            }`}
          >
            Add To Store
          </button>
        </form>
      </section>
    </main>
  )
}

export default CreateStoreProduct
