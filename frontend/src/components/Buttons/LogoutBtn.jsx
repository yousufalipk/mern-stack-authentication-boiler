import React from 'react';
import { useUser } from '../../context';
import { toast } from 'react-toastify';

const LogoutBtn = () => {
    const { logOutUser, setAuth, setUser } = useUser();

    const handleLogout = async () => {
        const response = await logOutUser();
        if (response.success) {
            toast.success(response.mess);
            setAuth(false);
            setUser(null);
        } else {
            toast.error(response.mess);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className='w-full bg-purple-600 rounded-lg text-xl font-bold text-center hover:bg-transparent hover:border hover:shadow-lg p-3'
        >
            Logout
        </button>
    );
};

export default LogoutBtn;
