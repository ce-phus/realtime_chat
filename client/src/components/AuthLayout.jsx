
import { image } from '../assets';

const AuthLayout = ({ children }) => {
  return (
    <div className='flex pt-20 min-h-screen container mx-auto pb-20'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 border md:border-gray-300 border-transparent dark:border-transparent dark:border-gray-700 shadow-lg rounded-lg w-full'>
        <div className='w-full hidden md:block '>
          <img src={image} className='rounded-t-lg w-full h-full'/>
        </div>
        <div>
          <img src='./logoname.png' className='p-5 w-[250px]'/>
          <div className=''>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
