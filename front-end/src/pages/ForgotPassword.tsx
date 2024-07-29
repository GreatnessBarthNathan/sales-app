import { FormEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Logo from "../components/Logo"
import FormRow from "../components/FormRow"
import customFetch from "../utils/customFetch"
import { toast } from "react-toastify"
import axios from "axios"

function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting("submitting")
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    try {
      await customFetch.post("/auth/forgot-password", data)
      toast.success("Password changed successfully")
      navigate("/login")
      setIsSubmitting("")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.msg)
        setIsSubmitting("")
      }
    }
  }

  return (
    <div className='pb-[3rem] w-full h-full overflow-auto'>
      <div className='bg-[var(--bgColor)] w-[90%] m-auto mt-[100px] rounded border-t-4 border-[var(--primary)] p-5 shadow-md shadow-slate-300 md:w-[50%] lg:w-[40%]'>
        <Logo container='w-[100px] m-auto mb-2' />
        <h2 className='text-center text-xl mb-10'>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <FormRow type='text' labelText='username' name='userName' required />
          <FormRow
            type='password'
            labelText='password'
            name='password'
            required
          />
          <FormRow
            type='password'
            labelText='confirm password'
            name='confirmPassword'
            required
          />
          <button
            type='submit'
            className={`text-white bg-[var(--primary)] w-full p-2 rounded mt-4 cursor-pointer hover:bg-[var(--hoverColor)] ease-in-out duration-300 ${
              isSubmitting && "bg-[var(--hoverColor)] cursor-wait"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
          <p className='text-center mt-3 mb-3'>
            <Link to='/' className='text-green-600'>
              Home Page
            </Link>
          </p>
          <p className='text-center mt-3 mb-3'>
            <Link to='/login' className='text-green-600'>
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
