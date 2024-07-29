import { FormEvent } from "react"
import FormRow from "./FormRow"
import { useDashboardContext } from "../pages/DashboardLayout"

function SearchOrderForm({
  searchHistory,
  productNames,
}: {
  searchHistory: (e: FormEvent<HTMLFormElement>) => void
  productNames: string[]
}) {
  const { submitting } = useDashboardContext()
  return (
    <div>
      <form
        onSubmit={searchHistory}
        className='grid md:grid-cols-2 lg:grid-cold-3 gap-4 text-[8px] md:text-base'
      >
        <div className='mt-2'>
          <label className='block text-xs md:text-base'>Select Product</label>
          <select
            name='product'
            id='product'
            className='p-[10px] bg-[whitesmoke] w-full rounded outline-none border mt-1 capitalize text-[8px] md:text-base'
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
        <FormRow
          type='date'
          name='from'
          labelText='from'
          required
          extraStyle='text-[8px] md:text-sm lg:text-base p-1'
        />
        <FormRow
          type='date'
          name='to'
          labelText='to'
          required
          extraStyle='text-[8px] md:text-sm lg:text-base p-1'
        />
        <button
          className={`bg-[var(--primary)] self-end p-[10px] rounded text-white hover:bg-[var(--hoverColor)]  ease-in-out duration-300 ${
            submitting && "cursor-wait"
          }`}
          disabled={submitting}
        >
          {submitting ? "Searching..." : "Search Order"}
        </button>
      </form>
    </div>
  )
}

export default SearchOrderForm
