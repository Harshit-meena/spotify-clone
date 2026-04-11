'use client';

import { useRouter } from 'next/navigation';

const plans = [
  {
    name: 'Lite',
    price: '₹139/month',
    features: [
      '1 Lite account',
      'High audio quality (up to ~160kbps)',
      'Cancel anytime'
    ],
    color: 'bg-gray-300 text-black'
  },
  {
    name: 'Standard',
    price: '₹199/month',
    features: [
      '1 Standard account',
      'Download to listen offline',
      'Very high audio quality (~320kbps)',
      'Cancel anytime'
    ],
    color: 'bg-green-500 text-black'
  },
  {
    name: 'Platinum',
    price: '₹299/month',
    features: [
      'Up to 3 accounts',
      'Lossless audio',
      'AI playlist',
      'DJ support'
    ],
    color: 'bg-yellow-400 text-black'
  },
  {
    name: 'Student',
    price: '₹99/month',
    features: [
      'Verified student account',
      'Download offline',
      'High quality audio',
      'Cancel anytime'
    ],
    color: 'bg-green-300 text-black'
  }
];

const PremiumPage = () => {
  const router = useRouter();

  const handleSelectPlan = (plan: any) => {
    router.push(`/checkout?plan=${plan.name}&price=${plan.price}`);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10">

      <h1 className="text-4xl font-bold mb-10">
        🎧 Choose Your Premium Plan
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">

        {plans.map((plan) => (
          <div
            key={plan.name}
            className="bg-neutral-900 p-6 rounded-xl w-[300px] shadow-lg flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
              <p className="mb-4 text-neutral-300">{plan.price}</p>

              <ul className="text-sm text-neutral-400 space-y-2">
                {plan.features.map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan(plan)}
              className={`mt-6 py-3 rounded-full font-bold ${plan.color}`}
            >
              Get Premium {plan.name}
            </button>
          </div>
        ))}

      </div>
    </div>
  );
};

export default PremiumPage;