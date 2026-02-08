import { supabase } from '@/integrations/supabase/client';

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  category: string | null;
  message_count: number;
  created_at: string;
  updated_at: string;
  last_message_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  user_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: any;
  created_at: string;
}

export interface KnowledgeUpload {
  id: string;
  user_id: string;
  session_id: string | null;
  file_name: string;
  file_type: 'pdf' | 'image';
  file_size: number;
  storage_path: string;
  status: 'uploaded' | 'processing' | 'processed' | 'failed';
  extracted_text: string | null;
  created_at: string;
}

export interface SendMessageParams {
  sessionId?: string;
  message: string;
  category?: string;
  fileContext?: string;
}

export interface UploadLimitCheck {
  can_upload: boolean;
  count_today: number;
  limit_per_day: number;
}

class AIKnowledgeChatService {
  /**
   * Send a message to the AI and get a response
   */
  async sendMessage(params: SendMessageParams): Promise<{
    success: boolean;
    sessionId: string;
    message: string;
    error?: string;
  }> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token || !session.user) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase.functions.invoke('ai-knowledge-chat', {
      body: {
        sessionId: params.sessionId,
        message: params.message,
        userId: session.user.id,
        category: params.category,
        fileContext: params.fileContext,
      },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      throw new Error(error.message || 'Failed to send message');
    }

    if (!data?.success) {
      throw new Error(data?.error || 'Failed to send message');
    }

    return data;
  }

  /**
   * Get all chat sessions for the current user
   */
  async getSessions(): Promise<ChatSession[]> {
    const { data, error } = await supabase
      .from('ai_chat_sessions')
      .select('*')
      .order('last_message_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get messages for a specific session
   */
  async getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('ai_chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Rename a chat session
   */
  async renameSession(sessionId: string, newTitle: string): Promise<void> {
    const { error } = await supabase
      .from('ai_chat_sessions')
      .update({ title: newTitle })
      .eq('id', sessionId);

    if (error) throw error;
  }

  /**
   * Delete a chat session (cascade deletes messages)
   */
  async deleteSession(sessionId: string): Promise<void> {
    const { error } = await supabase
      .from('ai_chat_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) throw error;
  }

  /**
   * Check if user can upload a file today
   */
  async checkUploadLimit(fileType: 'pdf' | 'image'): Promise<UploadLimitCheck> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .rpc('check_daily_upload_limit', {
        p_user_id: user.id,
        p_file_type: fileType
      })
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Upload a knowledge file (PDF or image)
   */
  async uploadKnowledgeFile(
    file: File,
    sessionId?: string
  ): Promise<KnowledgeUpload> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    // Determine file type
    const fileType: 'pdf' | 'image' = file.type === 'application/pdf' ? 'pdf' : 'image';

    // Check daily limit
    const limitCheck = await this.checkUploadLimit(fileType);
    if (!limitCheck.can_upload) {
      throw new Error(
        `Daily limit reached. You can only upload ${limitCheck.limit_per_day} ${fileType} files per day. You've already uploaded ${limitCheck.count_today} today.`
      );
    }

    // Generate unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${crypto.randomUUID()}.${fileExt}`;

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('ai-knowledge-uploads')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Create database record
    const { data: uploadRecord, error: recordError } = await supabase
      .from('ai_knowledge_uploads')
      .insert({
        user_id: user.id,
        session_id: sessionId || null,
        file_name: file.name,
        file_type: fileType,
        file_size: file.size,
        storage_path: uploadData.path,
        status: 'uploaded',
      })
      .select()
      .single();

    if (recordError) throw recordError;

    return uploadRecord;
  }

  /**
   * Get user's uploads for today
   */
  async getTodaysUploads(): Promise<{
    pdfs: number;
    images: number;
  }> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('ai_knowledge_uploads')
      .select('file_type')
      .eq('user_id', user.id)
      .gte('created_at', today);

    if (error) throw error;

    const pdfs = (data || []).filter(u => u.file_type === 'pdf').length;
    const images = (data || []).filter(u => u.file_type === 'image').length;

    return { pdfs, images };
  }

  /**
   * Get session uploads
   */
  async getSessionUploads(sessionId: string): Promise<KnowledgeUpload[]> {
    const { data, error } = await supabase
      .from('ai_knowledge_uploads')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Delete an upload
   */
  async deleteUpload(uploadId: string, storagePath: string): Promise<void> {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('ai-knowledge-uploads')
      .remove([storagePath]);

    if (storageError) {
      console.error('Storage deletion error:', storageError);
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('ai_knowledge_uploads')
      .delete()
      .eq('id', uploadId);

    if (dbError) throw dbError;
  }
}

export const aiKnowledgeChatService = new AIKnowledgeChatService();
