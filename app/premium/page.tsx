'use client';

import { useRouter } from 'next/navigation';
import { motion }    from 'framer-motion';
import { useSubscription } from '@/hooks/useSubscription';

const PLANS = [
  {
    name:     'Lite',
    price:    '₹139',
    period:   '/month',
    amount:   139,
    tag:      null,
    tagColor: '',
    btnStyle: { background: '#e5e7eb', color: '#111' },
    features: [
      '1 Lite account',
      'High audio quality (~160kbps)',
      'Ad-supported listening',
      'Cancel anytime',
    ],
  },
  {
    name:     'Standard',
    price:    '₹199',
    period:   '/month',
    amount:   199,
    tag:      'Most Popular',
    tagColor: 'var(--green)',
    btnStyle: { background: '#1DB954', color: '#000' },
    features: [
      '1 Standard account',
      'Download to listen offline',
      'Very high audio quality (~320kbps)',
      'No ads',
      'Cancel anytime',
    ],
  },
  {
    name:     'Platinum',
    price:    '₹299',
    period:   '/month',
    amount:   299,
    tag:      'Best Value',
    tagColor: '#f59e0b',
    btnStyle: { background: '#f59e0b', color: '#000' },
    features: [
      'Up to 3 accounts',
      'Lossless audio quality',
      'AI-generated playlists',
      'DJ support',
      'Offline downloads',
    ],
  },
  {
    name:     'Student',
    price:    '₹99',
    period:   '/month',
    amount:   99,
    tag:      'Students Only',
    tagColor: '#60a5fa',
    btnStyle: { background: '#60a5fa', color: '#000' },
    features: [
      'Verified student account',
      'Download offline',
      'High quality audio',
      'Cancel anytime',
    ],
  },
];

const PremiumPage = () => {
  const router = useRouter();
  const { subscription, isPremium } = useSubscription();

  const handleSelect = (plan: typeof PLANS[0]) => {
    router.push(`/checkout?plan=${plan.name}&price=${plan.price}&amount=${plan.amount}`);
  };

  return (
    <div
      className="min-h-full w-full overflow-y-auto pb-10"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* HERO */}
      <div
        className="py-14 px-6 flex flex-col items-center text-center"
        style={{
          background: 'linear-gradient(180deg, rgba(29,185,84,0.18) 0%, var(--bg-primary) 100%)',
        }}
      >
        {/* THEME-AWARE LOGO */}
        <img src="/images/logo.png"       alt="Spotify" className="theme-logo-white h-10 mb-6" />
        <img src="/images/logo_black.png" alt="Spotify" className="theme-logo-black h-10 mb-6" />

        <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
          Choose Your Premium Plan
        </h1>
        <p className="text-base max-w-md" style={{ color: 'var(--text-muted)' }}>
          Unlock unlimited music, offline listening, and crystal-clear audio.
        </p>

        {/* Current plan badge */}
        {isPremium && (
          <div
            className="mt-4 px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{ background: 'rgba(29,185,84,0.15)', color: 'var(--green)' }}
          >
            ✓ Current plan: {subscription?.plan}
          </div>
        )}
      </div>

      {/* PLANS GRID */}
      <div className="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
        {PLANS.map((plan, i) => {
          const isCurrent = subscription?.plan === plan.name;
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative flex flex-col rounded-2xl overflow-hidden"
              style={{
                background:  'var(--bg-elevated)',
                border:      isCurrent
                  ? '2px solid var(--green)'
                  : '1px solid var(--border-default)',
                boxShadow: 'var(--card-shadow)',
              }}
            >
              {/* TAG */}
              {plan.tag && (
                <div
                  className="absolute top-0 right-0 text-xs font-black px-3 py-1 rounded-bl-xl"
                  style={{ background: plan.tagColor, color: '#000' }}
                >
                  {plan.tag}
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-xl font-black mb-1" style={{ color: 'var(--text-primary)' }}>
                  {plan.name}
                </h2>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
                    {plan.price}
                  </span>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {plan.period}
                  </span>
                </div>

                {/* DIVIDER */}
                <div className="mb-4" style={{ height: 1, background: 'var(--border-subtle)' }} />

                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--green)', marginTop: 1 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => !isCurrent && handleSelect(plan)}
                  disabled={isCurrent}
                  className="w-full py-3 rounded-full font-bold text-sm transition-opacity"
                  style={{
                    ...plan.btnStyle,
                    opacity: isCurrent ? 0.6 : 1,
                    cursor: isCurrent ? 'default' : 'pointer',
                  }}
                >
                  {isCurrent ? '✓ Current Plan' : `Get Premium ${plan.name}`}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* FOOTER NOTE */}
      <p className="text-center text-xs mt-8" style={{ color: 'var(--text-muted)' }}>
        All plans are for demo purposes. No real payment will be charged.
      </p>
    </div>
  );
};

export default PremiumPage;