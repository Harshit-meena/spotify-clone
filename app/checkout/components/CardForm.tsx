'use client';

import { useState } from 'react';
import { motion }   from 'framer-motion';

interface CardFormProps {
  amount:    string;
  plan:      string;
  onSuccess: () => void;
}

export const CardForm: React.FC<CardFormProps> = ({ amount, plan, onSuccess }) => {
  const [number,  setNumber]  = useState('');
  const [expiry,  setExpiry]  = useState('');
  const [cvv,     setCvv]     = useState('');
  const [name,    setName]    = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const formatCard = (val: string) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 3) return clean.slice(0, 2) + '/' + clean.slice(2);
    return clean;
  };

  const handlePay = async () => {
    setError('');
    const rawNumber = number.replace(/\s/g, '');
    if (rawNumber.length < 16)   { setError('Enter a valid 16-digit card number'); return; }
    if (expiry.length < 5)       { setError('Enter a valid expiry MM/YY'); return; }
    if (cvv.length < 3)          { setError('Enter a valid CVV'); return; }
    if (!name.trim())            { setError('Enter cardholder name'); return; }

    setLoading(true);
    // Simulate processing 2.5s
    await new Promise(r => setTimeout(r, 2500));
    setLoading(false);
    onSuccess();
  };

  const inputStyle: React.CSSProperties = {
    background:   'var(--input-bg)',
    border:       '1px solid var(--input-border)',
    color:        'var(--text-primary)',
    borderRadius: 10,
    padding:      '12px 14px',
    width:        '100%',
    fontSize:     14,
    outline:      'none',
    transition:   'border-color 0.2s',
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.currentTarget.style.borderColor = 'var(--green)');
  const blurStyle  = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.currentTarget.style.borderColor = 'var(--input-border)');

  return (
    <div className="space-y-4">

      {/* CARD LOGOS */}
      <div className="flex gap-2 items-center mb-2">
        {['💳', 'Visa', 'MC', 'RuPay'].map((c, i) => (
          <span
            key={i}
            className="text-xs px-2 py-0.5 rounded font-bold"
            style={{
              background: 'var(--bg-glass)',
              border:     '1px solid var(--border-subtle)',
              color:      'var(--text-muted)',
            }}
          >
            {c}
          </span>
        ))}
      </div>

      {/* CARD NUMBER */}
      <div>
        <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-muted)' }}>
          Card Number
        </label>
        <input
          style={inputStyle}
          placeholder="1234 5678 9012 3456"
          value={number}
          onChange={e => setNumber(formatCard(e.target.value))}
          onFocus={focusStyle}
          onBlur={blurStyle}
          maxLength={19}
        />
      </div>

      {/* NAME */}
      <div>
        <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-muted)' }}>
          Cardholder Name
        </label>
        <input
          style={inputStyle}
          placeholder="Name on card"
          value={name}
          onChange={e => setName(e.target.value)}
          onFocus={focusStyle}
          onBlur={blurStyle}
        />
      </div>

      {/* EXPIRY + CVV */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-muted)' }}>
            Expiry
          </label>
          <input
            style={inputStyle}
            placeholder="MM/YY"
            value={expiry}
            onChange={e => setExpiry(formatExpiry(e.target.value))}
            onFocus={focusStyle}
            onBlur={blurStyle}
            maxLength={5}
          />
        </div>
        <div>
          <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-muted)' }}>
            CVV
          </label>
          <input
            style={inputStyle}
            placeholder="•••"
            value={cvv}
            onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
            onFocus={focusStyle}
            onBlur={blurStyle}
            maxLength={4}
            type="password"
          />
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <p className="text-xs font-medium" style={{ color: '#ef4444' }}>
          ⚠ {error}
        </p>
      )}

      {/* AMOUNT SUMMARY */}
      <div
        className="flex justify-between items-center px-4 py-3 rounded-xl text-sm"
        style={{ background: 'rgba(29,185,84,0.08)', border: '1px solid rgba(29,185,84,0.2)' }}
      >
        <span style={{ color: 'var(--text-secondary)' }}>{plan} — Monthly</span>
        <span className="font-black text-base" style={{ color: 'var(--green)' }}>{amount}</span>
      </div>

      {/* PAY BUTTON */}
      <motion.button
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handlePay}
        disabled={loading}
        className="w-full py-3.5 rounded-full font-black text-sm flex items-center justify-center gap-2"
        style={{
          background: loading ? 'var(--bg-highlight)' : 'var(--green)',
          color:      loading ? 'var(--text-muted)' : '#000',
          cursor:     loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-t-transparent rounded-full"
              style={{ borderColor: 'var(--text-muted)', borderTopColor: 'transparent' }}
            />
            Processing…
          </>
        ) : (
          `Pay ${amount}`
        )}
      </motion.button>

      <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
        🔒 This is a demo — no real charges
      </p>
    </div>
  );
};