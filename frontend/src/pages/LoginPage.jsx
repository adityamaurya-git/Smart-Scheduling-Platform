import React, { useState } from 'react';
import { Sidebar } from '../Components/Sidebar';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../services/api';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { loginUserAction } from '../store/actions/userAction';

function LoginPage() {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onSubmit = async (data) => {
        setError('');
        try {
           
            const response = await dispatch(loginUserAction(data));
            if(response){
                reset();
                navigate('/');
            }

        } catch (err) {
            setError(err?.response?.data?.message || 'Invalid credentials');
        }
    };

    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Sidebar showDesktop={false} />
            <div className="relative min-h-screen items-center flex justify-center md:pt-14 md:items-start">
                <div className="relative w-full max-w-md ">
                    <div className="mb-6 text-center">
                        <div className="mx-auto h-12 w-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow">
                            <span className="font-bold">STM</span>
                        </div>
                        <h1 className="mt-3 text-2xl font-semibold text-gray-900">Welcome back</h1>
                        <p className="text-sm text-gray-500">Sign in to your admin dashboard</p>
                    </div>

                    <div className="rounded-2xl bg-white/80 backdrop-blur ring-1 ring-black/5 shadow-lg p-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <div className="mt-1 relative">
                                    <input
                                        type="email"
                                        {...register('email', {
                                            required: 'Email is required.',
                                            pattern: { value: /[^\s@]+@[^\s@]+\.[^\s@]+/, message: 'Enter a valid email address.' }
                                        })}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white"
                                        placeholder="you@example.com"
                                    />
                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M1.5 8.67v6.66a3 3 0 0 0 1.2 2.4l7.2 5.1a3 3 0 0 0 3.36 0l7.2-5.1a3 3 0 0 0 1.2-2.4V8.67l-9 6.375a3 3 0 0 1-3.36 0L1.5 8.67Z"/><path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.78 6.93a1.5 1.5 0 0 0 1.74 0l9.48-6.93Z"/></svg>
                                    </span>
                                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <div className="mt-1 relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password', { required: 'Password is required.' })}
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
                                {isSubmitting ? 'Signing in…' : 'Login'}
                            </button>
                            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                        </form>
                        <div className="mt-6 text-center text-sm text-gray-600">
                            Don&apos;t have an account?{' '}
                            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-700">Register</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;