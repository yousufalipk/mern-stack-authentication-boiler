import './App.css';
import { useUser } from './context/index';

// Components Import
import CustomLoader from './components/Loader/Loader';

import LogInForm from './components/Forms/LoginForm';
import SignUpForm from './components/Forms/SignUpForm';

import LogOutButton from './components/Buttons/LogoutBtn';

function App() {
  const { isAuth, loader, mainLoader } = useUser();

  if (mainLoader) {
    return (
      <div className='relative w-full h-[100vh] flex justify-center items-center bg-purple-300'>
        <div className='absolute z-50 w-full h-full bg-black bg-opacity-30 flex justify-center items-center'>
          <CustomLoader />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='relative w-full h-[100vh]'>
        {/* Loader */}
        {loader && (
          <div className='absolute z-50 w-full h-full bg-black bg-opacity-70 flex justify-center items-center'>
            <CustomLoader />
          </div>
        )}

        {isAuth ? (
          <>
            <div className='w-full h-full flex justify-center items-center bg-purple-300 p-20'>
              <div className='w-1/2 h-1/2 flex justify-center items-center'>
                <LogOutButton />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='w-full h-full flex justify-between items-center bg-purple-300 p-20'>
              {/* Login Comp */}
              <div className='w-1/2 h-full flex flex-col justify-start items-center'>
                <LogInForm />
              </div>
              <div style={{ borderLeft: "2px solid black", height: "500px" }}></div>
              {/* Signup Comp */}
              <div className='w-1/2 h-full flex flex-col justify-start items-center'>
                <SignUpForm />
              </div>
            </div >
          </>
        )}
      </div>
    </>
  );
}

export default App;
