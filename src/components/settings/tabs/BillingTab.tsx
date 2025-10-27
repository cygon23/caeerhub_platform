// components/settings/tabs/BillingTab.tsx
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
import { Check, X, Crown, Zap, Sparkles, CreditCard } from "lucide-react";

interface BillingTabProps {
  planType: string;
  aiCreditsRemaining: number;
}

export const BillingTab = ({
  planType,
  aiCreditsRemaining,
}: BillingTabProps) => {
  const maxCredits =
    planType === "free" ? 100 : planType === "pro" ? 500 : "Unlimited";
  const isMaxPlan = planType === "max";

  return (
    <div className='space-y-6'>
      {/* Current Plan Card */}
      <Card className='border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                Current Plan
                {planType === "free" && (
                  <Badge variant='secondary' className='capitalize'>
                    {planType}
                  </Badge>
                )}
                {planType === "pro" && (
                  <Badge className='bg-gradient-to-r from-blue-600 to-purple-600 text-white capitalize'>
                    {planType}
                  </Badge>
                )}
                {planType === "max" && (
                  <Badge className='bg-gradient-to-r from-purple-600 to-pink-600 text-white capitalize'>
                    {planType}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {planType === "free" && "Get started with basic features"}
                {planType === "pro" && "Unlock advanced AI features"}
                {planType === "max" && "Ultimate career acceleration"}
              </CardDescription>
            </div>
            {planType !== "free" && (
              <Button variant='outline' size='sm'>
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
                      width: `${
                        planType === "free"
                          ? aiCreditsRemaining
                          : (aiCreditsRemaining / 500) * 100
                      }%`,
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
                {planType !== "free" && (
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
                {planType === "max" && (
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
                      <span>Unlimited Everything</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Plans */}
      {planType === "free" && (
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
            {/* PRO PLAN */}
            <Card className='relative border-2 border-blue-500/20 hover:border-blue-500/40 transition-all hover:shadow-lg'>
              <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
                <Badge className='bg-gradient-to-r from-blue-600 to-purple-600 text-white'>
                  Most Popular
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Zap className='h-5 w-5 text-blue-600' />
                  Pro Plan
                </CardTitle>
                <div className='flex items-baseline gap-1'>
                  <span className='text-3xl font-bold'>TZS 29,000</span>
                  <span className='text-muted-foreground'>/month</span>
                </div>
                <CardDescription>
                  Perfect for serious job seekers
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-green-600 flex-shrink-0' />
                    <span>500 AI Credits/month</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-green-600 flex-shrink-0' />
                    <span>Advanced Career Insights</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-green-600 flex-shrink-0' />
                    <span>Professional Resume Builder</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-green-600 flex-shrink-0' />
                    <span>Priority Job Matching</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-green-600 flex-shrink-0' />
                    <span>Email Support</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-green-600 flex-shrink-0' />
                    <span>Monthly Career Report</span>
                  </li>
                </ul>
                <Button className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90'>
                  <Crown className='h-4 w-4 mr-2' />
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>

            {/* MAX PLAN */}
            <Card className='relative border-2 border-purple-500/20 hover:border-purple-500/40 transition-all hover:shadow-lg'>
              <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
                <Badge className='bg-gradient-to-r from-purple-600 to-pink-600 text-white'>
                  Ultimate
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Crown className='h-5 w-5 text-purple-600' />
                  Max Plan
                </CardTitle>
                <div className='flex items-baseline gap-1'>
                  <span className='text-3xl font-bold'>TZS 79,000</span>
                  <span className='text-muted-foreground'>/month</span>
                </div>
                <CardDescription>For career acceleration</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-green-600 flex-shrink-0' />
                    <span className='font-medium'>
                      Everything in Pro, plus:
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-green-600 flex-shrink-0' />
                    <span>Unlimited AI Credits</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-green-600 flex-shrink-0' />
                    <span>1-on-1 Career Coaching (2hrs/month)</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-green-600 flex-shrink-0' />
                    <span>Interview Preparation Sessions</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-green-600 flex-shrink-0' />
                    <span>Direct Mentor Access</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-green-600 flex-shrink-0' />
                    <span>Priority Customer Support</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-green-600 flex-shrink-0' />
                    <span>Weekly Career Check-ins</span>
                  </li>
                </ul>
                <Button className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90'>
                  <Sparkles className='h-4 w-4 mr-2' />
                  Upgrade to Max
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Feature Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Compare Plans</CardTitle>
              <CardDescription>
                Choose the plan that fits your career goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead>
                    <tr className='border-b'>
                      <th className='text-left py-3 font-medium'>Feature</th>
                      <th className='text-center py-3 font-medium'>Free</th>
                      <th className='text-center py-3 font-medium'>Pro</th>
                      <th className='text-center py-3 font-medium'>Max</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y'>
                    <tr>
                      <td className='py-3'>AI Credits/month</td>
                      <td className='text-center'>100</td>
                      <td className='text-center'>500</td>
                      <td className='text-center'>
                        <Badge variant='secondary'>Unlimited</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className='py-3'>Career Assessment</td>
                      <td className='text-center'>
                        <Check className='h-4 w-4 text-green-600 mx-auto' />
                      </td>
                      <td className='text-center'>
                        <Check className='h-4 w-4 text-green-600 mx-auto' />
                      </td>
                      <td className='text-center'>
                        <Check className='h-4 w-4 text-green-600 mx-auto' />
                      </td>
                    </tr>
                    <tr>
                      <td className='py-3'>Job Matching</td>
                      <td className='text-center'>Basic</td>
                      <td className='text-center'>Advanced</td>
                      <td className='text-center'>Priority</td>
                    </tr>
                    <tr>
                      <td className='py-3'>Resume Builder</td>
                      <td className='text-center'>
                        <X className='h-4 w-4 text-red-500 mx-auto' />
                      </td>
                      <td className='text-center'>
                        <Check className='h-4 w-4 text-green-600 mx-auto' />
                      </td>
                      <td className='text-center'>
                        <Check className='h-4 w-4 text-green-600 mx-auto' />
                      </td>
                    </tr>
                    <tr>
                      <td className='py-3'>Career Coaching</td>
                      <td className='text-center'>
                        <X className='h-4 w-4 text-red-500 mx-auto' />
                      </td>
                      <td className='text-center'>
                        <X className='h-4 w-4 text-red-500 mx-auto' />
                      </td>
                      <td className='text-center'>2hrs/month</td>
                    </tr>
                    <tr>
                      <td className='py-3'>Interview Prep</td>
                      <td className='text-center'>
                        <X className='h-4 w-4 text-red-500 mx-auto' />
                      </td>
                      <td className='text-center'>
                        <X className='h-4 w-4 text-red-500 mx-auto' />
                      </td>
                      <td className='text-center'>
                        <Check className='h-4 w-4 text-green-600 mx-auto' />
                      </td>
                    </tr>
                    <tr>
                      <td className='py-3'>Support</td>
                      <td className='text-center'>Community</td>
                      <td className='text-center'>Email</td>
                      <td className='text-center'>Priority</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payment Method (Coming Soon) */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            Payment Method
            <Badge variant='secondary' className='text-xs'>
              Stripe Integration Coming Soon
            </Badge>
          </CardTitle>
          <CardDescription>Manage your payment methods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='p-6 border-2 border-dashed rounded-lg text-center space-y-2'>
            <CreditCard className='h-8 w-8 text-muted-foreground mx-auto' />
            <p className='text-sm text-muted-foreground'>
              No payment method added
            </p>
            <p className='text-xs text-muted-foreground'>
              Stripe integration coming soon. You'll be able to pay with M-Pesa,
              Tigo Pesa, or Credit Card.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Billing History (Coming Soon) */}
      {planType !== "free" && (
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>
              View your past invoices and payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='p-6 border-2 border-dashed rounded-lg text-center'>
              <p className='text-sm text-muted-foreground'>
                No billing history yet
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
