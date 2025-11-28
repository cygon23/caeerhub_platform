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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Check,
  Crown,
  Zap,
  Sparkles,
  CreditCard,
  RefreshCw,
  Shield,
  Rocket,
  Star,
  Gift,
  ArrowRight,
  AlertCircle,
  Info,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { creditService } from '@/services/creditService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

interface Plan {
  id: string;
  plan_key: string;
  plan_name: string;
  price_monthly: number;
  price_yearly: number;
  credits_monthly: number;
  description: string;
  features_included: Record<string, boolean>;
  is_popular: boolean;
  stripe_price_id: string | null;
}

export const BillingTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [planType, setPlanType] = useState('free');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState('active');
  const [setupIncomplete, setSetupIncomplete] = useState(false);
  const [nextBillingDate, setNextBillingDate] = useState<string | null>(null);
  const [lastPaymentAmount, setLastPaymentAmount] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadBillingData();
    }
  }, [user]);

  // Auto-refresh after successful payment
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('success') === 'true') {
      toast({
        title: '🎉 Payment Successful!',
        description: 'Your subscription has been activated.',
      });
      // Reload billing data after short delay to allow webhook to process
      setTimeout(() => {
        loadBillingData();
      }, 2000);
    }
  }, [location.search]);

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
        setSubscriptionStatus(billing.subscription_status || 'active');
        setNextBillingDate(billing.next_billing_date);
        setLastPaymentAmount(billing.last_payment_amount);
        setStripeCustomerId(billing.stripe_customer_id);

        // Get payment method details if available
        if (billing.stripe_customer_id) {
          fetchPaymentMethod(billing.stripe_customer_id);
        }
      }

      // Fetch subscription plans
      const { data: plansData } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (plansData) {
        setPlans(plansData);
        const paidPlans = plansData.filter(p => p.plan_key !== 'free');
        const hasUnconfiguredPlans = paidPlans.some(p => !p.stripe_price_id);
        setSetupIncomplete(hasUnconfiguredPlans);
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

  const fetchPaymentMethod = async (customerId: string) => {
    try {
      // Fetch latest payment from database
      const { data: payment, error } = await supabase
        .from('stripe_payments')
        .select('payment_method, payment_method_details')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching payment method:', error);
        return;
      }

      if (payment?.payment_method_details) {
        // Extract from payment method details
        const details = payment.payment_method_details as any;
        if (details?.card) {
          const brand = details.card.brand.charAt(0).toUpperCase() + details.card.brand.slice(1);
          setPaymentMethod(`${brand} •••• ${details.card.last4}`);
        } else if (details?.type) {
          setPaymentMethod(details.type);
        }
      } else if (payment?.payment_method) {
        setPaymentMethod(payment.payment_method);
      }
    } catch (error) {
      console.error('Error fetching payment method:', error);
    }
  };

  const handleUpgrade = async (plan: Plan) => {
    if (!user) return;

    if (!plan.stripe_price_id) {
      toast({
        title: 'Setup Required',
        description: `The ${plan.plan_name} needs to be configured in Stripe.`,
        variant: 'destructive',
      });
      return;
    }

    setUpgrading(plan.plan_key);
    try {
      const { url } = await creditService.createCheckoutSession(user.id, plan.plan_key);
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout Failed',
        description: error.message || 'Failed to start checkout process.',
        variant: 'destructive',
      });
      setUpgrading(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;

    try {
      const { url } = await creditService.createPortalSession(user.id);
      if (url) {
        window.location.href = url;
      }
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
      <div className='flex flex-col items-center justify-center py-20'>
        <RefreshCw className='h-10 w-10 animate-spin text-primary mb-4' />
        <p className='text-sm text-muted-foreground'>Loading billing information...</p>
      </div>
    );
  }

  const currentPlan = plans.find(p => p.plan_key === planType) || plans[0];

  const getPlanIcon = (planKey: string) => {
    switch (planKey) {
      case 'free': return <Shield className='h-5 w-5' />;
      case 'student': return <Zap className='h-5 w-5' />;
      case 'professional': return <Crown className='h-5 w-5' />;
      default: return <Star className='h-5 w-5' />;
    }
  };

  const getPlanGradient = (planKey: string) => {
    switch (planKey) {
      case 'free': return 'from-slate-600 to-slate-700';
      case 'student': return 'from-blue-600 to-purple-600';
      case 'professional': return 'from-purple-600 to-pink-600';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  return (
    <div className='space-y-8 pb-8'>
      {/* Header */}
      <div className='space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Billing & Subscription</h2>
        <p className='text-muted-foreground'>
          Manage your subscription and payment methods
        </p>
      </div>

      {/* Setup Warning */}
      {setupIncomplete && (
        <Alert className='border-amber-500/50 bg-amber-50 dark:bg-amber-950/20'>
          <AlertCircle className='h-4 w-4 text-amber-600' />
          <AlertDescription className='text-amber-900 dark:text-amber-100'>
            <strong>Payment Setup Incomplete:</strong> Some plans need Stripe configuration.
          </AlertDescription>
        </Alert>
      )}

      {/* Current Plan Overview */}
      <Card className='border-2 overflow-hidden'>
        <div className={cn('h-2 w-full bg-gradient-to-r', getPlanGradient(planType))} />
        <CardHeader className='pb-4'>
          <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4'>
            <div className='space-y-2 flex-1'>
              <div className='flex items-center gap-2 flex-wrap'>
                <CardTitle className='text-2xl'>Current Plan</CardTitle>
                <Badge
                  className={cn(
                    'capitalize text-xs font-semibold',
                    planType === 'free' && 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
                    planType === 'student' && 'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
                    planType === 'professional' && 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  )}
                >
                  {getPlanIcon(planType)}
                  <span className='ml-1'>{currentPlan?.plan_name || planType}</span>
                </Badge>
              </div>
              <CardDescription className='text-base'>
                {currentPlan?.description || 'Your current subscription plan'}
              </CardDescription>
            </div>
            {planType !== 'free' && (
              <Button
                variant='outline'
                size='sm'
                onClick={handleManageSubscription}
                className='gap-2 shrink-0'
              >
                <CreditCard className='h-4 w-4' />
                Manage Subscription
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Subscription Info */}
          <div className='grid gap-4 sm:grid-cols-2'>
            {planType !== 'free' && nextBillingDate && (
              <div className='flex items-start gap-3 p-3 rounded-lg bg-muted/50'>
                <Calendar className='h-5 w-5 text-primary mt-0.5' />
                <div className='flex-1'>
                  <p className='text-sm font-medium'>Next Billing Date</p>
                  <p className='text-sm text-muted-foreground'>
                    {new Date(nextBillingDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}
            {lastPaymentAmount && (
              <div className='flex items-start gap-3 p-3 rounded-lg bg-muted/50'>
                <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5' />
                <div className='flex-1'>
                  <p className='text-sm font-medium'>Last Payment</p>
                  <p className='text-sm text-muted-foreground'>
                    TZS {lastPaymentAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Plan Status Warning */}
          {subscriptionStatus !== 'active' && (
            <div className='p-4 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950 dark:border-amber-800'>
              <div className='flex items-start gap-3'>
                <AlertCircle className='h-5 w-5 text-amber-600 mt-0.5' />
                <div className='flex-1'>
                  <p className='font-semibold text-amber-900 dark:text-amber-100'>
                    Subscription Status: {subscriptionStatus}
                  </p>
                  <p className='text-sm text-amber-700 dark:text-amber-300 mt-1'>
                    Please update your payment method to continue.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div className='space-y-6'>
        <div className='space-y-2'>
          <div className='flex items-center justify-center gap-2'>
            <Rocket className='h-6 w-6 text-primary' />
            <h3 className='text-2xl font-bold text-center'>
              {planType === 'free' ? 'Choose Your Plan' : 'Available Plans'}
            </h3>
          </div>
          <p className='text-muted-foreground text-center'>
            Select the perfect plan to accelerate your career growth
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-3'>
          {plans.map((plan) => {
            const isCurrentPlan = plan.plan_key === planType;
            const needsSetup = plan.plan_key !== 'free' && !plan.stripe_price_id;

            // Determine plan hierarchy for upgrade/downgrade logic
            const planHierarchy = { 'free': 0, 'student': 1, 'professional': 2 };
            const currentPlanLevel = planHierarchy[planType as keyof typeof planHierarchy] || 0;
            const thisPlanLevel = planHierarchy[plan.plan_key as keyof typeof planHierarchy] || 0;
            const isDowngrade = thisPlanLevel < currentPlanLevel;

            return (
              <Card
                key={plan.id}
                className={cn(
                  'relative overflow-hidden transition-all duration-300',
                  isCurrentPlan && 'border-2 border-primary ring-2 ring-primary/20 shadow-lg',
                  !isCurrentPlan && 'hover:shadow-xl hover:-translate-y-1 border-2'
                )}
              >
                {plan.is_popular && (
                  <div className='absolute -top-0 -right-0 z-10'>
                    <div className='bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1.5 text-xs font-bold rounded-bl-lg flex items-center gap-1 shadow-lg'>
                      <Star className='h-3 w-3 fill-current' />
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {isCurrentPlan && (
                  <div className='absolute -top-0 -right-0 z-10'>
                    <div className='bg-primary text-primary-foreground px-4 py-1.5 text-xs font-bold rounded-bl-lg shadow-lg'>
                      CURRENT PLAN
                    </div>
                  </div>
                )}

                <div className={cn('h-2 w-full bg-gradient-to-r', getPlanGradient(plan.plan_key))} />

                <CardHeader className='pb-4 pt-6'>
                  <div className='flex items-center gap-3 mb-3'>
                    <div className={cn(
                      'p-3 rounded-xl bg-gradient-to-r shadow-md',
                      getPlanGradient(plan.plan_key)
                    )}>
                      <div className='text-white'>
                        {getPlanIcon(plan.plan_key)}
                      </div>
                    </div>
                    <CardTitle className='text-xl'>{plan.plan_name}</CardTitle>
                  </div>

                  <div className='space-y-2'>
                    <div className='flex items-baseline gap-1'>
                      <span className='text-4xl font-bold'>
                        {plan.price_monthly === 0 ? 'Free' : `TZS ${plan.price_monthly.toLocaleString()}`}
                      </span>
                      {plan.price_monthly > 0 && (
                        <span className='text-muted-foreground text-sm'>/month</span>
                      )}
                    </div>
                    {plan.price_yearly > 0 && (
                      <p className='text-xs text-green-600 dark:text-green-400 flex items-center gap-1 font-medium'>
                        <Gift className='h-3 w-3' />
                        Save TZS {((plan.price_monthly * 12) - plan.price_yearly).toLocaleString()}/year
                      </p>
                    )}
                  </div>

                  <CardDescription className='text-sm pt-2 leading-relaxed'>
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className='space-y-6'>
                  <Separator />

                  {/* Features */}
                  <div className='space-y-3'>
                    <p className='text-sm font-semibold text-muted-foreground uppercase tracking-wide'>
                      Includes:
                    </p>
                    <ul className='space-y-2.5'>
                      {Object.entries(plan.features_included || {})
                        .filter(([_, enabled]) => enabled)
                        .slice(0, 5)
                        .map(([feature]) => (
                          <li key={feature} className='flex items-start gap-2.5 text-sm'>
                            <div className='bg-green-100 dark:bg-green-900/30 rounded-full p-0.5 mt-0.5'>
                              <Check className='h-3.5 w-3.5 text-green-600 dark:text-green-400' />
                            </div>
                            <span className='capitalize leading-tight flex-1'>
                              {feature.replace(/_/g, ' ')}
                            </span>
                          </li>
                        ))}
                      {Object.keys(plan.features_included || {}).length > 5 && (
                        <li className='text-xs text-muted-foreground pl-6 font-medium'>
                          + {Object.keys(plan.features_included).length - 5} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className='pt-2'>
                    {needsSetup ? (
                      <Button className='w-full h-11 gap-2 font-semibold' variant='outline' disabled>
                        <Info className='h-4 w-4' />
                        Setup Required
                      </Button>
                    ) : isCurrentPlan ? (
                      <Button
                        className='w-full h-11 gap-2 font-semibold'
                        variant='outline'
                        onClick={handleManageSubscription}
                      >
                        <CreditCard className='h-4 w-4' />
                        Manage Plan
                      </Button>
                    ) : isDowngrade && planType !== 'free' ? (
                      <Button
                        className='w-full h-11 gap-2 font-semibold'
                        variant='outline'
                        disabled
                      >
                        <Check className='h-4 w-4' />
                        Current: {currentPlan?.plan_name}
                      </Button>
                    ) : (
                      <Button
                        className={cn(
                          'w-full h-11 gap-2 font-semibold transition-all',
                          'bg-gradient-to-r text-white hover:opacity-90 hover:scale-105 shadow-md',
                          getPlanGradient(plan.plan_key)
                        )}
                        onClick={() => handleUpgrade(plan)}
                        disabled={upgrading === plan.plan_key}
                      >
                        {upgrading === plan.plan_key ? (
                          <>
                            <RefreshCw className='h-4 w-4 animate-spin' />
                            Processing...
                          </>
                        ) : (
                          <>
                            {thisPlanLevel > currentPlanLevel ? 'Upgrade Now' : 'Select Plan'}
                            <ArrowRight className='h-4 w-4' />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <CreditCard className='h-5 w-5' />
            Payment Method
          </CardTitle>
          <CardDescription>
            {planType !== 'free'
              ? 'Manage your payment methods through Stripe'
              : 'Add a payment method by upgrading to a paid plan'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {planType !== 'free' ? (
            <div className='space-y-4'>
              {paymentMethod && (
                <div className='flex items-center gap-3 p-4 border rounded-lg'>
                  <div className='p-2 rounded-lg bg-primary/10'>
                    <CreditCard className='h-5 w-5 text-primary' />
                  </div>
                  <div className='flex-1'>
                    <p className='font-medium capitalize'>{paymentMethod}</p>
                    <p className='text-sm text-muted-foreground'>Primary payment method</p>
                  </div>
                </div>
              )}
              <Button
                variant='outline'
                onClick={handleManageSubscription}
                className='gap-2'
              >
                <CreditCard className='h-4 w-4' />
                {paymentMethod ? 'Update Payment Method' : 'Add Payment Method'}
              </Button>
            </div>
          ) : (
            <div className='p-8 border-2 border-dashed rounded-lg text-center space-y-3 bg-muted/30'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted'>
                <CreditCard className='h-6 w-6 text-muted-foreground' />
              </div>
              <div>
                <p className='font-medium text-muted-foreground'>No payment method added</p>
                <p className='text-xs text-muted-foreground mt-1'>
                  Upgrade to a paid plan to add a payment method
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trust Badges */}
      <div className='flex flex-wrap items-center justify-center gap-6 py-6 border-t'>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <Shield className='h-4 w-4 text-green-600' />
          <span>Secure Payments</span>
        </div>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <RefreshCw className='h-4 w-4 text-blue-600' />
          <span>Cancel Anytime</span>
        </div>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <Sparkles className='h-4 w-4 text-amber-600' />
          <span>Powered by Stripe</span>
        </div>
      </div>
    </div>
  );
};
