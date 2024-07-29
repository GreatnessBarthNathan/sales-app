import { FormEvent, useState } from "react"
import { Link, useLoaderData, redirect } from "react-router-dom"
import SearchStoreForm from "../components/SearchStoreForm"
import SingleStoreProduct from "../components/SingleStoreProduct"
import { WorthType, ProductTypes } from "../utils/types"
import axios from "axios"
import { toast } from "react-toastify"

import customFetch from "../utils/customFetch"
import { useDashboardContext } from "./DashboardLayout"

export const loader = async () => {
  try {
    const {
      data: { storeWorth: worth, products },
    } = await customFetch.get("/store")
    return { worth, products }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error?.response?.data?.msg)
      return redirect("/dashboard")
    }
  }
}

type CombinedTypes = {
  worth: WorthType
  products: ProductTypes[]
}

function Store() {
  const { worth, products } = useLoaderData() as CombinedTypes
  const { currentUser } = useDashboardContext()
  const [allStoreProducts, setAllStoreProducts] = useState(products)

  const productNames = products.map((product) => product.name).sort()

  const totalCost = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(worth.totalCost)
  const totalWorth = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(worth.totalWorth)

  // submit search form
  const submitStoreForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const select = formData.get("product")

    if (select === "all products") {
      setAllStoreProducts(products)
    } else {
      const product = products.filter((product) => product.name === select)
      setAllStoreProducts(product)
    }
  }

  return (
    <main>
      <h1 className='md:text-2xl lg:text-4xl mb-1 mt-5'>Store</h1>
      <section className='bg-[var(--bgColor)] p-2 py-5'>
        {/* WORTH */}
        {currentUser.role === "admin" && (
          <div className='text-right text-xs md:text-base'>
            <h2 className='text-[8px] md:text-xs lg:text-base'>
              Total Cost - {totalCost}
            </h2>
            <h2 className='text-[8px] md:text-xs lg:text-base'>
              Total Worth - {totalWorth}
            </h2>
          </div>
        )}
        <div className='text-right mt-1'>
          <Link
            to='/dashboard/create-store-product'
            className='text-white bg-green-700 py-1 px-3 rounded text-xs md:text-base hover:bg-green-900 ease-in-out duration-300'
          >
            Add New
          </Link>
        </div>
        {/* SEARH FORM */}
        <SearchStoreForm
          list={productNames}
          submitStoreForm={submitStoreForm}
        />
        {/* PRODUCTS SECTION*/}
        <h1 className='mt-5 text-xs md:text-sm lg:text-base'>
          Count: {allStoreProducts.length} products
        </h1>
        {/* HEADER */}
        <div className='grid grid-cols-7 border font-bold sticky top-[80px] md:top-[100px] bg-white z-10'>
          <h2 className='col-span-2 text-[8px] md:text-xs lg:text-base p-2 text-center'>
            Name
          </h2>
          <h2 className='text-[8px] md:text-xs lg:text-base border-l text-center p-2'>
            CP
          </h2>
          <h2 className='text-[8px] md:text-xs lg:text-base  border-l text-center p-2'>
            SP
          </h2>
          <h2 className='text-[8px] md:text-xs lg:text-base  border-l text-center p-2'>
            Qty
          </h2>
          <h2 className='text-[8px] md:text-xs lg:text-base  border-l text-center p-2'>
            Cost
          </h2>
          <h2 className='text-[8px] md:text-xs lg:text-base  border-l text-center p-2'>
            Worth
          </h2>
        </div>
        {/* PRODUCTS */}
        <div>
          {allStoreProducts.map((product) => {
            return <SingleStoreProduct key={product._id} {...product} />
          })}
        </div>
      </section>
    </main>
  )
}

export default Store
