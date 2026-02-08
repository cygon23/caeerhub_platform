import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  Globe,
  MapPin,
} from "lucide-react";

interface PaymentMethodSelectorProps {
  open: boolean;
  onClose: () => void;
  planName: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  onSelectStripe: () => void;
  onSelectMobileMoney: () => void;
}

export const PaymentMethodSelector = ({
  open,
  onClose,
  planName,
  price,
  billingPeriod,
  onSelectStripe,
  onSelectMobileMoney,
}: PaymentMethodSelectorProps) => {
  const [selectedMethod, setSelectedMethod] = useState<'stripe' | 'mobile' | null>(null);

  const handleContinue = () => {
    if (selectedMethod === 'stripe') {
      onSelectStripe();
    } else if (selectedMethod === 'mobile') {
      onSelectMobileMoney();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>Choose Payment Method</DialogTitle>
          <DialogDescription className='text-base'>
            Select how you'd like to pay for your <strong>{planName}</strong> plan
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          {/* Plan Summary */}
          <Card className='bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20'>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>Selected Plan</p>
                  <p className='text-lg font-bold'>{planName}</p>
                </div>
                <div className='text-right'>
                  <p className='text-2xl font-bold'>TSh {price.toLocaleString()}</p>
                  <p className='text-sm text-muted-foreground'>per {billingPeriod === 'monthly' ? 'month' : 'year'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Credit Card (Stripe) */}
            <Card
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedMethod === 'stripe'
                  ? 'border-2 border-primary ring-2 ring-primary/20 bg-primary/5'
                  : 'border-2 border-transparent hover:border-primary/50'
              }`}
              onClick={() => setSelectedMethod('stripe')}
            >
              <CardContent className='p-6'>
                <div className='space-y-4'>
                  {/* Icon & Title */}
                  <div className='flex items-start justify-between'>
                    <div className='p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl'>
                      <CreditCard className='h-6 w-6 text-blue-600' />
                    </div>
                    {selectedMethod === 'stripe' && (
                      <CheckCircle2 className='h-6 w-6 text-primary' />
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className='font-semibold text-lg mb-1'>Credit / Debit Card</h3>
                    <p className='text-xs text-muted-foreground flex items-center gap-1'>
                      <Globe className='h-3 w-3' />
                      International payments
                    </p>
                  </div>

                  {/* Features */}
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                      <CheckCircle2 className='h-3 w-3 text-green-600' />
                      Visa, Mastercard, Amex
                    </div>
                    <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                      <CheckCircle2 className='h-3 w-3 text-green-600' />
                      Secure 3D payment
                    </div>
                    <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                      <CheckCircle2 className='h-3 w-3 text-green-600' />
                      Instant activation
                    </div>
                  </div>

                  {/* Powered by */}
                  <div className='pt-2 border-t'>
                    <Badge variant='outline' className='text-xs'>
                      Powered by Stripe
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Money (Snipe.sh) */}
            <Card
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedMethod === 'mobile'
                  ? 'border-2 border-primary ring-2 ring-primary/20 bg-primary/5'
                  : 'border-2 border-transparent hover:border-primary/50'
              }`}
              onClick={() => setSelectedMethod('mobile')}
            >
              <CardContent className='p-6'>
                <div className='space-y-4'>
                  {/* Icon & Title */}
                  <div className='flex items-start justify-between'>
                    <div className='p-3 bg-green-100 dark:bg-green-900/30 rounded-xl'>
                      <Smartphone className='h-6 w-6 text-green-600' />
                    </div>
                    {selectedMethod === 'mobile' && (
                      <CheckCircle2 className='h-6 w-6 text-primary' />
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className='font-semibold text-lg mb-1'>Mobile Money</h3>
                    <p className='text-xs text-muted-foreground flex items-center gap-1'>
                      <MapPin className='h-3 w-3' />
                      Tanzania only
                    </p>
                  </div>

                  {/* Features */}
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                      <CheckCircle2 className='h-3 w-3 text-green-600' />
                      M-Pesa, Airtel, Tigo, Halo
                    </div>
                    <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                      <CheckCircle2 className='h-3 w-3 text-green-600' />
                      Pay from your phone
                    </div>
                    <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                      <CheckCircle2 className='h-3 w-3 text-green-600' />
                      No card required
                    </div>
                  </div>

                  {/* Powered by */}
                  <div className='pt-2 border-t'>
                    <Badge variant='outline' className='text-xs bg-green-50 dark:bg-green-900/20'>
                      Powered by Snipe.sh
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3 pt-4'>
            <Button
              variant='outline'
              onClick={onClose}
              className='flex-1'
            >
              Cancel
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!selectedMethod}
              className='flex-1 gap-2'
            >
              Continue
              <ArrowRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
