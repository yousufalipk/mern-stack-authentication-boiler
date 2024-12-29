import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/index';
import { toast } from 'react-toastify';

const SignUpForm = () => {
    const { createAccount } = useUser();
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        sEmail: '',
        sPassword: '',
        confirmPass: '',
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fname.trim()) newErrors.fname = 'First name is required.';
        if (!formData.lname.trim()) newErrors.lname = 'Last name is required.';
        if (!formData.sEmail.trim() || !/\S+@\S+\.\S+/.test(formData.sEmail)) {
            newErrors.sEmail = 'A valid email is required.';
        }
        if (!formData.sPassword || formData.sPassword.length < 6) {
            newErrors.sPassword = 'Password must be at least 6 characters.';
        }
        if (formData.sPassword !== formData.confirmPass) {
            newErrors.confirmPass = 'Passwords do not match.';
        }
        return newErrors;
    };

    const handleSignUp = async () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        const response = await createAccount(formData);
        if (response.success) {
            toast.success(response.mess);
        } else {
            toast.error(response.mess);
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-start items-center p-5">
            <h1 className="text-3xl font-bold mb-5">Sign Up</h1>
            <form
                className="w-1/2 flex flex-col gap-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSignUp();
                }}
            >
                <input
                    type="text"
                    name="fname"
                    placeholder="First Name"
                    value={formData.fname}
                    onChange={handleChange}
                    className="border rounded-lg p-3 text-black"
                />
                {errors.fname && <p className="text-red-600 text-sm">{errors.fname}</p>}

                <input
                    type="text"
                    name="lname"
                    placeholder="Last Name"
                    value={formData.lname}
                    onChange={handleChange}
                    className="border rounded-lg p-3 text-black"
                />
                {errors.lname && <p className="text-red-600 text-sm">{errors.lname}</p>}

                <input
                    type="email"
                    name="sEmail"
                    placeholder="Email"
                    value={formData.sEmail}
                    onChange={handleChange}
                    className="border rounded-lg p-3 text-black"
                />
                {errors.sEmail && <p className="text-red-600 text-sm">{errors.sEmail}</p>}

                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="sPassword"
                        placeholder="Password"
                        value={formData.sPassword}
                        onChange={handleChange}
                        className="border rounded-lg p-3 text-black w-full"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-500"
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>
                {errors.sPassword && <p className="text-red-600 text-sm">{errors.sPassword}</p>}

                <div className="relative">
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPass"
                        placeholder="Confirm Password"
                        value={formData.confirmPass}
                        onChange={handleChange}
                        className="border rounded-lg p-3 text-black w-full"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-500"
                    >
                        {showConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                </div>
                {errors.confirmPass && <p className="text-red-600 text-sm">{errors.confirmPass}</p>}

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

export default SignUpForm;
