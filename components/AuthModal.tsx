'use client';

import { useState, useEffect } from 'react';
import { useAuthModal } from '@/hooks/useAuthModal';
import { Button } from './Button';
import { toast } from 'react-hot-toast';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { FcGoogle } from 'react-icons/fc'; // Google Icon
import { FaFacebook, FaApple } from 'react-icons/fa'; // Other Icons
import { useRouter } from 'next/navigation';

const AuthModal = () => {
  const { isOpen, onClose, view, onOpen } = useAuthModal();
  const supabase = useSupabaseClient();
  const session = useSession();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Agar login ho jaye toh modal band kar do
  useEffect(() => {
    if (session) {
      onClose();
      router.refresh();
    }
  }, [session, onClose, router]);

  if (!isOpen) return null;

  // 🔥 GOOGLE LOGIN FUNCTION
  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account', // Isse har baar account mangega (7th image jaisa)
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  // 🔥 EMAIL/PASSWORD AUTH
  const handleAuth = async () => {
    if (!email || !password) return toast.error('Fields are empty');
    setLoading(true);

    try {
      if (view === 'signup') {
        if (password !== confirmPassword) throw new Error('Passwords match nahi ho rahe!');
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success('Check your email for verification! 🎉');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Welcome back! 🚀');
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#121212] border border-neutral-800 p-8 rounded-3xl w-full max-w-[450px] relative shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* CLOSE BUTTON */}
        <button onClick={onClose} className="absolute right-6 top-6 text-neutral-500 hover:text-white transition">
          <span className="text-2xl">✕</span>
        </button>

        {/* LOGO/TITLE */}
        <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-black rounded-sm rotate-45"></div>
            </div>
            <h2 className="text-3xl font-extrabold text-white text-center">
              {view === 'login' ? 'Welcome back' : 'Join Spotify'}
            </h2>
        </div>

        {/* SOCIAL BUTTONS */}
        <div className="flex flex-col gap-3">
          <button 
            disabled={loading}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3 px-4 rounded-full hover:bg-neutral-200 transition"
          >
            <FcGoogle size={24} />
            Continue with Google
          </button>
          
          <button className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white font-bold py-3 px-4 rounded-full hover:opacity-90 transition">
            <FaFacebook size={24} />
            Continue with Facebook
          </button>

          <button className="w-full flex items-center justify-center gap-3 bg-black border border-neutral-700 text-white font-bold py-3 px-4 rounded-full hover:bg-neutral-900 transition">
            <FaApple size={24} />
            Continue with Apple
          </button>
        </div>

        {/* DIVIDER */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-neutral-800"></div>
          <span className="px-4 text-neutral-500 text-sm font-medium">OR</span>
          <div className="flex-grow border-t border-neutral-800"></div>
        </div>

        {/* EMAIL FORM */}
        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-white uppercase ml-1">Email address</label>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#242424] border border-transparent rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-green-500 focus:bg-black transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-white uppercase ml-1">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#242424] border border-transparent rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-green-500 focus:bg-black transition"
            />
          </div>

          {view === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-white uppercase ml-1">Confirm Password</label>
              <input
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#242424] border border-transparent rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-green-500 focus:bg-black transition"
              />
            </div>
          )}

          <Button
            disabled={loading}
            onClick={handleAuth}
            className="w-full bg-green-500 text-black py-4 mt-2 rounded-full font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition"
          >
            {loading ? 'Processing...' : (view === 'login' ? 'Log In' : 'Sign Up Free')}
          </Button>
        </div>

        {/* SWITCH VIEW */}
        <p className="text-center mt-8 text-neutral-400 font-medium">
          {view === 'login' ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => onOpen(view === 'login' ? 'signup' : 'login')}
            className="text-white ml-2 underline font-bold hover:text-green-500 transition"
          >
            {view === 'login' ? 'Sign up for Spotify' : 'Log in here'}
          </button>
        </p>

      </div>
    </div>
  );
};

export default AuthModal;