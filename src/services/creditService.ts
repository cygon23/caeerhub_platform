import { supabase } from '@/integrations/supabase/client';

export interface CreditCheck {
  canUse: boolean;
  reason: string;
  creditsAvailable: number;
  creditsRequired: number;
  usageCount: number;
  usageLimit: number | null;
}

export const creditService = {
  /**
   * Check if user can use a feature
   */
  async canUseFeature(userId: string, featureKey: string): Promise<CreditCheck> {
    const { data, error } = await supabase.rpc('can_use_feature', {
      p_user_id: userId,
      p_feature_key: featureKey,
    });

    if (error) throw error;
    return data[0];
  },

  /**
   * Deduct credits after using a feature
   */
  async deductCredits(
    userId: string,
    featureKey: string,
    referenceId?: string,
    referenceTable?: string,
    metadata?: Record<string, any>
  ): Promise<{ success: boolean; newBalance: number; transactionId: string }> {
    const { data, error } = await supabase.rpc('deduct_credits', {
      p_user_id: userId,
      p_feature_key: featureKey,
      p_reference_id: referenceId || null,
      p_reference_table: referenceTable || null,
      p_metadata: metadata || {},
    });

    if (error) throw error;
    return data[0];
  },

  /**
   * Get current credit balance
   */
  async getBalance(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('billing_settings')
      .select('ai_credits_remaining')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data.ai_credits_remaining;
  },

  /**
   * Get credit transaction history
   */
  async getTransactions(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  /**
   * Get subscription info
   */
  async getSubscription(userId: string) {
    const { data, error } = await supabase
      .from('billing_settings')
      .select('*, subscription_plans(*)')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create Stripe checkout session
   */
  async createCheckoutSession(userId: string, planKey: string) {
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        userId,
        planKey,
        successUrl: `${window.location.origin}/dashboard/youth?success=true`,
        cancelUrl: `${window.location.origin}/dashboard/youth?cancelled=true`,
      },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Create Stripe portal session (manage billing)
   */
  async createPortalSession(userId: string) {
    const { data, error } = await supabase.functions.invoke('create-portal-session', {
      body: {
        userId,
        returnUrl: `${window.location.origin}/dashboard/youth`,
      },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Purchase credits (one-time)
   */
  async purchaseCredits(userId: string, creditAmount: number) {
    const { data, error } = await supabase.functions.invoke('purchase-credits', {
      body: {
        userId,
        creditAmount,
        successUrl: `${window.location.origin}/dashboard/youth?purchase_success=true`,
        cancelUrl: `${window.location.origin}/dashboard/youth?purchase_cancelled=true`,
      },
    });

    if (error) throw error;
    return data;
  },
};
