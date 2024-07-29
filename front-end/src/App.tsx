import { createBrowserRouter, RouterProvider } from "react-router-dom"

import HomeLayout from "./pages/HomeLayout"
import DashboardLayout from "./pages/DashboardLayout"
import Landing from "./pages/Landing"
import Register from "./pages/Register"
import Login from "./pages/Login"
import AllProducts from "./pages/AllProducts"
import CreateProduct from "./pages/CreateProduct"
import ForgotPassword from "./pages/ForgotPassword"
import UpdateProduct from "./pages/UpdateProduct"
import Store from "./pages/Store"
import CreateStoreProduct from "./pages/CreateStoreProduct"
import UpdateStoreProduct from "./pages/UpdateStoreProduct"
import AllOrders from "./pages/AllOrders"
import CreateOrder from "./pages/CreateOrder"
import Expenses from "./pages/Expenses"
import AllCustomers from "./pages/AllCustomers"
import CustomerActivity from "./pages/CustomerActivity"
import Permissions from "./pages/Permissions"
import CreateExpense from "./pages/CreateExpense"
import Profile from "./pages/Profile"
import History from "./pages/History"
import PayDebt from "./pages/PayDebt"
import Cash from "./pages/Cash"
import Bank from "./pages/Bank"
import RecordCash from "./pages/RecordCash"
import RecordBank from "./pages/RecordBank"

// loaders
import { loader as dashboardLoader } from "./pages/DashboardLayout"
import { loader as productsLoader } from "./pages/AllProducts"
import { loader as storeLoader } from "./pages/Store"
import { loader as updateProductLoader } from "./pages/UpdateProduct"
import { loader as updateStoreProductLoader } from "./pages/UpdateStoreProduct"
import { loader as createOrderLoader } from "./pages/CreateOrder"
import { loader as customersLoader } from "./pages/AllCustomers"
import { loader as customerActivityLoader } from "./pages/CustomerActivity"
import { loader as payDebtLoader } from "./pages/PayDebt"

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        loader: dashboardLoader,
        children: [
          {
            index: true,
            element: <CreateOrder />,
            loader: createOrderLoader,
          },
          {
            path: "orders",
            element: <AllOrders />,
          },
          {
            path: "create-product",
            element: <CreateProduct />,
          },
          {
            path: "update-product/:id",
            element: <UpdateProduct />,
            loader: updateProductLoader,
          },
          {
            path: "products",
            element: <AllProducts />,
            loader: productsLoader,
          },
          {
            path: "store",
            element: <Store />,
            loader: storeLoader,
          },
          {
            path: "create-store-product",
            element: <CreateStoreProduct />,
          },
          {
            path: "update-store-product/:id",
            element: <UpdateStoreProduct />,
            loader: updateStoreProductLoader,
          },
          {
            path: "customers",
            element: <AllCustomers />,
            loader: customersLoader,
          },
          {
            path: "customer-activity/:id",
            element: <CustomerActivity />,
            loader: customerActivityLoader,
          },
          {
            path: "pay-debt/:id",
            element: <PayDebt />,
            loader: payDebtLoader,
          },
          {
            path: "cash",
            element: <Cash />,
          },
          {
            path: "record-cash",
            element: <RecordCash />,
          },
          {
            path: "bank",
            element: <Bank />,
          },
          {
            path: "record-bank",
            element: <RecordBank />,
          },
          {
            path: "expenses",
            element: <Expenses />,
          },
          {
            path: "create-expense",
            element: <CreateExpense />,
          },
          {
            path: "history",
            element: <History />,
          },
          { path: "permissions", element: <Permissions /> },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "settings",
            element: <h1>Settings</h1>,
          },
        ],
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
