import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../actions/userActions';
import { AuthLayout } from '../components';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const dispatch = useDispatch();
  const userLoginReducer = useSelector((state) => state.userLoginReducer);
  const { error, userInfo } = userLoginReducer;
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate('/chat');
    }
  }, [navigate, userInfo, location.pathname]);

  const submitHandler = (e) => {
    e.preventDefault();
    navigate('/chat');
    dispatch(login(email, password));
  };
  return (
    <AuthLayout>
      <form className=' mx-5' onSubmit={submitHandler}>
          <div className='mb-5 mt-10'>
            <label className='block mb-2 text-sm font-medium text-secondary dark:text-gray-300'>Email</label>
            <input
              className='bg-gray-50 dark:bg-gray-700 block border border-gray-300 placeholder-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-tertiary dark:focus:border-blue-500 p-2.5 rounded-lg w-full'
              type='email'
              placeholder='enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='mb-5 mt-10'>
            <label className='block mb-2 text-sm font-medium text-secondary dark:text-gray-300'>Password</label>
            <input
              className='bg-gray-50 dark:bg-gray-700 block border border-gray-300 placeholder-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-tertiary dark:focus:border-blue-500 p-2.5 rounded-lg w-full'
              type='password'
              placeholder='enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type='submit'
            className='text-white focus:ring-blue-800 hover:bg-blue-700 bg-blue-600 text-center px-5 py-2.5 sm:auto rounded-lg'
          >
            Sign In
          </button>
        </form>
        <div className='flex flex-col text-light'>
          <div className='mt-10 text-secondary dark:text-gray-400 text-xl mx-3'>
            Do not have an account?
          </div>
          <div className='flex flex-row-reverse mt-3 mr-3'>
            <Link to='/register'>
              <button className='text-white bg-blue-600 hover:bg-blue-700 text-center rounded-lg p-3 sm:auto'>
                Register
              </button>
            </Link>
          </div>
        </div>
    </AuthLayout>
  )
}

export default Login