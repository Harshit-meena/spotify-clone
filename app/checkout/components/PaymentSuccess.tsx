'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface PaymentSuccessProps {
  plan:   string;
  amount: string;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ plan, amount }) => {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push('/'), 4000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6"
    >
      {/* GREEN CIRCLE CHECKMARK */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
        style={{ background: 'rgba(29,185,84,0.15)', border: '3px solid var(--green)' }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ fontSize: 40 }}
        >
          ✓
        </motion.span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-black mb-2"
        style={{ color: 'var(--text-primary)' }}
      >
        Payment Successful!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-base mb-1"
        style={{ color: 'var(--text-secondary)' }}
      >
        Welcome to <strong style={{ color: 'var(--green)' }}>Premium {plan}</strong>
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-sm mb-8"
        style={{ color: 'var(--text-muted)' }}
      >
        Amount paid: <strong>{amount}</strong>
      </motion.p>

      {/* CONFETTI DOTS */}
      <div className="flex gap-2 mb-8">
        {['#1DB954','#f59e0b','#60a5fa','#f472b6','#a78bfa'].map((c, i) => (
          <motion.div
            key={i}
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: [-20, 0, -14, 0], opacity: [1, 1, 1, 0.5] }}
            transition={{ delay: i * 0.08, duration: 0.6, repeat: Infinity, repeatDelay: 0.8 }}
            className="w-3 h-3 rounded-full"
            style={{ background: c }}
          />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm"
        style={{ color: 'var(--text-muted)' }}
      >
        Redirecting to home in 4 seconds…
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => router.push('/')}
        className="mt-4 px-8 py-3 rounded-full font-bold text-sm"
        style={{ background: 'var(--green)', color: '#000' }}
      >
        Start Listening 🎵
      </motion.button>
    </motion.div>
  );
};