import {useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import { UserData } from '../context/userContext';
import { LoadingAnimation } from '../components/Loading';



const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const {loginUser, btnLoading} = UserData();



    const submitHandler = (e) => {
        e.preventDefault();
        loginUser(email, password, navigate);
    };

    return(
        <div className='min-h-screen flex items-center justify-center bg-gray-100'>
            <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
                <div className='flex justify-center mb-4' >
                    <img 
                        src='/images/logo.svg'
                        alt='Connect'
                        className='h-16'
                    />
                </div>
                <h2 className='text-2xl font-semibold text-center mb-6'>Login to <span className=' text-white bg-[#FFA904] p-1 rounded-md shadow-7xl text-md font-bold'>Connect</span></h2>
                <form onSubmit={submitHandler} >
                    <div className='mb-4'>
                        <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email</label>
                        <input type='email' id='email' className='common-input' value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='password' className='block text-sm font-medium text-gray-700'>Password</label>
                        <input type='password' id='password' className='common-input' value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>

                    <button type="submit" className='common-btn mt-1' disabled={btnLoading}>
                        {btnLoading?<LoadingAnimation />:"Log in"}</button>
                </form>

                <div className='mt-6 text-center'>
                    <div className='relative mb-4'>
                        <div className='absolute inset-0 flex items-center'>
                            <div className='w-full border-t border-gray-300'></div>
                        </div>
                        <div className='relative flex justify-center text-sm'>
                            <span className='bg-white px-2 to-gray-500'>or</span>
                        </div>
                    </div>

                    <div className='mt-4 text-center text-sm'>
                        <span >Not on Connect yet? <Link to="/register" className="font-medium hover:underline hover:text-[#FFA904]">Register</Link></span>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Login;