function ReturnItemModal({
  returnItem,
  setShowReturnItemModal,
}: {
  returnItem: () => void
  setShowReturnItemModal: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <main className='blured-bg fixed top-0 left-0 flex justify-center items-center w-full h-full z-10'>
      <div className='bg-[whitesmoke] rounded shadow-md shadow-[var(--primary)] w-[300px] lg:w-[500px] p-3'>
        <p className='text-center'>
          This action cannot be reversed. Do you wish to proceed to return this
          item?
        </p>

        <div className='flex justify-center space-x-4 mt-4'>
          <button
            className='bg-[var(--primary)] py-1 px-2 text-white rounded hover:bg-[var(--hoverColor)]'
            onClick={() => returnItem()}
          >
            Proceed
          </button>
          <button
            className='bg-[var(--primary)] py-1 px-2 text-white rounded hover:bg-[var(--hoverColor)]'
            onClick={() => setShowReturnItemModal(false)}
          >
            Decline
          </button>
        </div>
      </div>
    </main>
  )
}

export default ReturnItemModal
