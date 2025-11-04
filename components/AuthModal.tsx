import React, { useState } from 'react';
import { LogoIcon, UserIcon, LockClosedIcon, EyeIcon, EyeOffIcon } from './icons';

interface SignupScreenProps {
  onSuccess: () => void;
  onNavigateToLogin: () => void;
}

const AuthModal: React.FC<SignupScreenProps> = ({ onSuccess, onNavigateToLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call for signup
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex font-sans animate-fade-in">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-800 relative p-12 text-white flex-col justify-between">
        <div className="absolute top-0 left-0 w-full h-full bg-no-repeat" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3ClinearGradient id=\'g\' x1=\'0%25\' y1=\'0%25\' x2=\'100%25\' y2=\'100%25\'%3E%3Cstop offset=\'0%25\' stop-color=\'%23FFFFFF\' stop-opacity=\'0.1\'/%3E%3Cstop offset=\'100%25\' stop-color=\'%23FFFFFF\' stop-opacity=\'0\'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x=\'0\' y=\'0\' width=\'100%25\' height=\'100%25\' fill=\'transparent\' stroke-width=\'4\' stroke=\'url(%23g)\'/%3E%3C/svg%3E")'}}></div>
        <div>
            <h1 className="text-4xl font-bold tracking-tight">Join Our Community</h1>
            <p className="mt-4 text-lg text-blue-100 opacity-80">Start your journey to a sharper mind today. Access dozens of games and track your cognitive growth.</p>
        </div>
        <div className="z-10">
          <p className="text-sm opacity-70">&copy; 2024 CogniFlex Brain Trainer</p>
        </div>
      </div>

      {/* Right Panel (Signup Form) */}
      <main className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
            <div className="flex items-center gap-3 mb-8">
                <LogoIcon className="w-10 h-10 text-indigo-600" />
                <span className="text-2xl font-bold text-gray-800">CogniFlex Company</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Create an Account</h2>
            <p className="text-gray-600 mt-2">Let's get you started!</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                 <div>
                    <label className="text-sm font-medium text-gray-700" htmlFor="name">Full Name</label>
                    <div className="mt-1 relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" id="name" required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"/>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700" htmlFor="email">Email Address</label>
                    <div className="mt-1 relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        <input type="email" id="email" required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"/>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700" htmlFor="password">Password</label>
                    <div className="mt-1 relative">
                        <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type={isPasswordVisible ? 'text' : 'password'} id="password" required className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                        <button type="button" onClick={() => setIsPasswordVisible(v => !v)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700">
                            {isPasswordVisible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>
            
            <p className="mt-8 text-center text-gray-600">
                Already have an account?{' '}
                <button onClick={onNavigateToLogin} className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Log In
                </button>
            </p>
        </div>
      </main>
    </div>
  );
};

export default AuthModal;
