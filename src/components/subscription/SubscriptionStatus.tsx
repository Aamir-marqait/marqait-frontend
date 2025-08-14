import { memo } from 'react';
import type { SubscriptionStatus } from '@/api/types';

interface SubscriptionStatusProps {
  subscriptionStatus: SubscriptionStatus | null;
  isLoading: boolean;
  error: string | null;
}

const SubscriptionStatus = memo(({ subscriptionStatus, isLoading, error }: SubscriptionStatusProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
        <p className="text-red-600 text-sm">Unable to load subscription status: {error}</p>
      </div>
    );
  }

  if (!subscriptionStatus) {
    return null;
  }

  const { has_active_subscription, current_subscription, subscription_tier, can_buy_custom_credits } = subscriptionStatus;

  return (
    <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-Inter font-semibold text-lg text-gray-900 mb-1">
            Current Subscription
          </h3>
          <div className="flex items-center gap-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              has_active_subscription 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {subscription_tier}
            </span>
            {has_active_subscription && current_subscription && (
              <span className="text-sm text-gray-600">
                {current_subscription.plan.credits.toLocaleString()} credits included
              </span>
            )}
          </div>
        </div>
        
        {has_active_subscription && current_subscription && (
          <div className="text-right">
            <p className="text-sm text-gray-600">
              {current_subscription.auto_renew ? 'Auto-renews' : 'Expires'} on
            </p>
            <p className="font-medium text-gray-900">
              {new Date(current_subscription.end_date).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {has_active_subscription && current_subscription && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Plan</p>
              <p className="font-medium text-gray-900">{current_subscription.plan.display_name}</p>
            </div>
            <div>
              <p className="text-gray-600">Status</p>
              <p className={`font-medium capitalize ${
                current_subscription.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-600'
              }`}>
                {current_subscription.status.toLowerCase()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Price</p>
              <p className="font-medium text-gray-900">${current_subscription.plan.price}</p>
            </div>
            <div>
              <p className="text-gray-600">Custom Credits</p>
              <p className="font-medium text-gray-900">
                {can_buy_custom_credits ? 'Available' : 'Not available'}
              </p>
            </div>
          </div>
        </div>
      )}

      {!has_active_subscription && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            No active subscription. Choose a plan below to get started.
          </p>
        </div>
      )}
    </div>
  );
});

SubscriptionStatus.displayName = 'SubscriptionStatus';

export default SubscriptionStatus;