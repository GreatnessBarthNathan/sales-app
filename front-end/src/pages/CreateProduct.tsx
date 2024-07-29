import { FormEvent, useState } from "react"
import FormRow from "../components/FormRow"
import customFetch from "../utils/customFetch"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function CreateProduct() {
  const [isSubmitting, setIsSubmitting] = useState("")
  const navigate = useNavigate()

  // submit form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)
    setIsSubmitting("submitting")
    try {
      await customFetch.post("/product", data)
      toast.success("Product created")
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
        Create Product
      </h1>
      <section className='bg-white px-2 py-5 rounded-md shadow'>
        <form
          onSubmit={handleSubmit}
          className='grid md:grid-cols-2 lg:grid-cols-3 gap-2'
        >
          <FormRow type='text' labelText='name' name='name' required />
          <FormRow type='text' labelText='branch' name='branch' required />
          <FormRow type='number' labelText='quantity' name='qty' required />
          <FormRow type='number' labelText='cost price' name='CP' required />
          <FormRow type='number' labelText='selling price' name='SP' required />
          <FormRow type='number' labelText='store' name='store' required />
          <button
            type='submit'
            className={`bg-[var(--primary)] p-3 rounded text-white hover:bg-[var(--hoverColor)] ease-in-out duration-300 self-end ${
              isSubmitting === "submitting" && "cursor-wait"
            }`}
          >
            Create Product
          </button>
        </form>
      </section>
    </main>
  )
}

export default CreateProduct
