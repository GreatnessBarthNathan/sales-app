import { useEffect, useState, FormEvent } from "react"
import { Link } from "react-router-dom"
import SearchCashForm from "../components/SearchCashForm"
import { TransactionType } from "../utils/types"
import dayjs from "dayjs"
import axios from "axios"
import { toast } from "react-toastify"
import Loading from "../components/Loading"
import { useDashboardContext } from "./DashboardLayout"
import SingleCashRecord from "../components/SingleCashRecord"

function Cash() {
  const { fetchCash, currentUser } = useDashboardContext()
  const [cash, setCash] = useState<TransactionType[]>([])
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState("")
  const [totalCash, setTotalCash] = useState(0)
  const [cashBalance, setCashBalance] = useState(0)

  // GET CASH
  const getCash = async () => {
    setLoading(true)
    const today = dayjs(new Date(Date.now())).format("YYYY-MM-DD")
    setDate(
      new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
        new Date(Date.now())
      )
    )

    try {
      const cash = await fetchCash()
      const todayCash = cash.filter(
        (cash: TransactionType) =>
          (cash.enteredAt as string) >= today &&
          (cash.enteredAt as string) <= today
      )
      setCash(todayCash)
      setLoading(false)

      const totals = todayCash.reduce(
        (total, cash) => {
          if (cash.action === "add") total.add += cash.amount
          if (cash.action === "release") total.release += cash.amount
          return total
        },
        { add: 0, release: 0 }
      )

      const cashBalance = totals.add - totals.release
      setTotalCash(cashBalance)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.msg)
        return
      }
    }
  }

  // FILTER CASH
  const searchCash = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const from = new FormData(e.currentTarget).get("from")
    const to = new FormData(e.currentTarget).get("to")

    if (from === null || to === null) {
      console.error("Date range is not specified")
      return
    }
    const newFrom = new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
    }).format(new Date(from as string))
    const newTo = new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
    }).format(new Date(to as string))

    setDate(`${newFrom} - ${newTo}`)
    const cash = await fetchCash()
    const newCash = cash.filter(
      (cash: TransactionType) =>
        (cash.enteredAt as string) >= from && (cash.enteredAt as string) <= to
    )

    setCash(newCash)

    const totals = newCash.reduce(
      (total, cash) => {
        if (cash.action === "add") total.add += cash.amount
        if (cash.action === "release") total.release += cash.amount
        return total
      },
      { add: 0, release: 0 }
    )

    const cashBalance = totals.add - totals.release
    cashBalance ? setTotalCash(cashBalance) : setTotalCash(0)
  }

  // CALCULATE CASH BALANCE
  const calculateBalance = async () => {
    const cash = await fetchCash()
    const totals = cash.reduce(
      (total, cash) => {
        if (cash.action === "add") total.add += cash.amount
        if (cash.action === "release") total.release += cash.amount
        return total
      },
      { add: 0, release: 0 }
    )

    const cashBalance = totals.add - totals.release
    setCashBalance(cashBalance)
  }

  useEffect(() => {
    getCash()
    calculateBalance()
  }, [])

  return (
    <main className='w-full p-1 md:p-5 lg:p-10'>
      <div className='text-sm lg:text-3xl mb-5 font-bold flex justify-between'>
        <h1>Cash Records</h1>
        <h1 className={`${currentUser.role !== "admin" && "hidden"}`}>
          Balance:{" "}
          {Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(cashBalance)}
        </h1>
      </div>

      <SearchCashForm searchCash={searchCash} />

      <div className='flex justify-between items-center text-[8px] md:xs lg:text-base bg-[var(--bgColor)] p-1 rounded shadow-sm'>
        <h2>
          Showing{" "}
          <span className='text-blue-800 font-semibold'>
            {cash.length} Result{cash.length > 1 && "s"}
          </span>{" "}
          for <span className='text-blue-800 font-semibold'> {date}</span>
        </h2>

        <Link
          to='/dashboard/record-cash'
          className='bg-[var(--primary)] text-white rounded py-1 px-2 hover:bg-[var(--hoverColor)] ease-in-out duration-300'
        >
          New Record
        </Link>
      </div>
      <h2 className='text-right font-semibold mt-2 text-[var(--textSecondary)] md:text-2xl'>
        {Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
        }).format(totalCash)}
      </h2>
      {loading ? (
        <Loading />
      ) : (
        <>
          {cash.length < 1 ? (
            <h1 className='mt-5'>No record found</h1>
          ) : (
            <div className='mt-3 lg:mt-10'>
              <section className='mt-10'>
                {cash.map((cash) => {
                  return <SingleCashRecord key={cash._id} {...cash} />
                })}
              </section>
            </div>
          )}
        </>
      )}
    </main>
  )
}

export default Cash
