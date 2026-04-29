'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UpiQrModalProps {
  amount:    string;
  plan:      string;
  onSuccess: () => void;
  onClose:   () => void;
}

export const UpiQrModal: React.FC<UpiQrModalProps> = ({ amount, plan, onSuccess, onClose }) => {
  const [step,      setStep]      = useState<'qr' | 'checking' | 'done'>('qr');
  const [countdown, setCountdown] = useState(30);

  // Auto countdown
  useEffect(() => {
    if (step !== 'qr') return;
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(t);
  }, [step, countdown]);

  const handlePaymentDone = () => {
    setStep('checking');
    // Simulate checking payment — 2s delay then success
    setTimeout(() => {
      setStep('done');
      setTimeout(onSuccess, 800);
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'var(--modal-overlay)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{   opacity: 0, scale: 0.92,  y: 20 }}
        className="relative w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          background: 'var(--modal-bg)',
          border:     '1px solid var(--border-default)',
          boxShadow:  '0 24px 60px rgba(0,0,0,0.4)',
        }}
      >
        {/* HEADER */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div>
            <p className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              Pay with UPI
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {plan} · <strong style={{ color: 'var(--green)' }}>{amount}/month</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ background: 'var(--bg-glass)', color: 'var(--text-muted)' }}
          >
            ✕
          </button>
        </div>

        <div className="p-5">
          <AnimatePresence mode="wait">

            {/* QR STEP */}
            {step === 'qr' && (
              <motion.div
                key="qr"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                {/* AMOUNT BADGE */}
                <div
                  className="px-5 py-2 rounded-full font-black text-xl mb-4"
                  style={{ background: 'rgba(29,185,84,0.12)', color: 'var(--green)' }}
                >
                  {amount}
                </div>

                {/* QR CODE */}
                <div
                  className="w-[220px] h-[220px] rounded-xl overflow-hidden p-2 mb-3"
                  style={{ background: '#ffffff' }}
                >
                  <img
                    src="/images/qr.png"
                    alt="QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* UPI logos */}
                <img src="/images/upi_image.png" alt="UPI" className="h-6 mb-2 opacity-80" />

                <p className="text-xs text-center mb-1" style={{ color: 'var(--text-muted)' }}>
                  Scan using PhonePe, Google Pay, Paytm or any UPI app
                </p>

                {/* COUNTDOWN */}
                <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
                  QR valid for{' '}
                  <span style={{ color: countdown < 10 ? '#ef4444' : 'var(--green)', fontWeight: 700 }}>
                    {countdown}s
                  </span>
                </p>

                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={handlePaymentDone}
                  className="w-full py-3 rounded-full font-bold text-sm"
                  style={{ background: 'var(--green)', color: '#000' }}
                >
                  I've Completed the Payment
                </motion.button>
              </motion.div>
            )}

            {/* CHECKING STEP */}
            {step === 'checking' && (
              <motion.div
                key="checking"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center py-8 gap-4"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-14 h-14 rounded-full border-4 border-t-transparent"
                  style={{ borderColor: 'var(--green)', borderTopColor: 'transparent' }}
                />
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Verifying payment…
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Please wait a moment
                </p>
              </motion.div>
            )}

            {/* DONE STEP */}
            {step === 'done' && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-8 gap-3"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                  style={{ background: 'rgba(29,185,84,0.15)', border: '2px solid var(--green)' }}
                >
                  ✓
                </div>
                <p className="font-bold text-lg" style={{ color: 'var(--green)' }}>Payment Verified!</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};