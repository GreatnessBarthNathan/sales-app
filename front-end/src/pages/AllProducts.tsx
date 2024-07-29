import { useState, FormEvent } from "react"
import { useLoaderData } from "react-router-dom"
import customFetch from "../utils/customFetch"
import SearchProductForm from "../components/SearchProductForm"
import SingleProduct from "../components/SingleProduct"
import { WorthType, ProductTypes } from "../utils/types"
import { useDashboardContext } from "./DashboardLayout"

export const loader = async () => {
  try {
    const {
      data: { worth, products },
    } = await customFetch.get("/product")
    return { worth, products }
  } catch (error) {
    console.log(error)
  }
}

type CombinedTypes = {
  worth: WorthType
  products: ProductTypes[]
}

function AllProducts() {
  const { currentUser } = useDashboardContext()
  const { worth, products } = useLoaderData() as CombinedTypes
  const [allProducts, setAllProducts] = useState(products)

  const productNames = products.map((product) => product.name).sort()

  const totalCost = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(worth.totalCost)
  const totalWorth = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(worth.totalWorth)

  // submit search product form
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const select = formData.get("product")

    if (select === "all products") {
      setAllProducts(products)
    } else {
      const product = products.filter((product) => product.name === select)
      setAllProducts(product)
    }
  }

  return (
    <main className='pb-10'>
      <h1 className='md:text-2xl lg:text-4xl mb-1 mt-5'>All Products</h1>
      <section className='bg-white p-2 py-5'>
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
        {/* SEARH FORM */}
        <SearchProductForm list={productNames} handleSubmit={handleSubmit} />
        {/* PRODUCTS SECTION*/}
        <h1 className='mt-5 text-xs md:text-sm lg:text-base'>
          Count: {products.length} products
        </h1>
        {/* HEADER */}
        <div className='grid grid-cols-7 border font-bold sticky top-[80px] md:top-[100px] z-10 bg-white'>
          <h2 className='col-span-2 text-[8px] md:text-xs lg:text-base p-2 text-center'>
            Name
          </h2>
          <h2 className='text-[8px] md:text-xs  lg:text-base border-l text-center p-2'>
            CP
          </h2>
          <h2 className='text-[8px] md:text-xs  lg:text-base  border-l text-center p-2'>
            SP
          </h2>
          <h2 className='text-[8px] md:text-xs  lg:text-base  border-l text-center p-2'>
            Qty
          </h2>
          <h2 className='text-[8px] md:text-xs  lg:text-base  border-l text-center p-2'>
            Cost
          </h2>
          <h2 className='text-[8px] md:text-xs  lg:text-base  border-l text-center p-2'>
            Worth
          </h2>
        </div>
        {/* PRODUCTS */}
        <div>
          {allProducts.map((product) => {
            return <SingleProduct key={product._id} {...product} />
          })}
        </div>
      </section>
    </main>
  )
}

export default AllProducts
