import { useEffect, useState, FormEvent } from "react"
import { Link } from "react-router-dom"
import SingleExpense from "../components/SingleExpense"
import SearchExpenseForm from "../components/SearchExpenseForm"
import { ExpenseType } from "../utils/types"
import dayjs from "dayjs"
import axios from "axios"
import { toast } from "react-toastify"
import Loading from "../components/Loading"
import { useDashboardContext } from "./DashboardLayout"

function Expenses() {
  const { fetchExpenses } = useDashboardContext()
  const [expenses, setExpenses] = useState<ExpenseType[]>([])
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState("")
  const [totalExpenses, setTotalExpenses] = useState(0)

  console.log(expenses)
  // GET EXPENSES
  const getExpenses = async () => {
    setLoading(true)
    const today = dayjs(new Date(Date.now())).format("YYYY-MM-DD")
    setDate(
      new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
        new Date(Date.now())
      )
    )

    try {
      const expenses = await fetchExpenses()
      const todayExpenses = expenses.filter(
        (expense: ExpenseType) =>
          (expense.enteredAt as string) >= today &&
          (expense.enteredAt as string) <= today
      )
      setExpenses(todayExpenses)
      setLoading(false)

      const total = todayExpenses.reduce((total, expense) => {
        total += expense.amount
        return total
      }, 0)
      setTotalExpenses(total)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.msg)
        return
      }
    }
  }

  // FILTER EXPENSES
  const searchExpenses = async (e: FormEvent<HTMLFormElement>) => {
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
    const expenses = await fetchExpenses()
    const newExpenses = expenses.filter(
      (expense: ExpenseType) =>
        (expense.enteredAt as string) >= from &&
        (expense.enteredAt as string) <= to
    )

    setExpenses(newExpenses)

    const total = newExpenses.reduce((total, expense) => {
      total += expense.amount
      return total
    }, 0)
    setTotalExpenses(total)
  }

  useEffect(() => {
    getExpenses()
  }, [])

  return (
    <main className='w-full p-1 md:p-5 lg:p-10'>
      <h1 className='text-sm lg:text-3xl mb-5 font-bold'>Your Epenses</h1>

      <SearchExpenseForm searchExpenses={searchExpenses} />

      <div className='flex justify-between items-center text-[8px] md:xs lg:text-base bg-[var(--bgColor)] p-1 rounded shadow-sm'>
        <h2>
          Showing{" "}
          <span className='text-blue-800 font-semibold'>
            {expenses.length} Result{expenses.length > 1 && "s"}
          </span>{" "}
          for <span className='text-blue-800 font-semibold'> {date}</span>
        </h2>
        <Link
          to='/dashboard/create-expense'
          className='bg-[var(--primary)] text-white rounded py-1 px-2 hover:bg-[var(--hoverColor)] ease-in-out duration-300'
        >
          New Expense
        </Link>
      </div>
      <h2 className='text-right font-semibold mt-2 text-red-600 md:text-2xl'>
        Total:{" "}
        {Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
        }).format(totalExpenses)}
      </h2>
      {loading ? (
        <Loading />
      ) : (
        <>
          {expenses.length < 1 ? (
            <h1 className='mt-5'>No record found</h1>
          ) : (
            <div className='mt-3 lg:mt-10'>
              <section className='mt-10'>
                {expenses.map((expense) => {
                  return <SingleExpense key={expense._id} {...expense} />
                })}
              </section>
            </div>
          )}
        </>
      )}
    </main>
  )
}

export default Expenses
