import { supabase } from '@/integrations/supabase/client';

export interface SnippePaymentInit {
  success: boolean;
  paymentId: string;
  reference: string;
  transactionId: string;
  message: string;
  status: string;
  error?: string;
}

export interface SnippePaymentStatus {
  success: boolean;
  status: string;
  payment: {
    id: string;
    reference: string;
    amount: number;
    currency: string;
    status: string;
    phone_number: string;
    mobile_provider: string | null;
    created_at: string;
    completed_at: string | null;
  };
  error?: string;
}

export const snippePaymentService = {
  /**
   * Initialize Snipe.sh mobile money payment
   */
  async initializePayment(
    userId: string,
    planKey: string,
    billingPeriod: 'monthly' | 'yearly',
    phoneNumber: string
  ): Promise<SnippePaymentInit> {
    const { data, error } = await supabase.functions.invoke('snippe-init-payment', {
      body: {
        userId,
        planKey,
        billingPeriod,
        phoneNumber,
      },
    });

    if (error) {
      throw new Error(error.message || 'Failed to initialize payment');
    }

    return data;
  },

  /**
   * Check payment status
   */
  async checkPaymentStatus(paymentId: string): Promise<SnippePaymentStatus> {
    const { data, error } = await supabase.functions.invoke('snippe-check-status', {
      body: {
        paymentId,
      },
    });

    if (error) {
      throw new Error(error.message || 'Failed to check payment status');
    }

    return data;
  },

  /**
   * Get user's Snipe.sh payment history
   */
  async getPaymentHistory(userId: string, limit = 20) {
    const { data, error } = await supabase
      .from('snippe_payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  /**
   * Get active Snipe.sh subscription
   */
  async getActiveSubscription(userId: string) {
    const { data, error } = await supabase
      .rpc('get_active_snippe_subscription', {
        p_user_id: userId
      });

    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  },

  /**
   * Validate Tanzanian phone number
   */
  validatePhoneNumber(phone: string): { valid: boolean; formatted?: string; error?: string } {
    // Remove spaces and special characters
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');

    // Handle different formats
    if (cleaned.startsWith('0')) {
      // Convert 0712345678 to 255712345678
      cleaned = '255' + cleaned.substring(1);
    } else if (cleaned.startsWith('+255')) {
      // Convert +255712345678 to 255712345678
      cleaned = cleaned.substring(1);
    } else if (!cleaned.startsWith('255')) {
      return { valid: false, error: 'Phone number must be a valid Tanzanian number' };
    }

    // Validate format: 255 followed by 6XX or 7XX (9 digits total after 255)
    const regex = /^255[67]\d{8}$/;
    if (!regex.test(cleaned)) {
      return { valid: false, error: 'Invalid Tanzanian phone number format. Must start with 255 6XX or 7XX' };
    }

    return { valid: true, formatted: cleaned };
  },

  /**
   * Format phone number for display
   */
  formatPhoneNumberDisplay(phone: string): string {
    if (!phone) return '';

    // Remove 255 prefix for display
    if (phone.startsWith('255')) {
      const local = '0' + phone.substring(3);
      // Format as 0712 345 678
      return local.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
    }

    return phone;
  }
};
