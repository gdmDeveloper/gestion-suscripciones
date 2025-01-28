import SubscriptionCard from '/components/SubscriptionCard';
import useSubscriptions from '@/hooks/useSubscriptions';

export default function SubscriptionsPage() {
  const { subscriptions, addSubscription } = useSubscriptions();

  return (
    <div>
      <h1 className="text-2xl font-bold">Mis Suscripciones</h1>
      <div className="mt-4">
        {subscriptions.map((sub) => (
          <SubscriptionCard key={sub.id} subscription={sub} />
        ))}
      </div>
    </div>
  );
}