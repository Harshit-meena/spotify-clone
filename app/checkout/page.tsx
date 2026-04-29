'use client';

import { useState }                   from 'react';
import { useRouter, useSearchParams }  from 'next/navigation';
import { motion, AnimatePresence }     from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useUser }                     from '@supabase/auth-helpers-react';

import { UpiQrModal }      from '@/app/checkout/components/UpiQrModal';
import { CardForm }        from '@/app/checkout/components/CardForm';
import { PaymentSuccess }  from '@/app/checkout/components/PaymentSuccess';

const STATES = ['Andhra Pradesh','Delhi','Gujarat','Haryana','Karnataka','Maharashtra','Punjab','Rajasthan','Tamil Nadu','Uttar Pradesh','West Bengal'];

const CheckoutPage = () => {
  const router  = useRouter();
  const params  = useSearchParams();
  const supabase = createClientComponentClient();
  const user    = useUser();

  const plan   = params.get('plan')   || 'Standard';
  const price  = params.get('price')  || '₹199';
  const amount = params.get('amount') || '199';

  const [paymentMethod,    setPaymentMethod]    = useState<'upi' | 'card' | null>(null);
  const [address,          setAddress]          = useState('Rajasthan');
  const [tempAddress,      setTempAddress]      = useState('Rajasthan');
  const [showAddressEdit,  setShowAddressEdit]  = useState(false);
  const [showUpiModal,     setShowUpiModal]     = useState(false);
  const [paymentDone,      setPaymentDone]      = useState(false);
  const [activating,       setActivating]       = useState(false);

  /* ── ACTIVATE PREMIUM IN DB ── */
  const activatePremium = async () => {
    if (!user?.id) return;
    setActivating(true);

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    await supabase.from('subscriptions').upsert({
      user_id:    user.id,
      plan,
      amount:     parseInt(amount),
      status:     'active',
      expires_at: expiresAt.toISOString(),
    }, { onConflict: 'user_id' });

    setActivating(false);
    setPaymentDone(true);
  };

  /* ── HANDLE COMPLETE PURCHASE ── */
  const handleComplete = () => {
    if (!paymentMethod) return;
    if (paymentMethod === 'upi') {
      setShowUpiModal(true);
    }
    // Card: CardForm calls onSuccess directly
  };

  // Show success screen
  if (paymentDone) {
    return (
      <div
        className="min-h-full w-full overflow-y-auto"
        style={{ background: 'var(--bg-primary)' }}
      >
        <PaymentSuccess plan={plan} amount={`${price}/month`} />
      </div>
    );
  }

  return (
    <div
      className="min-h-full w-full overflow-y-auto pb-10"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* UPI MODAL */}
      <AnimatePresence>
        {showUpiModal && (
          <UpiQrModal
            amount={`${price}`}
            plan={plan}
            onClose={() => setShowUpiModal(false)}
            onSuccess={() => { setShowUpiModal(false); activatePremium(); }}
          />
        )}
      </AnimatePresence>

      {/* ADDRESS EDIT MODAL */}
      <AnimatePresence>
        {showAddressEdit && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'var(--modal-overlay)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{   opacity: 0, scale: 0.92 }}
              className="w-full max-w-sm rounded-2xl p-6"
              style={{
                background: 'var(--modal-bg)',
                border:     '1px solid var(--border-default)',
                boxShadow:  '0 24px 60px rgba(0,0,0,0.3)',
              }}
            >
              <h2 className="font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
                Edit Address
              </h2>

              <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-muted)' }}>
                State
              </label>
              <select
                value={tempAddress}
                onChange={e => setTempAddress(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm mb-4 outline-none"
                style={{
                  background: 'var(--input-bg)',
                  border:     '1px solid var(--border-default)',
                  color:      'var(--text-primary)',
                }}
              >
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <div
                className="text-xs px-3 py-2.5 rounded-lg mb-4"
                style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}
              >
                ⚠ Address changes may affect pricing due to tax regulations.
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddressEdit(false)}
                  className="flex-1 py-2.5 rounded-full text-sm font-semibold"
                  style={{ border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setAddress(tempAddress); setShowAddressEdit(false); }}
                  className="flex-1 py-2.5 rounded-full text-sm font-bold"
                  style={{ background: 'var(--green)', color: '#000' }}
                >
                  Save Address
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PAGE CONTENT */}
      <div className="max-w-xl mx-auto px-5 py-8">

        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <img src="/images/logo.png"       alt="Spotify" className="theme-logo-white h-9" />
          <img src="/images/logo_black.png" alt="Spotify" className="theme-logo-black h-9" />
        </div>

        {/* HEADER */}
        <div className="flex items-center justify-between mb-7">
          <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
            Checkout
          </h1>
          <button
            onClick={() => router.push('/premium')}
            className="text-sm font-semibold transition-colors"
            style={{ color: 'var(--green)' }}
          >
            Change plan
          </button>
        </div>

        {/* PLAN CARD */}
        <div
          className="rounded-2xl p-4 mb-5 flex items-center justify-between"
          style={{
            background: 'rgba(29,185,84,0.08)',
            border:     '1px solid rgba(29,185,84,0.25)',
          }}
        >
          <div>
            <p className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              Premium {plan}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Billed monthly
            </p>
          </div>
          <p className="text-2xl font-black" style={{ color: 'var(--green)' }}>
            {price}<span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>/mo</span>
          </p>
        </div>

        {/* ADDRESS */}
        <Section title="Address">
          <div
            className="rounded-xl p-4 flex items-center justify-between"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
          >
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {address}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>IN</p>
            </div>
            <button
              onClick={() => { setTempAddress(address); setShowAddressEdit(true); }}
              className="text-sm font-semibold"
              style={{ color: 'var(--green)' }}
            >
              Edit
            </button>
          </div>
        </Section>

        {/* PAYMENT METHOD */}
        <Section title="Payment method">
          <div className="space-y-2">

            {/* UPI */}
            <PayOption
              selected={paymentMethod === 'upi'}
              onClick={() => setPaymentMethod(p => p === 'upi' ? null : 'upi')}
              icon="📱"
              label="UPI (QR code)"
              sub="PhonePe, Google Pay, Paytm & more"
            />

            {/* CARD */}
            <PayOption
              selected={paymentMethod === 'card'}
              onClick={() => setPaymentMethod(p => p === 'card' ? null : 'card')}
              icon="💳"
              label="Credit / Debit Card"
              sub="Visa, Mastercard, RuPay"
            />
          </div>

          {/* CARD FORM */}
          <AnimatePresence>
            {paymentMethod === 'card' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{   opacity: 0, height: 0 }}
                className="overflow-hidden mt-4"
              >
                <div
                  className="p-5 rounded-2xl"
                  style={{
                    background: 'var(--bg-elevated)',
                    border:     '1px solid var(--border-default)',
                  }}
                >
                  <CardForm
                    amount={`${price}/month`}
                    plan={plan}
                    onSuccess={activatePremium}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Section>

        {/* ORDER SUMMARY */}
        <Section title="Order summary">
          <div
            className="rounded-xl p-4 space-y-2"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--text-secondary)' }}>Premium {plan}</span>
              <span style={{ color: 'var(--text-primary)' }}>{price}/month</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--text-secondary)' }}>GST (18%)</span>
              <span style={{ color: 'var(--text-muted)' }}>Included</span>
            </div>
            <div
              className="pt-2 mt-1"
              style={{ borderTop: '1px solid var(--border-subtle)' }}
            >
              <div className="flex justify-between font-black text-base">
                <span style={{ color: 'var(--text-primary)' }}>Total today</span>
                <span style={{ color: 'var(--green)' }}>{price}</span>
              </div>
            </div>
          </div>
        </Section>

        {/* COMPLETE PURCHASE — only show for UPI (card handles its own button) */}
        {paymentMethod === 'upi' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleComplete}
            disabled={activating}
            className="w-full py-4 rounded-full font-black text-base mt-2"
            style={{ background: 'var(--green)', color: '#000' }}
          >
            {activating ? 'Activating…' : 'Continue to Pay →'}
          </motion.button>
        )}

        <p className="text-center text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
          🔒 Demo payment — no real charges will be made
        </p>
      </div>
    </div>
  );
};

/* ── HELPER COMPONENTS ── */

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-5">
    <p
      className="text-xs font-black uppercase tracking-wider mb-2"
      style={{ color: 'var(--text-muted)' }}
    >
      {title}
    </p>
    {children}
  </div>
);

const PayOption = ({
  selected, onClick, icon, label, sub,
}: {
  selected: boolean;
  onClick:  () => void;
  icon:     string;
  label:    string;
  sub:      string;
}) => (
  <motion.div
    whileTap={{ scale: 0.99 }}
    onClick={onClick}
    className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all"
    style={{
      background:  selected ? 'rgba(29,185,84,0.08)' : 'var(--bg-elevated)',
      border:      selected ? '2px solid var(--green)' : '1px solid var(--border-subtle)',
    }}
  >
    {/* Radio */}
    <div
      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
      style={{
        border:     selected ? '2px solid var(--green)' : '2px solid var(--border-default)',
        background: selected ? 'var(--green)' : 'transparent',
      }}
    >
      {selected && <div className="w-2 h-2 rounded-full bg-black" />}
    </div>

    <span style={{ fontSize: 20 }}>{icon}</span>

    <div className="flex-1">
      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</p>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub}</p>
    </div>
  </motion.div>
);

export default CheckoutPage;