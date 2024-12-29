import React, { useState } from 'react';
import { useUser } from '../../context';
import { toast } from 'react-toastify';

const LoginForm = () => {
    const { loginUser } = useUser();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'A valid email is required.';
        }
        if (!formData.password || formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
        }
        return newErrors;
    };

    const handleLogin = async () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        const response = await loginUser(formData);
        if (response.success) {
            toast.success(response.mess);
        } else {
            toast.error(response.mess);
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-start items-center p-5">
            <h1 className="text-3xl font-bold mb-5">Login Page</h1>
            <form
                className="w-1/2 flex flex-col gap-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                }}
            >
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border rounded-lg p-3 text-black"
                />
                {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border rounded-lg p-3 text-black"
                />
                {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}

                <button
                    type="submit"
                    className="w-full bg-purple-600 rounded-lg text-xl font-bold text-center hover:bg-transparent hover:border hover:shadow-lg p-3"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
