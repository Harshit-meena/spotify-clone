'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const CheckoutPage = () => {
  const router = useRouter();
  const params = useSearchParams();

  const plan = params.get('plan') || 'Premium';
  const price = params.get('price') || '₹0';

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | null>(null);

  const [address, setAddress] = useState('Rajasthan');
  const [tempAddress, setTempAddress] = useState(address);
  const [showAddressEdit, setShowAddressEdit] = useState(false);

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 overflow-y-auto">

      {/* 🔥 LOGO */}
      <div className="flex justify-center mb-4">
        <img
          src="/images/logo.png"
          alt="logo"
          className="h-12"
        />
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Checkout</h1>

        <button
          onClick={() => router.push('/premium')}
          className="text-green-400 underline"
        >
          Change plan
        </button>
      </div>

      {/* PLAN */}
      <div className="bg-neutral-900 p-4 rounded-lg mb-6">
        <h2 className="font-bold">{plan}</h2>
        <p className="text-neutral-400">{price}</p>
      </div>

      {/* ADDRESS */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">Address</h2>

        <div className="bg-neutral-900 p-4 rounded-lg flex justify-between items-center">
          <div>
            {address} <br /> IN
          </div>

          <button
            onClick={() => setShowAddressEdit(true)}
            className="text-green-400"
          >
            Edit
          </button>
        </div>
      </div>

      {/* ADDRESS MODAL */}
      {showAddressEdit && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg w-[350px]">

            <h2 className="font-bold mb-4">Edit Address</h2>

            <select
              value={tempAddress}
              onChange={(e) => setTempAddress(e.target.value)}
              className="w-full border p-2 mb-4"
            >
              <option>Rajasthan</option>
              <option>Delhi</option>
              <option>Mumbai</option>
            </select>

            <div className="bg-orange-300 p-3 text-sm mb-4">
              Address changes may affect pricing due to tax
            </div>

            <button
              onClick={() => {
                setAddress(tempAddress);
                setShowAddressEdit(false);
              }}
              className="bg-green-500 w-full py-2 rounded-full"
            >
              Save Address
            </button>
          </div>
        </div>
      )}

      {/* PAYMENT */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">Payment method</h2>

        {/* UPI */}
        <div
          onClick={() =>
            setPaymentMethod((prev) => (prev === 'upi' ? null : 'upi'))
          }
          className={`p-4 mb-2 rounded-lg cursor-pointer ${
            paymentMethod === 'upi'
              ? 'border border-green-500 bg-neutral-800'
              : 'bg-neutral-900'
          }`}
        >
          UPI (QR code)
        </div>

        {/* CARD */}
        <div
          onClick={() =>
            setPaymentMethod((prev) => (prev === 'card' ? null : 'card'))
          }
          className={`p-4 rounded-lg cursor-pointer ${
            paymentMethod === 'card'
              ? 'border border-green-500 bg-neutral-800'
              : 'bg-neutral-900'
          }`}
        >
          Credit / Debit Card
        </div>
      </div>

      {/* UPI */}
      {paymentMethod === 'upi' && (
        <div className="bg-neutral-900 p-4 rounded-lg mb-6 text-center">
          <p className="mb-2">Scan QR to pay</p>

          <div className="bg-white w-[200px] h-[200px] mx-auto flex items-center justify-center text-black font-bold">
            QR CODE
          </div>

          <img
            src="/images/upi_image.png"
            alt="upi"
            className="h-8 mx-auto mt-4"
          />

          <p className="text-sm text-neutral-400 mt-2">
            Pay using any UPI app
          </p>
        </div>
      )}

      {/* CARD */}
      {paymentMethod === 'card' && (
        <div className="bg-neutral-900 p-4 rounded-lg mb-6">

          <img
            src="/images/card.png"
            alt="cards"
            className="h-6 mb-3"
          />

          <input
            placeholder="Card number"
            className="w-full p-2 mb-3 bg-neutral-800"
          />

          <div className="flex gap-2">
            <input
              placeholder="MM/YY"
              className="w-1/2 p-2 bg-neutral-800"
            />
            <input
              placeholder="CVV"
              className="w-1/2 p-2 bg-neutral-800"
            />
          </div>
        </div>
      )}

      {/* SUMMARY */}
      <div className="bg-neutral-900 p-4 rounded-lg mb-6">
        <p>{plan}</p>
        <p className="text-neutral-400">{price}</p>

        <hr className="my-3" />

        <p>Total now: ₹0.00</p>
      </div>

      {/* BUTTON */}
      <button className="bg-green-500 w-full py-4 rounded-full text-black font-bold">
        Complete Purchase
      </button>
    </div>
  );
};

export default CheckoutPage;