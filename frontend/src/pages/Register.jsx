import React, { useState } from "react";
import { Sidebar } from "../Components/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
// import { registerAdmin } from "../services/api";
import { useDispatch } from "react-redux";
import { registerUserAction } from "../store/actions/userAction";

export const Register = () =>{
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [info, setInfo] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const onSubmit = async (data) => {
        setInfo("");
        setErrorMsg("");
        try{
            const response = await dispatch(registerUserAction(data));
            if(response){
                reset();
                navigate("/");
            }
        }catch (err) {
            console.log(err);
            const message = err?.response?.data?.message || "Registration failed. Please try again.";
            setErrorMsg(message);
        }

       
    }

    return(<>
        <Sidebar showDesktop={false} />
        <div className="relative min-h-screen flex items-center justify-center px-4  ">
            <div className="relative w-full max-w-md p-4">
                <div className="mb-6 text-center">
                    <div className="mx-auto h-12 w-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow">
                        <span className="font-bold">STM</span>
                    </div>
                    <h1 className="mt-3 text-2xl font-semibold text-gray-900">Create your account</h1>
                    <p className="text-sm text-gray-500">Join the Smart Scheduling Platform</p>
                </div>

                <div className="rounded-2xl bg-white/80 backdrop-blur ring-1 ring-black/5 shadow-lg p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                {...register("fullName", { required: "Full name is required." })}
                                className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white"
                                placeholder="Alex Johnson"
                            />
                            {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                {...register("email", {
                                    required: "Email is required.",
                                    pattern: { value: /[^\s@]+@[^\s@]+\.[^\s@]+/, message: "Enter a valid email address." }
                                })}
                                className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white"
                                placeholder="you@example.com"
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone number</label>
                            <input
                                type="tel"
                                {...register("phone", {
                                    required: "Phone number is required.",
                                    minLength: { value: 7, message: "Enter a valid phone number." },
                                    maxLength: { value: 15, message: "Enter a valid phone number." }
                                })}
                                className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white"
                                placeholder="e.g., 9876543210"
                            />
                            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1 relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register("password", {
                                        required: "Password is required.",
                                        minLength: { value: 6, message: "Password must be at least 6 characters." }
                                    })}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.066 7.5a10.523 10.523 0 01-4.143 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .638C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
                            </div>
                        </div>

                        <button type="submit" disabled={isSubmitting} className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                            {isSubmitting ? 'Submitting...' : 'Create account'}
                        </button>
                        {errorMsg && <p className="text-sm text-red-600 text-center">{errorMsg}</p>}
                        {info && <p className="text-sm text-green-600 text-center">{info}</p>}
                    </form>
                    <div className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    </>)
}