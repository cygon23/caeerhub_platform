import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { creditService } from '@/services/creditService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Coins, TrendingUp, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CreditBalanceWidget() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [balance, setBalance] = useState<number>(0);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [balanceData, subData] = await Promise.all([
        creditService.getBalance(user!.id),
        creditService.getSubscription(user!.id),
      ]);

      setBalance(balanceData);
      setSubscription(subData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load credit balance',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      const { url } = await creditService.createCheckoutSession(user!.id, 'student');
      window.location.href = url;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start checkout',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-muted h-20 rounded-lg" />;
  }

  const isLowBalance = balance < 20;
  const tierName = subscription?.plan_tier || 'free';

  return (
    <Card className={`border-2 ${isLowBalance ? 'border-orange-500' : 'border-primary'}`}>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isLowBalance ? 'bg-orange-100' : 'bg-primary/10'}`}>
            <Coins className={`h-5 w-5 ${isLowBalance ? 'text-orange-600' : 'text-primary'}`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">AI Credits</p>
            <p className="text-2xl font-bold">{balance}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-muted-foreground capitalize mb-1">
            {tierName} Plan
          </p>
          {subscription?.next_billing_date && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Renews {new Date(subscription.next_billing_date).toLocaleDateString()}
            </p>
          )}
          {isLowBalance && tierName === 'free' && (
            <Button size="sm" className="mt-2" onClick={handleUpgrade}>
              <TrendingUp className="h-3 w-3 mr-1" />
              Upgrade
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}