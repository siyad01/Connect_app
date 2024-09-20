import {Link} from 'react-router-dom';

const Home = () => {


  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white p-12 rounded-lg shadow-lg w-full max-w-xl">
        <div className='flex justify-center mb-7' >
                    <img 
                        src='/images/logo.svg'
                        alt='Connect'
                        className='h-16 shadow-sm w-16'
                    />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-700 mb-8 text-center leading-relaxed">
          Welcome to <span className='bg-[#FFA904] text-white shadow-7xl p-1 rounded-lg '>Connect</span>: Your Professional Network Awaits
        </h1>
        <div className="mb-4">
          <button className="w-full py-2 border border-gray-300 rounded-lg hover:bg-[#FFA904] text-gray-700  hover:text-white">
            <Link to="/login">
              <span className="font-medium">Sign in with email</span>
            </Link>
          </button>
        </div>

        <p className="text-gray-700 text-center text-sm">
          By clicking Continue to join or sign in, you agree to Connect's{" "}
          <a href="#" className="text-[#FFA904]">
            User Agreement
          </a>
          ,{" "}
          <a href="#" className="text-[#FFA904]">
            Privacy Policy
          </a>
          , and{" "}
          <a href="#" className="text-[#FFA904]">
            Cookie Policy
          </a>
          .
        </p>
        <p className="text-center mt-8 text-gray-700">
          New to Connect?{" "}
          <Link to="/register" className=" text-gray-700 hover:text-[#FFA904] font-bold">
            Join now
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Home;