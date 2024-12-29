import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = (props) => {

    const apiUrl = process.env.REACT_APP_URL;

    const [isAuth, setAuth] = useState(false);

    const [user, setUser] = useState(null);

    const [loader, setLoader] = useState(false);
    const [mainLoader, setMainLoader] = useState(true);

    useEffect(() => {
        const refreshAuth = async () => {
            try {
                const originalRefreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(`${apiUrl}/refresh`, {
                    originalRefreshToken: originalRefreshToken,
                });
                if (response.data.status === 'success') {
                    console.log('User Access Granted!');
                    localStorage.setItem('accessToken', response.data.accessToken);
                    localStorage.setItem('refreshToken', response.data.refreshToken);
                    setUser(response.data.user)
                    setAuth(true);
                } else {
                    return ({ success: false, mess: response.data.message });
                }
            } catch (error) {
                console.log('Internal Server Error', error);
                return ({ success: false, mess: 'Internal Server Error!' });
            } finally {
                setMainLoader(false);
            }
        }

        refreshAuth();
    }, [])

    const createAccount = async (values) => {
        setLoader(true);
        try {
            const response = await axios.post(`${apiUrl}/register-user`, {
                fname: values.fname,
                lname: values.lname,
                email: values.sEmail,
                password: values.sPassword,
                confirmPassword: values.confirmPass
            });
            if (response.data.status === 'success') {
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                setUser(response.data.user)
                setAuth(true);
                return ({ success: true, mess: 'Registration Succesfuly!' });
            } else {
                return ({ success: false, mess: response.data.message });
            }
        } catch (error) {
            console.log('Internal Server Error!', error);
            return ({ success: false, mess: 'Internal Server Error!' });
        } finally {
            setLoader(false);
        }
    }

    const loginUser = async (values) => {
        setLoader(true);
        try {
            const response = await axios.post(`${apiUrl}/login-user`, {
                email: values.email,
                password: values.password
            });
            if (response.data.status === 'success') {
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                setUser(response.data.user)
                setAuth(true);
                return ({ success: true, mess: 'Login Succesfuly!' });
            } else {
                return ({ success: false, mess: response.data.message });
            }
        } catch (error) {
            console.log('Internal Server Error', error);
            return ({ success: false, mess: 'Internal Server Error!' });
        } finally {
            setLoader(false);
        }
    }

    const logOutUser = async () => {
        setLoader(true);
        try {
            let refreshToken = localStorage.getItem('refreshToken');
            const response = await axios.post(`${apiUrl}/logout-user`, {
                refreshToken: refreshToken
            });
            if (response.data.status === 'success') {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setUser(null);
                setAuth(false);
                return ({ success: true, mess: 'Logged Out Succesfuly!' });
            } else {
                return ({ success: false, mess: response.data.message });
            }
        } catch (error) {
            console.log('Internal Server Error', error);
            return ({ success: false, mess: 'Internal Server Error!' });
        } finally {
            setLoader(false);
        }
    }

    return (
        <UserContext.Provider value={{
            isAuth,
            setAuth,
            loader,
            createAccount,
            loginUser,
            logOutUser,
            user,
            setUser,
            mainLoader
        }}>
            {props.children}
        </UserContext.Provider>
    );
}

export default UserContext;