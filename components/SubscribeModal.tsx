'use client';

import { useRouter } from 'next/navigation';

import { useUser } from '@/hooks/useUser';
import { Modal } from './Modal';
import { Button } from './Button';
import { useSubscribeModal } from '@/hooks/useSubscribeModal';

interface subscribeModalProps {
  products: any[]; 
}

const SubscribeModal: React.FC<subscribeModalProps> = ({ products }) => {
  const subscribeModal = useSubscribeModal();
  const { user, subscription } = useUser();
  const router = useRouter();

  const onChange = (open: boolean) => {
    if (!open) {
      subscribeModal.onClose();
    }
  };

  // 🔥 NEW FUNCTION (REDIRECT TO PREMIUM PAGE)
  const handleSubscribe = () => {
    if (!user) {
      alert('Login first!');
      return;
    }

    if (subscription) {
      alert('You are already subscribed');
      return;
    }

    // 👉 redirect to premium page
    router.push('/premium');
    subscribeModal.onClose();
  };

  return (
    <Modal
      title="Only for premium users"
      description="Listen to music with Spotify Premium"
      isOpen={subscribeModal.isOpen}
      onChange={onChange}
    >
      <div className="flex flex-col gap-4">
        
        <Button
          onClick={handleSubscribe}
          className="bg-green-500 text-black font-bold py-3 rounded-full"
        >
          Subscribe for play premium songs
        </Button>

      </div>
    </Modal>
  );
};

export default SubscribeModal;