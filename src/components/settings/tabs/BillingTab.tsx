import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, X, Crown, Zap, Sparkles, CreditCard, RefreshCw } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { creditService } from '@/services/creditService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const BillingTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [planType, setPlanType] = useState('free');
  const [aiCreditsRemaining, setAiCreditsRemaining] = useState(0);
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadBillingData();
    }
  }, [user]);

  const loadBillingData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch billing settings
      const { data: billing } = await supabase
        .from('billing_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (billing) {
        setPlanType(billing.plan_tier || 'free');
        setAiCreditsRemaining(billing.ai_credits_remaining || 0);
      }

      // Fetch subscription plans
      const { data: plansData } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true });

      if (plansData) {
        setPlans(plansData);
      }
    } catch (error) {
      console.error('Error loading billing:', error);
      toast({
        title: 'Error',
        description: 'Failed to load billing information',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planKey: string) => {
    if (!user) return;

    setUpgrading(true);
    try {
      const { url } = await creditService.createCheckoutSession(user.id, planKey);
      window.location.href = url;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start checkout process',
        variant: 'destructive',
      });
      setUpgrading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;

    try {
      const { url } = await creditService.createPortalSession(user.id);
      window.location.href = url;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to open billing portal',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <RefreshCw className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  const currentPlan = plans.find(p => p.plan_key === planType) || { credits_monthly: 10 };
  const maxCredits = currentPlan.credits_monthly;
  const isMaxPlan = planType === 'professional';

  return (
    <div className='space-y-6'>
      {/* Current Plan Card */}
      <Card className='border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                Current Plan
                {planType === 'free' && (
                  <Badge variant='secondary' className='capitalize'>
                    {planType}
                  </Badge>
                )}
                {planType === 'student' && (
                  <Badge className='bg-gradient-to-r from-blue-600 to-purple-600 text-white capitalize'>
                    {planType}
                  </Badge>
                )}
                {planType === 'professional' && (
                  <Badge className='bg-gradient-to-r from-purple-600 to-pink-600 text-white capitalize'>
                    {planType}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {planType === 'free' && "Get started with basic features"}
                {planType === 'student' && "Unlock advanced AI features"}
                {planType === 'professional' && "Ultimate career acceleration"}
              </CardDescription>
            </div>
            {planType !== 'free' && (
              <Button variant='outline' size='sm' onClick={handleManageSubscription}>
                Manage Subscription
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {/* AI Credits Usage */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-muted-foreground'>AI Credits</span>
                <span className='font-medium'>
                  {aiCreditsRemaining} / {maxCredits}
                </span>
              </div>
              {!isMaxPlan && (
                <div className='w-full bg-secondary h-2 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-gradient-to-r from-primary to-purple-600 transition-all'
                    style={{
                      width: `${Math.min((aiCreditsRemaining / maxCredits) * 100, 100)}%`,
                    }}
                  />
                </div>
              )}
            </div>

            {/* Plan Features */}
            <Separator />
            <div className='grid gap-2'>
              <p className='text-sm font-medium'>Your Features:</p>
              <div className='grid gap-1 text-sm text-muted-foreground'>
                <div className='flex items-center gap-2'>
                  <Check className='h-4 w-4 text-green-600' />
                  <span>Career Assessment</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Check className='h-4 w-4 text-green-600' />
                  <span>Basic Job Matching</span>
                </div>
                {planType !== 'free' && (
                  <>
                    <div className='flex items-center gap-2'>
                      <Check className='h-4 w-4 text-green-600' />
                      <span>Advanced AI Insights</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Check className='h-4 w-4 text-green-600' />
                      <span>Resume Builder</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Check className='h-4 w-4 text-green-600' />
                      <span>Priority Support</span>
                    </div>
                  </>
                )}
                {planType === 'professional' && (
                  <>
                    <div className='flex items-center gap-2'>
                      <Check className='h-4 w-4 text-green-600' />
                      <span>Personal Career Coach</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Check className='h-4 w-4 text-green-600' />
                      <span>Interview Preparation</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Check className='h-4 w-4 text-green-600' />
                      <span>Unlimited AI Credits</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Plans - Only show if on free tier */}
      {planType === 'free' && (
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-lg font-semibold'>Upgrade Your Plan</h3>
              <p className='text-sm text-muted-foreground'>
                Unlock more features and accelerate your career
              </p>
            </div>
          </div>

          <div className='grid gap-6 md:grid-cols-2'>
            {plans.filter(p => p.plan_key !== 'free').map((plan) => (
              <Card 
                key={plan.id}
                className={`relative border-2 ${
                  plan.plan_key === 'student' 
                    ? 'border-blue-500/20 hover:border-blue-500/40' 
                    : 'border-purple-500/20 hover:border-purple-500/40'
                } transition-all hover:shadow-lg`}
              >
                {plan.is_popular && (
                  <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
                    <Badge className='bg-gradient-to-r from-blue-600 to-purple-600 text-white'>
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    {plan.plan_key === 'student' ? (
                      <Zap className='h-5 w-5 text-blue-600' />
                    ) : (
                      <Crown className='h-5 w-5 text-purple-600' />
                    )}
                    {plan.plan_name}
                  </CardTitle>
                  <div className='flex items-baseline gap-1'>
                    <span className='text-3xl font-bold'>
                      TZS {plan.price_monthly.toLocaleString()}
                    </span>
                    <span className='text-muted-foreground'>/month</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <ul className='space-y-2 text-sm'>
                    <li className='flex items-center gap-2'>
                      <Check className='h-4 w-4 text-green-600 flex-shrink-0' />
                      <span>{plan.credits_monthly} AI Credits/month</span>
                    </li>
                    {plan.features_included && Object.entries(plan.features_included).map(([key, value]) => (
                      value === true && (
                        <li key={key} className='flex items-center gap-2'>
                          <Check className='h-4 w-4 text-green-600 flex-shrink-0' />
                          <span className='capitalize'>{key.replace(/_/g, ' ')}</span>
                        </li>
                      )
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      plan.plan_key === 'student'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600'
                    } hover:opacity-90`}
                    onClick={() => handleUpgrade(plan.plan_key)}
                    disabled={upgrading}
                  >
                    {upgrading ? (
                      <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                    ) : plan.plan_key === 'student' ? (
                      <Crown className='h-4 w-4 mr-2' />
                    ) : (
                      <Sparkles className='h-4 w-4 mr-2' />
                    )}
                    Upgrade to {plan.plan_name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            Payment Method
          </CardTitle>
          <CardDescription>Manage your payment methods via Stripe</CardDescription>
        </CardHeader>
        <CardContent>
          {planType !== 'free' ? (
            <Button variant='outline' onClick={handleManageSubscription}>
              <CreditCard className='h-4 w-4 mr-2' />
              Manage Payment Method
            </Button>
          ) : (
            <div className='p-6 border-2 border-dashed rounded-lg text-center space-y-2'>
              <CreditCard className='h-8 w-8 text-muted-foreground mx-auto' />
              <p className='text-sm text-muted-foreground'>
                No payment method added
              </p>
              <p className='text-xs text-muted-foreground'>
                Upgrade to a paid plan to add payment method
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
