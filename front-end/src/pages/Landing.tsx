import { Link } from "react-router-dom"
import Logo from "../components/Logo"

function Landing() {
  return (
    <div className='w-[85%] h-[100dvh] m-auto flex py-5 overflow-auto'>
      {/* left part */}
      <div className='w-full lg:w-[50%]'>
        <Logo container='w-[100px] md:w-[150px]' />
        <div>
          <h1 className='text-2xl lg:text-5xl font-bold text-blue-900 mt-10'>
            Water <span className='text-cyan-500 capitalize'>Tech</span>{" "}
            Solutions
          </h1>

          <p className='mt-5 text-slate-700 leading-7 text-sm md:text-base lg:leading-8'>
            Beloved, if you will consciously keep in sight our sole objective -
            ESTABLISHING THE KINGDOM OF GOD AND ITS CULTURE IN AND AMONGST MEN -
            and meditate pensively on how this can really be possible,
            especially when you think of the target of 6.2 Billion souls, then
            by the Spirit, you find that your mind will regularly be devising
            strategies.
            <p className='mt-5'>- RPN</p>
          </p>
          <div className='mt-10'>
            <Link
              to='/register'
              className='bg-cyan-500 py-2 px-4 rounded text-white text-lg mr-4 hover:bg-cyan-800 ease-in-out duration-300'
            >
              Create Account
            </Link>
            <Link
              to='/login'
              className='bg-cyan-500 py-2 px-4 rounded text-white text-lg hover:bg-cyan-800 ease-in-out duration-300'
            >
              Login
            </Link>
          </div>
        </div>
      </div>
      {/* right part */}
      <div className='hidden lg:block w-[50%]'>
        <div className='w-[75%] m-auto mt-40 '>
          <img src='/landing_img.svg' alt='' />
        </div>
      </div>
    </div>
  )
}

export default Landing
