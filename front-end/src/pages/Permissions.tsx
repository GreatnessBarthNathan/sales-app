import { useEffect, useState } from "react"
import { useDashboardContext } from "./DashboardLayout"
import { UserTypes } from "../utils/types"
import SingleUser from "../components/SingleUser"
import Loading from "../components/Loading"

function Permissions() {
  const { fetchUsers } = useDashboardContext()
  const [users, setUsers] = useState<UserTypes[]>([])
  const [loading, setLoading] = useState(false)

  // GET USERS
  const getUsers = async () => {
    setLoading(true)
    const users = await fetchUsers()
    setUsers(users)
    setLoading(false)
  }

  useEffect(() => {
    getUsers()
  }, [])
  return (
    <div>
      <h1 className='md:text-2xl lg:text-4xl mb-5 mt-5 font-bold'>
        User Permissions
      </h1>
      <div className='grid grid-cols-4 border font-bold sticky top-[80px] md:top-[100px] z-10 bg-white'>
        <h2 className='col-span-2 text-[8px] md:text-xs lg:text-base p-2 text-left'>
          Name
        </h2>
        <h2 className='text-[8px] md:text-xs border-l lg:text-base p-2 text-center'>
          Role
        </h2>

        <h2 className='text-[8px] md:text-xs  lg:text-base  border-l text-center p-2'>
          Grant Access
        </h2>
      </div>

      {/* USERS */}
      {loading ? (
        <Loading />
      ) : (
        <div>
          {users.map((user) => {
            return <SingleUser key={user._id} {...user} />
          })}
        </div>
      )}
    </div>
  )
}

export default Permissions
