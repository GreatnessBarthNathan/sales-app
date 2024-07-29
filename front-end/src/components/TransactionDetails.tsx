import { useCreateOrderContext } from "../pages/CreateOrder"

function TransactionDetails() {
  const {
    total,
    // cash,
    // bank,
    transaction,
    balance,
    setCash,
    setBank,
    findCustomer,
    customerName,
    setTransaction,
  } = useCreateOrderContext()
  return (
    <>
      {/* CASH & CREDIT SELECT */}
      <div className='text-[8px] md:text-xs lg:text-base'>
        <select
          name='transaction'
          id='transaction'
          className='w-full p-1'
          onChange={(e) => setTransaction(e.target.value)}
        >
          <option value='cash'>Cash</option>
          <option value='credit'>Credit</option>
        </select>
      </div>

      {/* CUSTOMERS */}
      <div className='text-[8px] md:text-xs lg:text-base grid grid-rows-2 gap-1'>
        <input
          type='tel'
          maxLength={11}
          placeholder='customer phone number'
          className='w-full p-1 '
          onChange={findCustomer}
        />
        <input
          type='text'
          className='w-full p-1'
          value={customerName}
          readOnly
        />
      </div>

      {/* TOTAL, CASH, BANK & BALANCE */}
      <div className='text-[8px] md:text-xs lg:text-base font-bold p-1 bg-white'>
        {/* TOTAL */}
        <div className='grid grid-cols-2'>
          <span>TOTAL</span>
          <span>
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            }).format(total)}
          </span>
        </div>
        {/* CASH */}
        <div className='grid grid-cols-2'>
          <span>Cash</span>
          <input
            type='number'
            name='cash'
            min={0}
            // value={cash}
            onChange={(e) => setCash(Number(e.target.value))}
            className='border outline-none'
          />
        </div>
        {/* BANK */}
        <div className='grid grid-cols-2'>
          <span>Bank</span>
          <input
            type='number'
            name='bank'
            min={0}
            // value={bank}
            onChange={(e) => setBank(Number(e.target.value))}
            className='border outline-none'
          />
        </div>
        <div
          className={`${
            transaction === "cash" ? "hidden" : "block"
          } mt-1 bg-white`}
        >
          {/* BALANCE*/}
          <div className='grid grid-cols-2'>
            <h2>Balance</h2>
            <span>
              {" "}
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(balance)}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default TransactionDetails
