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
import { Progress } from "@/components/ui/progress";
import {
  Check,
  Crown,
  Zap,
  Sparkles,
  CreditCard,
  RefreshCw,
  TrendingUp,
  Shield,
  Rocket,
  Star,
  Gift,
  ArrowRight
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { creditService } from '@/services/creditService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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
}

export const BillingTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [planType, setPlanType] = useState('free');
  const [aiCreditsRemaining, setAiCreditsRemaining] = useState(0);
  const [creditsMonthly, setCreditsMonthly] = useState(10);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState('active');

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
        setCreditsMonthly(billing.credits_monthly_allowance || 10);
        setSubscriptionStatus(billing.subscription_status || 'active');
      }

      // Fetch subscription plans
      const { data: plansData } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

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

    setUpgrading(planKey);
    try {
      const { url } = await creditService.createCheckoutSession(user.id, planKey);
      window.location.href = url;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start checkout process',
        variant: 'destructive',
      });
      setUpgrading(null);
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
      <div className='flex flex-col items-center justify-center py-20'>
        <RefreshCw className='h-10 w-10 animate-spin text-primary mb-4' />
        <p className='text-sm text-muted-foreground'>Loading billing information...</p>
      </div>
    );
  }

  const currentPlan = plans.find(p => p.plan_key === planType) || plans[0];
  const creditsPercentage = creditsMonthly > 0 ? (aiCreditsRemaining / creditsMonthly) * 100 : 0;
  const isProfessional = planType === 'professional';

  // Plan icons
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
    <div className='space-y-8 max-w-6xl mx-auto'>
      {/* Header Section */}
      <div className='text-center space-y-3'>
        <h2 className='text-3xl font-bold tracking-tight'>Billing & Subscription</h2>
        <p className='text-muted-foreground max-w-2xl mx-auto'>
          Choose the plan that fits your career journey. Upgrade anytime to unlock more features.
        </p>
      </div>

      {/* Current Plan Overview */}
      <Card className='border-2 overflow-hidden'>
        <div className={cn(
          'h-2 w-full bg-gradient-to-r',
          getPlanGradient(planType)
        )} />
        <CardHeader className='pb-4'>
          <div className='flex items-start justify-between'>
            <div className='space-y-1'>
              <div className='flex items-center gap-2'>
                <CardTitle className='text-2xl'>Current Plan</CardTitle>
                <Badge
                  className={cn(
                    'capitalize text-xs font-semibold',
                    planType === 'free' && 'bg-slate-100 text-slate-700',
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
                className='gap-2'
              >
                <CreditCard className='h-4 w-4' />
                Manage
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Credits Display */}
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Sparkles className='h-5 w-5 text-amber-500' />
                <span className='font-semibold text-lg'>AI Credits</span>
              </div>
              <div className='text-right'>
                <p className='text-2xl font-bold tabular-nums'>
                  {isProfessional ? '∞' : aiCreditsRemaining}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {isProfessional ? 'Unlimited' : `of ${creditsMonthly} this month`}
                </p>
              </div>
            </div>

            {!isProfessional && (
              <div className='space-y-2'>
                <Progress
                  value={creditsPercentage}
                  className='h-3'
                />
                <p className='text-xs text-muted-foreground text-center'>
                  {Math.round(creditsPercentage)}% remaining
                </p>
              </div>
            )}
          </div>

          {/* Plan Status */}
          {subscriptionStatus !== 'active' && (
            <div className='p-4 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950 dark:border-amber-800'>
              <div className='flex items-start gap-3'>
                <TrendingUp className='h-5 w-5 text-amber-600 mt-0.5' />
                <div className='flex-1'>
                  <p className='font-semibold text-amber-900 dark:text-amber-100'>
                    Subscription Status: {subscriptionStatus}
                  </p>
                  <p className='text-sm text-amber-700 dark:text-amber-300 mt-1'>
                    Please update your payment method to continue enjoying premium features.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upgrade Section - Only show if on free or student tier */}
      {planType !== 'professional' && (
        <div className='space-y-6'>
          <div className='text-center space-y-2'>
            <h3 className='text-2xl font-bold flex items-center justify-center gap-2'>
              <Rocket className='h-6 w-6 text-primary' />
              Upgrade Your Plan
            </h3>
            <p className='text-muted-foreground'>
              Unlock powerful AI features and accelerate your career growth
            </p>
          </div>

          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {plans.map((plan) => {
              const isCurrentPlan = plan.plan_key === planType;
              const isUpgrade = ['student', 'professional'].indexOf(plan.plan_key) >
                                ['free', 'student', 'professional'].indexOf(planType);

              if (!isUpgrade && !isCurrentPlan) return null;

              return (
                <Card
                  key={plan.id}
                  className={cn(
                    'relative overflow-hidden transition-all duration-300',
                    isCurrentPlan && 'border-2 border-primary ring-2 ring-primary/20',
                    !isCurrentPlan && 'hover:shadow-xl hover:scale-105 border-2 hover:border-primary/50'
                  )}
                >
                  {/* Popular Badge */}
                  {plan.is_popular && !isCurrentPlan && (
                    <div className='absolute top-0 right-0'>
                      <div className='bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg flex items-center gap-1'>
                        <Star className='h-3 w-3 fill-current' />
                        POPULAR
                      </div>
                    </div>
                  )}

                  {/* Current Plan Badge */}
                  {isCurrentPlan && (
                    <div className='absolute top-0 right-0'>
                      <div className='bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg'>
                        CURRENT
                      </div>
                    </div>
                  )}

                  {/* Top Color Bar */}
                  <div className={cn(
                    'h-1.5 w-full bg-gradient-to-r',
                    getPlanGradient(plan.plan_key)
                  )} />

                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3 mb-3'>
                      <div className={cn(
                        'p-2.5 rounded-xl bg-gradient-to-r',
                        getPlanGradient(plan.plan_key)
                      )}>
                        <div className='text-white'>
                          {getPlanIcon(plan.plan_key)}
                        </div>
                      </div>
                      <CardTitle className='text-xl'>{plan.plan_name}</CardTitle>
                    </div>

                    <div className='space-y-1'>
                      <div className='flex items-baseline gap-1'>
                        <span className='text-4xl font-bold'>
                          TZS {plan.price_monthly.toLocaleString()}
                        </span>
                        <span className='text-muted-foreground text-sm'>/month</span>
                      </div>
                      {plan.price_yearly > 0 && (
                        <p className='text-xs text-muted-foreground flex items-center gap-1'>
                          <Gift className='h-3 w-3' />
                          Save TZS {((plan.price_monthly * 12) - plan.price_yearly).toLocaleString()}
                          with yearly billing
                        </p>
                      )}
                    </div>

                    <CardDescription className='text-sm pt-2'>
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className='space-y-6'>
                    {/* Credits Info */}
                    <div className='p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200/50 dark:border-amber-800/50'>
                      <div className='flex items-center gap-2'>
                        <Sparkles className='h-4 w-4 text-amber-600' />
                        <span className='font-semibold text-sm'>
                          {plan.plan_key === 'professional'
                            ? 'Unlimited AI Credits'
                            : `${plan.credits_monthly} AI Credits/month`
                          }
                        </span>
                      </div>
                    </div>

                    <Separator />

                    {/* Features List */}
                    <div className='space-y-3'>
                      <p className='text-sm font-semibold text-muted-foreground'>
                        What's included:
                      </p>
                      <ul className='space-y-2.5'>
                        {Object.entries(plan.features_included || {})
                          .filter(([_, enabled]) => enabled)
                          .slice(0, 6)
                          .map(([feature]) => (
                            <li key={feature} className='flex items-start gap-2 text-sm'>
                              <Check className='h-4 w-4 text-green-600 flex-shrink-0 mt-0.5' />
                              <span className='capitalize leading-tight'>
                                {feature.replace(/_/g, ' ')}
                              </span>
                            </li>
                          ))}
                        {Object.keys(plan.features_included || {}).length > 6 && (
                          <li className='text-xs text-muted-foreground pl-6'>
                            +{Object.keys(plan.features_included).length - 6} more features
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <Button
                      className={cn(
                        'w-full h-11 gap-2 font-semibold transition-all',
                        isCurrentPlan && 'opacity-50 cursor-not-allowed',
                        !isCurrentPlan && cn(
                          'bg-gradient-to-r hover:opacity-90 hover:scale-105',
                          getPlanGradient(plan.plan_key)
                        )
                      )}
                      onClick={() => !isCurrentPlan && handleUpgrade(plan.plan_key)}
                      disabled={isCurrentPlan || upgrading === plan.plan_key}
                    >
                      {upgrading === plan.plan_key ? (
                        <>
                          <RefreshCw className='h-4 w-4 animate-spin' />
                          Processing...
                        </>
                      ) : isCurrentPlan ? (
                        <>
                          <Check className='h-4 w-4' />
                          Current Plan
                        </>
                      ) : (
                        <>
                          Upgrade Now
                          <ArrowRight className='h-4 w-4' />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Payment Method Card */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <CreditCard className='h-5 w-5' />
            Payment Method
          </CardTitle>
          <CardDescription>
            Manage your payment methods securely through Stripe
          </CardDescription>
        </CardHeader>
        <CardContent>
          {planType !== 'free' ? (
            <Button
              variant='outline'
              onClick={handleManageSubscription}
              className='gap-2'
            >
              <CreditCard className='h-4 w-4' />
              Manage Payment Method
            </Button>
          ) : (
            <div className='p-8 border-2 border-dashed rounded-lg text-center space-y-3 bg-muted/30'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted'>
                <CreditCard className='h-6 w-6 text-muted-foreground' />
              </div>
              <div>
                <p className='font-medium text-muted-foreground'>
                  No payment method added
                </p>
                <p className='text-xs text-muted-foreground mt-1'>
                  Upgrade to a paid plan to add a payment method
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trust Badges */}
      <div className='flex items-center justify-center gap-8 py-6 border-t'>
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
