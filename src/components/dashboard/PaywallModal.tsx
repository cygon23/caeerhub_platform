import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Zap, Lock } from 'lucide-react';
import { creditService } from '@/services/creditService';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  featureName: string;
  creditsRequired: number;
  currentBalance: number;
}

export function PaywallModal({
  open,
  onClose,
  featureName,
  creditsRequired,
  currentBalance,
}: PaywallModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (planKey: string) => {
    setLoading(true);
    try {
      const { url } = await creditService.createCheckoutSession(user!.id, planKey);
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyCredits = async () => {
    setLoading(true);
    try {
      const { url } = await creditService.purchaseCredits(user!.id, 50);
      window.location.href = url;
    } catch (error) {
      console.error('Purchase error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-6 w-6 text-orange-500" />
            <DialogTitle>Unlock {featureName}</DialogTitle>
          </div>
          <DialogDescription>
            You need {creditsRequired} credits to access this feature. Your current balance: {currentBalance} credits.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {/* Option 1: Buy Credits */}
          <Card className="p-6 border-2 hover:border-primary transition-colors">
            <h3 className="font-semibold text-lg mb-2">Buy Credits</h3>
            <p className="text-3xl font-bold mb-4">
              TZS 2,500 <span className="text-sm font-normal text-muted-foreground">one-time</span>
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">50 credits</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">Never expires</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">No subscription needed</span>
              </li>
            </ul>
            <Button className="w-full" onClick={handleBuyCredits} disabled={loading}>
              Buy 50 Credits
            </Button>
          </Card>

          {/* Option 2: Upgrade to Student Plan */}
          <Card className="p-6 border-2 border-primary relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
              BEST VALUE
            </div>
            <h3 className="font-semibold text-lg mb-2">Student Plan</h3>
            <p className="text-3xl font-bold mb-4">
              TZS 15,000 <span className="text-sm font-normal text-muted-foreground">/month</span>
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">100 credits/month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">Unlimited AI roadmaps (2/month)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">Interview coaching (5/month)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">All learning modules</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">Mentor matching</span>
              </li>
            </ul>
            <Button className="w-full" onClick={() => handleUpgrade('student')} disabled={loading}>
              Upgrade to Student
            </Button>
          </Card>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          All payments are secure and processed by Stripe
        </p>
      </DialogContent>
    </Dialog>
  );
}