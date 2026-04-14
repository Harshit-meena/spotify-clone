'use client';

import { useState } from 'react';
import { useAuthModal } from '@/hooks/useAuthModal';
import { Button } from './Button';
import { toast } from 'react-hot-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

const AuthModal = () => {
  const { isOpen, onClose, view, onOpen } = useAuthModal();
  const supabase = useSupabaseClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  // 🔥 AUTH FUNCTION
  const handleAuth = async () => {
    if (!email || !password) {
      return toast.error('Enter email & password');
    }

    // ✅ Signup validation
    if (view === 'signup' && password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    try {
      if (view === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        toast.success('Account created! 🎉');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.success('Logged in! 🚀');
      }

      onClose();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

      <div className="bg-neutral-900 p-6 rounded-xl w-[400px] relative shadow-2xl">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-400 hover:text-white text-xl"
        >
          ✕
        </button>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-white text-center">
          {view === 'login' ? 'Welcome back' : 'Create your account'}
        </h2>

        <p className="text-neutral-400 text-center mt-2">
          {view === 'login'
            ? 'Login into your account'
            : 'Sign up to get started'}
        </p>

        {/* FORM */}
        <div className="flex flex-col gap-4 mt-6">

          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black border border-neutral-700 rounded-md p-3 text-white outline-none focus:border-green-500 transition"
          />

          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-black border border-neutral-700 rounded-md p-3 text-white outline-none focus:border-green-500 transition"
          />

          {/* 🔥 SIGNUP EXTRA FIELD */}
          {view === 'signup' && (
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-black border border-neutral-700 rounded-md p-3 text-white outline-none focus:border-green-500 transition"
            />
          )}

          {/* 🔥 BUTTON */}
          <Button
            onClick={handleAuth}
            className="bg-green-500 text-black py-3 rounded-md font-semibold hover:scale-105 transition"
          >
            {view === 'login' ? 'Sign in' : 'Sign up'}
          </Button>

        </div>

        {/* SWITCH */}
        <div className="text-center mt-6 text-sm text-neutral-400">

          {view === 'login' ? (
            <>
              Don’t have an account?{' '}
              <span
                onClick={() => onOpen('signup')}
                className="text-white cursor-pointer hover:underline"
              >
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span
                onClick={() => onOpen('login')}
                className="text-white cursor-pointer hover:underline"
              >
                Log in
              </span>
            </>
          )}

        </div>

      </div>
    </div>
  );
};

export default AuthModal;