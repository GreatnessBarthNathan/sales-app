import { useCreateOrderContext } from "../pages/CreateOrder"

function SearchOrderProduct() {
  const { submitSearchOrderProduct, productNames } = useCreateOrderContext()

  return (
    <form
      className='grid grid-cols-3 w-full gap-1'
      onSubmit={submitSearchOrderProduct}
    >
      <div className='col-span-2'>
        <label className='block text-xs md:text-base'>Select Product</label>
        <select
          name='product'
          id='product'
          className='p-2 md:p-3 bg-[whitesmoke] w-full rounded outline-none border mt-1 capitalize text-[8px] md:text-base'
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

      <button
        type='submit'
        className='text-[8px] md:text-base bg-[var(--primary)] text-white p-[10px] md:p-3 rounded cursor-pointer  hover:bg-[var(--hoverColor)] col-span-1 self-end'
      >
        Submit
      </button>
    </form>
  )
}

export default SearchOrderProduct
