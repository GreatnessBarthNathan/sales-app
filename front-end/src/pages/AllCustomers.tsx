import { useState, FormEvent } from "react"
import customFetch from "../utils/customFetch"
import { useLoaderData } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { CustomerType } from "../utils/types"
import SingleCustomer from "../components/SingleCustomer"
import FormRow from "../components/FormRow"

export const loader = async () => {
  try {
    const {
      data: { customers },
    } = await customFetch.get("/customer")
    return customers
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return toast.error(error?.response?.data?.msg)
    }
  }
}

function AllCustomers() {
  const [isSubmitting, setIsSubmitting] = useState("")
  const customers = useLoaderData() as CustomerType[]

  // submit form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)
    setIsSubmitting("submitting")
    try {
      await customFetch.post("/customer", data)
      toast.success("customer added")
      location.reload()
      setIsSubmitting("")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.msg)
        setIsSubmitting("")
      }
    }
  }
  return (
    <main>
      <h1 className='md:text-2xl lg:text-4xl mb-1 mt-5 font-bold'>Customers</h1>
      <section className='pb-5'>
        <div className='bg-white py-2 px-1 rounded text-[8px] md:text-xs lg:text-base'>
          <form
            onSubmit={handleSubmit}
            className='grid md:grid-cols-2 lg:grid-cols-4 gap-2'
          >
            <FormRow
              type='text'
              labelText='first name'
              name='firstName'
              required
            />
            <FormRow
              type='text'
              labelText='last name'
              name='lastName'
              required
            />
            <FormRow
              type='tel'
              labelText='phone number'
              name='phoneNumber'
              maxLength={11}
              minLength={11}
              required
            />

            <button
              type='submit'
              className={`bg-[var(--primary)] p-[10px] rounded text-white hover:bg-[var(--hoverColor)] ease-in-out duration-300 self-end ${
                isSubmitting === "submitting" && "cursor-wait"
              }`}
            >
              Add Customer
            </button>
          </form>
        </div>
        <h1 className='mt-5 text-xs md:text-sm lg:text-base'>
          You have {customers.length} customers
        </h1>

        {/* HEADER */}
        {customers.length < 1 ? (
          <h1 className='text-center font-bold'>No customers found</h1>
        ) : (
          <>
            <div className='mt-2 grid grid-cols-7 sticky top-0 border border-white border-b-slate-600 border-t-slate-600 p-1 md:p-2 font-bold bg-white '>
              <h2 className='col-span-2 text-[8px] md:text-xs lg:text-base p-1 md:p-2 text-left'>
                First Name
              </h2>
              <h2 className='col-span-2 text-[8px] md:text-xs lg:text-base text-left p-1 md:p-2'>
                Last Name
              </h2>
              <h2 className='col-span-2 text-[8px] md:text-xs lg:text-base text-left p-1 md:p-2'>
                Phone Number
              </h2>
            </div>
            {/* PRODUCTS */}

            <div>
              {customers.map((customer) => {
                return <SingleCustomer key={customer._id} {...customer} />
              })}
            </div>
          </>
        )}
      </section>
    </main>
  )
}

export default AllCustomers
