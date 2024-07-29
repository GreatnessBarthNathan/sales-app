import { useState } from "react"
import { UserTypes } from "../utils/types"
import customFetch from "../utils/customFetch"
import axios from "axios"
import { toast } from "react-toastify"

function SingleUser({ firstName, lastName, role, approved, _id }: UserTypes) {
  const [approve, setApprove] = useState(approved)

  //   HANDLE CHANGE
  const handleChange = async (_id: string) => {
    setApprove(!approve)
    try {
      await customFetch.patch(`/user/approve-user/${_id}`)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.msg)
      }
      return
    }
  }

  return (
    <>
      {role !== "admin" && (
        <div className='grid grid-cols-4 border bg-white'>
          <p className='col-span-2 text-[8px] md:text-sm lg:text-base p-2 capitalize relative'>
            {firstName + " " + lastName}
          </p>
          <p className='text-[8px] md:text-xs lg:text-base p-2 text-center border-l'>
            {role}
          </p>

          <p className='text-[8px] md:text-xs lg:text-base p-2 text-center border-l'>
            <input
              type='checkbox'
              name='permission'
              id='permission'
              checked={approve}
              onChange={() => handleChange(_id as string)}
            />
          </p>
        </div>
      )}
    </>
  )
}

export default SingleUser
