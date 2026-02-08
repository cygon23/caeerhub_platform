import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Phone,
  Clock,
} from "lucide-react";
import { snippePaymentService } from '@/services/snippePaymentService';
import { useToast } from '@/hooks/use-toast';

interface MobileMoneyCheckoutProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  userId: string;
  planKey: string;
  planName: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
}

type PaymentStatus = 'idle' | 'processing' | 'pending' | 'completed' | 'failed';

export const MobileMoneyCheckout = ({
  open,
  onClose,
  onBack,
  userId,
  planKey,
  planName,
  price,
  billingPeriod,
}: MobileMoneyCheckoutProps) => {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);

  // Poll payment status when pending
  useEffect(() => {
    if (status !== 'pending' || !paymentId) return;

    const pollInterval = setInterval(async () => {
      try {
        const result = await snippePaymentService.checkPaymentStatus(paymentId);

        if (result.payment.status === 'completed') {
          setStatus('completed');
          toast({
            title: '✅ Payment Successful!',
            description: 'Your subscription has been activated.',
          });

          // Redirect after 2 seconds
          setTimeout(() => {
            window.location.href = '/dashboard/youth?success=true';
          }, 2000);
        } else if (result.payment.status === 'failed') {
          setStatus('failed');
          toast({
            title: 'Payment Failed',
            description: 'The payment could not be completed. Please try again.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [status, paymentId, toast]);

  const validatePhone = (phone: string) => {
    const validation = snippePaymentService.validatePhoneNumber(phone);
    if (!validation.valid) {
      setPhoneError(validation.error || 'Invalid phone number');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    if (value) {
      validatePhone(value);
    } else {
      setPhoneError('');
    }
  };

  const handlePayment = async () => {
    if (!validatePhone(phoneNumber)) {
      return;
    }

    setStatus('processing');

    try {
      const result = await snippePaymentService.initializePayment(
        userId,
        planKey,
        billingPeriod,
        phoneNumber
      );

      if (result.success) {
        setPaymentId(result.paymentId);
        setPaymentReference(result.reference);
        setStatus('pending');

        toast({
          title: '📱 Payment Initiated',
          description: result.message,
        });
      } else {
        throw new Error(result.error || 'Failed to initialize payment');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setStatus('failed');
      toast({
        title: 'Payment Failed',
        description: error.message || 'Failed to initialize payment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    if (status === 'pending') {
      // Show confirmation before canceling pending payment
      if (!confirm('Payment is in progress. Are you sure you want to cancel?')) {
        return;
      }
    }
    setStatus('idle');
    setPhoneNumber('');
    setPhoneError('');
    setPaymentId(null);
    setPaymentReference(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='text-2xl flex items-center gap-2'>
            <Smartphone className='h-6 w-6 text-green-600' />
            Mobile Money Payment
          </DialogTitle>
          <DialogDescription>
            Pay securely using your mobile money account
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          {/* Plan Summary */}
          <Card className='bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200'>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>Plan</p>
                  <p className='text-lg font-bold'>{planName}</p>
                  <p className='text-xs text-muted-foreground capitalize'>{billingPeriod} billing</p>
                </div>
                <div className='text-right'>
                  <p className='text-2xl font-bold text-green-600'>TSh {price.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status-based content */}
          {status === 'idle' && (
            <>
              {/* Phone Number Input */}
              <div className='space-y-2'>
                <Label htmlFor='phone'>Mobile Money Number</Label>
                <div className='relative'>
                  <Phone className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='phone'
                    type='tel'
                    placeholder='0712345678 or 255712345678'
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    className={`pl-9 ${phoneError ? 'border-red-500' : ''}`}
                    disabled={status !== 'idle'}
                  />
                </div>
                {phoneError && (
                  <p className='text-sm text-red-500 flex items-center gap-1'>
                    <AlertCircle className='h-3 w-3' />
                    {phoneError}
                  </p>
                )}
                <p className='text-xs text-muted-foreground'>
                  Supported networks: M-Pesa, Airtel Money, Tigo Pesa, Halopesa
                </p>
              </div>

              {/* Action Buttons */}
              <div className='flex gap-3 pt-4'>
                <Button
                  variant='outline'
                  onClick={onBack}
                  className='gap-2'
                >
                  <ArrowLeft className='h-4 w-4' />
                  Back
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={!phoneNumber || !!phoneError}
                  className='flex-1 gap-2 bg-green-600 hover:bg-green-700'
                >
                  Pay TSh {price.toLocaleString()}
                </Button>
              </div>
            </>
          )}

          {status === 'processing' && (
            <div className='py-8 text-center space-y-4'>
              <Loader2 className='h-12 w-12 animate-spin mx-auto text-primary' />
              <p className='text-sm text-muted-foreground'>Initializing payment...</p>
            </div>
          )}

          {status === 'pending' && (
            <div className='space-y-4'>
              <Alert className='border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20'>
                <Clock className='h-4 w-4 text-yellow-600' />
                <AlertDescription className='text-yellow-900 dark:text-yellow-100'>
                  <strong>Check your phone!</strong>
                  <br />
                  You should receive a payment prompt on <strong>{snippePaymentService.formatPhoneNumberDisplay(phoneNumber)}</strong>
                </AlertDescription>
              </Alert>

              <div className='space-y-3 py-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center'>
                    <Loader2 className='h-4 w-4 animate-spin text-green-600' />
                  </div>
                  <div>
                    <p className='font-medium'>Waiting for payment confirmation</p>
                    <p className='text-xs text-muted-foreground'>Reference: {paymentReference}</p>
                  </div>
                </div>

                <Card className='bg-muted/50'>
                  <CardContent className='p-4 text-sm space-y-2'>
                    <p className='font-medium'>Next steps:</p>
                    <ol className='list-decimal list-inside space-y-1 text-muted-foreground'>
                      <li>Open your mobile money app</li>
                      <li>Approve the payment request</li>
                      <li>Enter your PIN to complete</li>
                    </ol>
                  </CardContent>
                </Card>
              </div>

              <Button
                variant='outline'
                onClick={handleCancel}
                className='w-full'
              >
                Cancel Payment
              </Button>
            </div>
          )}

          {status === 'completed' && (
            <div className='py-8 text-center space-y-4'>
              <div className='w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto'>
                <CheckCircle2 className='h-10 w-10 text-green-600' />
              </div>
              <div>
                <h3 className='text-xl font-bold text-green-600 mb-2'>Payment Successful!</h3>
                <p className='text-sm text-muted-foreground'>
                  Your subscription has been activated. Redirecting...
                </p>
              </div>
            </div>
          )}

          {status === 'failed' && (
            <div className='space-y-4'>
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>
                  Payment could not be completed. Please try again or use a different payment method.
                </AlertDescription>
              </Alert>

              <div className='flex gap-3'>
                <Button
                  variant='outline'
                  onClick={handleCancel}
                  className='flex-1'
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setStatus('idle');
                    setPaymentId(null);
                    setPaymentReference(null);
                  }}
                  className='flex-1'
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Security Badge */}
          {status === 'idle' && (
            <div className='flex items-center justify-center gap-2 pt-4 border-t'>
              <Badge variant='outline' className='text-xs'>
                <CheckCircle2 className='h-3 w-3 mr-1 text-green-600' />
                Secure Payment
              </Badge>
              <Badge variant='outline' className='text-xs'>
                Powered by Snipe.sh
              </Badge>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
