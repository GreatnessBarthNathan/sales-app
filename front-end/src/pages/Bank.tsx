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

function Bank() {
  const { fetchBank, currentUser } = useDashboardContext()
  const [bank, setBank] = useState<TransactionType[]>([])
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState("")
  const [totalBank, setTotalBank] = useState(0)
  const [bankBalance, setBankBalance] = useState(0)

  console.log(bank)
  // GET BANK
  const getBank = async () => {
    setLoading(true)
    const today = dayjs(new Date(Date.now())).format("YYYY-MM-DD")
    setDate(
      new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
        new Date(Date.now())
      )
    )

    try {
      const bank = await fetchBank()
      const todayBank = bank.filter(
        (bank: TransactionType) =>
          (bank.enteredAt as string) >= today &&
          (bank.enteredAt as string) <= today
      )
      setBank(todayBank)
      setLoading(false)

      const totals = todayBank.reduce(
        (total, bank) => {
          if (bank.action === "add") total.add += bank.amount
          if (bank.action === "release") total.release += bank.amount
          return total
        },
        { add: 0, release: 0 }
      )

      const bankBalance = totals.add - totals.release
      setTotalBank(bankBalance)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.msg)
        return
      }
    }
  }

  // FILTER BANK
  const searchBank = async (e: FormEvent<HTMLFormElement>) => {
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
    const bank = await fetchBank()
    const newBank = bank.filter(
      (bank: TransactionType) =>
        (bank.enteredAt as string) >= from && (bank.enteredAt as string) <= to
    )

    setBank(newBank)

    const totals = newBank.reduce(
      (total, bank) => {
        if (bank.action === "add") total.add += bank.amount
        if (bank.action === "release") total.release += bank.amount
        return total
      },
      { add: 0, release: 0 }
    )

    const bankBalance = totals.add - totals.release
    bankBalance ? setTotalBank(bankBalance) : setTotalBank(0)
  }

  // CALCULATE BANK BALANCE
  const calculateBalance = async () => {
    const bank = await fetchBank()
    const totals = bank.reduce(
      (total, bank) => {
        if (bank.action === "add") total.add += bank.amount
        if (bank.action === "release") total.release += bank.amount
        return total
      },
      { add: 0, release: 0 }
    )

    const bankBalance = totals.add - totals.release
    setBankBalance(bankBalance)
  }

  useEffect(() => {
    getBank()
    calculateBalance()
  }, [])

  return (
    <main className='w-full p-1 md:p-5 lg:p-10'>
      <div className='text-sm lg:text-3xl mb-5 font-bold flex justify-between'>
        <h1>Bank Records</h1>
        <h1 className={`${currentUser.role !== "admin" && "hidden"}`}>
          Balance:{" "}
          {Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(bankBalance)}
        </h1>
      </div>

      <SearchCashForm searchCash={searchBank} />

      <div className='flex justify-between items-center text-[8px] md:xs lg:text-base bg-[var(--bgColor)] p-1 rounded shadow-sm'>
        <h2>
          Showing{" "}
          <span className='text-blue-800 font-semibold'>
            {bank.length} Result{bank.length > 1 && "s"}
          </span>{" "}
          for <span className='text-blue-800 font-semibold'> {date}</span>
        </h2>

        <Link
          to='/dashboard/record-bank'
          className='bg-[var(--primary)] text-white rounded py-1 px-2 hover:bg-[var(--hoverColor)] ease-in-out duration-300'
        >
          New Record
        </Link>
      </div>
      <h2 className='text-right font-semibold mt-2 text-[var(--textSecondary)] md:text-2xl'>
        {Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
        }).format(totalBank)}
      </h2>
      {loading ? (
        <Loading />
      ) : (
        <>
          {bank.length < 1 ? (
            <h1 className='mt-5'>No record found</h1>
          ) : (
            <div className='mt-3 lg:mt-10'>
              <section className='mt-10'>
                {bank.map((bank) => {
                  return <SingleCashRecord key={bank._id} {...bank} />
                })}
              </section>
            </div>
          )}
        </>
      )}
    </main>
  )
}

export default Bank
