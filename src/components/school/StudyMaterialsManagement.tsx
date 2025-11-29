import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import {
  Upload,
  Video,
  FileText,
  Link as LinkIcon,
  Play,
  Download,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Clock,
  Users,
  CheckCircle,
  X,
  Loader2,
  ExternalLink,
  File,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface StudyMaterial {
  id: string;
  school_id: string;
  title: string;
  description?: string;
  type: 'video' | 'document' | 'link';
  subject: string;
  form_level: number;
  file_url: string;
  thumbnail_url?: string;
  file_size?: number;
  duration?: number;
  video_source?: 'upload' | 'youtube' | 'vimeo' | 'external';
  tags?: string[];
  views_count: number;
  downloads_count: number;
  created_at: string;
}

interface StudyMaterialsManagementProps {
  schoolInfo?: {
    registration_number?: string;
    primary_color?: string;
    secondary_color?: string;
  };
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export default function StudyMaterialsManagement({ schoolInfo }: StudyMaterialsManagementProps) {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadType, setUploadType] = useState<"video" | "document" | "link">("video");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Modals
  const [playVideoDialog, setPlayVideoDialog] = useState<StudyMaterial | null>(null);
  const [editDialog, setEditDialog] = useState<StudyMaterial | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<StudyMaterial | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const primaryColor = schoolInfo?.primary_color || '#FE047F';
  const secondaryColor = schoolInfo?.secondary_color || '#006807';
  const schoolId = schoolInfo?.registration_number || 'TRD-009890';

  const [materialForm, setMaterialForm] = useState({
    title: "",
    description: "",
    subject: "",
    form_level: "",
    file_url: "",
    thumbnail_url: "",
    duration: "",
    tags: "",
  });

  useEffect(() => {
    loadMaterials();
  }, [schoolId]);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('school_study_materials')
        .select('*')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load materials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMaterialForm({
      title: "",
      description: "",
      subject: "",
      form_level: "",
      file_url: "",
      thumbnail_url: "",
      duration: "",
      tags: "",
    });
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const validateFile = (file: File): string | null => {
    if (uploadType === 'document' && file.size > MAX_FILE_SIZE) {
      return `File size exceeds 50MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`;
    }

    const allowedTypes = uploadType === 'video'
      ? ['video/mp4', 'video/webm', 'video/ogg']
      : ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];

    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type. Allowed types: ${uploadType === 'video' ? 'MP4, WebM, OGG' : 'PDF, DOCX, PPTX'}`;
    }

    return null;
  };

  const uploadFile = async (file: File): Promise<string> => {
    const bucket = uploadType === 'video' ? 'study-materials-videos' : 'study-materials-documents';
    const fileExt = file.name.split('.').pop();
    const fileName = `${schoolId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        onUploadProgress: (progress) => {
          const percent = (progress.loaded / progress.total) * 100;
          setUploadProgress(Math.round(percent));
        }
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const handleUpload = async () => {
    if (!materialForm.title || !materialForm.subject || !materialForm.form_level) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (uploadType !== 'link' && !selectedFile) {
      toast({
        title: "Validation Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    if (uploadType === 'link' && !materialForm.file_url) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    if (selectedFile) {
      const validationError = validateFile(selectedFile);
      if (validationError) {
        toast({
          title: "File Validation Error",
          description: validationError,
          variant: "destructive",
        });
        return;
      }
    }

    setUploading(true);

    try {
      let fileUrl = materialForm.file_url;
      let videoSource: 'upload' | 'youtube' | 'external' | undefined = undefined;

      if (uploadType === 'link') {
        // Detect video source from URL
        if (fileUrl.includes('youtube.com') || fileUrl.includes('youtu.be')) {
          videoSource = 'youtube';
        } else {
          videoSource = 'external';
        }
      } else if (selectedFile) {
        fileUrl = await uploadFile(selectedFile);
        if (uploadType === 'video') {
          videoSource = 'upload';
        }
      }

      const { error } = await supabase.from('school_study_materials').insert({
        school_id: schoolId,
        title: materialForm.title,
        description: materialForm.description,
        type: uploadType,
        subject: materialForm.subject,
        form_level: parseInt(materialForm.form_level),
        file_url: fileUrl,
        file_size: selectedFile?.size,
        video_source: videoSource,
        tags: materialForm.tags ? materialForm.tags.split(',').map(t => t.trim()) : [],
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Material uploaded successfully",
      });

      setUploadDialogOpen(false);
      resetForm();
      loadMaterials();
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload material",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog) return;

    try {
      // Delete file from storage if it's an upload
      if (deleteDialog.type !== 'link' && !deleteDialog.file_url.includes('youtube')) {
        const bucket = deleteDialog.type === 'video' ? 'study-materials-videos' : 'study-materials-documents';
        const path = deleteDialog.file_url.split('/').slice(-2).join('/');
        await supabase.storage.from(bucket).remove([path]);
      }

      const { error } = await supabase
        .from('school_study_materials')
        .delete()
        .eq('id', deleteDialog.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Material deleted successfully",
      });

      setDeleteDialog(null);
      loadMaterials();
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete material",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    if (!editDialog) return;

    try {
      const { error } = await supabase
        .from('school_study_materials')
        .update({
          title: materialForm.title,
          description: materialForm.description,
          subject: materialForm.subject,
          form_level: parseInt(materialForm.form_level),
          tags: materialForm.tags ? materialForm.tags.split(',').map(t => t.trim()) : [],
        })
        .eq('id', editDialog.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Material updated successfully",
      });

      setEditDialog(null);
      resetForm();
      loadMaterials();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update material",
        variant: "destructive",
      });
    }
  };

  const stats = {
    videos: materials.filter(m => m.type === 'video').length,
    documents: materials.filter(m => m.type === 'document').length,
    totalViews: materials.reduce((acc, m) => acc + m.views_count, 0),
    totalDuration: materials.filter(m => m.duration).reduce((acc, m) => acc + (m.duration || 0), 0),
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="text-white rounded-lg p-6 md:p-8 shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Study Materials Library</h2>
            <p className="text-white/90">Manage videos, documents, and learning resources</p>
          </div>
          <Video className="h-12 w-12 opacity-50" />
        </div>
      </div>

      {/* Quick Upload Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          onClick={() => {
            setUploadType("video");
            setUploadDialogOpen(true);
          }}
          className="h-24 flex flex-col items-center justify-center space-y-2 text-white hover:opacity-90 transition-opacity"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
          }}
        >
          <Video className="h-8 w-8" />
          <span className="font-semibold">Upload Video</span>
        </Button>
        <Button
          onClick={() => {
            setUploadType("document");
            setUploadDialogOpen(true);
          }}
          variant="outline"
          className="h-24 flex flex-col items-center justify-center space-y-2 hover:shadow-lg transition-all border-2"
          style={{
            borderColor: primaryColor,
            color: primaryColor
          }}
        >
          <FileText className="h-8 w-8" />
          <span className="font-semibold">Upload Document</span>
        </Button>
        <Button
          onClick={() => {
            setUploadType("link");
            setUploadDialogOpen(true);
          }}
          variant="outline"
          className="h-24 flex flex-col items-center justify-center space-y-2 hover:shadow-lg transition-all border-2"
          style={{
            borderColor: secondaryColor,
            color: secondaryColor
          }}
        >
          <LinkIcon className="h-8 w-8" />
          <span className="font-semibold">Add Link</span>
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 md:p-6 text-center">
            <Video className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2" style={{ color: primaryColor }} />
            <div className="text-2xl md:text-3xl font-bold" style={{ color: primaryColor }}>
              {stats.videos}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Videos</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 md:p-6 text-center">
            <FileText className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2" style={{ color: secondaryColor }} />
            <div className="text-2xl md:text-3xl font-bold" style={{ color: secondaryColor }}>
              {stats.documents}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Documents</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 md:p-6 text-center">
            <Users className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2" style={{ color: primaryColor }} />
            <div className="text-2xl md:text-3xl font-bold" style={{ color: primaryColor }}>
              {stats.totalViews}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Total Views</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 md:p-6 text-center">
            <Clock className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2" style={{ color: secondaryColor }} />
            <div className="text-2xl md:text-3xl font-bold" style={{ color: secondaryColor }}>
              {formatDuration(stats.totalDuration)}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Total Duration</div>
          </CardContent>
        </Card>
      </div>

      {/* Materials Library */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <File className="h-5 w-5" style={{ color: primaryColor }} />
                Materials Library
              </CardTitle>
              <CardDescription>Browse and manage all study materials</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: primaryColor }} />
              <p className="text-muted-foreground">Loading materials...</p>
            </div>
          ) : materials.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No materials yet</h3>
              <p className="text-muted-foreground mb-4">Start by uploading your first study material</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {materials.map((material) => (
                <Card
                  key={material.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-border/50"
                  style={{
                    boxShadow: `0 4px 6px -1px ${primaryColor}10`
                  }}
                >
                  {/* Thumbnail/Preview */}
                  <div className="aspect-video bg-gradient-accent relative group">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                      {material.type === 'video' ? (
                        <Play className="h-16 w-16 text-white opacity-75 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                      ) : material.type === 'document' ? (
                        <FileText className="h-16 w-16 text-white opacity-75 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                      ) : (
                        <ExternalLink className="h-16 w-16 text-white opacity-75 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                      )}
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant="secondary"
                        className="font-semibold shadow-lg"
                        style={{
                          background: material.type === 'video' ? primaryColor : secondaryColor,
                          color: 'white'
                        }}
                      >
                        {material.type === 'video' ? <Video className="h-3 w-3 mr-1" /> :
                         material.type === 'document' ? <FileText className="h-3 w-3 mr-1" /> :
                         <LinkIcon className="h-3 w-3 mr-1" />}
                        {material.type}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                        Form {material.form_level}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-1 line-clamp-2">{material.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {material.description || 'No description'}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" style={{ borderColor: primaryColor, color: primaryColor }}>
                        {material.subject}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {material.views_count} views
                      </span>
                      <span>{new Date(material.created_at).toLocaleDateString()}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {material.type === 'video' && (
                        <Button
                          size="sm"
                          className="flex-1 text-white"
                          style={{ background: primaryColor }}
                          onClick={() => setPlayVideoDialog(material)}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Play
                        </Button>
                      )}
                      {material.type === 'document' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          style={{ borderColor: primaryColor, color: primaryColor }}
                          onClick={() => window.open(material.file_url, '_blank')}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      )}
                      {material.type === 'link' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          style={{ borderColor: primaryColor, color: primaryColor }}
                          onClick={() => window.open(material.file_url, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Open
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditDialog(material);
                          setMaterialForm({
                            title: material.title,
                            description: material.description || '',
                            subject: material.subject,
                            form_level: material.form_level.toString(),
                            file_url: material.file_url,
                            thumbnail_url: material.thumbnail_url || '',
                            duration: material.duration?.toString() || '',
                            tags: material.tags?.join(', ') || '',
                          });
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteDialog(material)}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {uploadType === "video" ? <Video className="h-5 w-5" style={{ color: primaryColor }} /> :
               uploadType === "document" ? <FileText className="h-5 w-5" style={{ color: primaryColor }} /> :
               <LinkIcon className="h-5 w-5" style={{ color: primaryColor }} />}
              Upload {uploadType === "video" ? "Video" : uploadType === "document" ? "Document" : "External Link"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={materialForm.title}
                onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                placeholder="Enter material title"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={materialForm.description}
                onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                placeholder="Enter description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Subject *</Label>
                <Select
                  value={materialForm.subject}
                  onValueChange={(v) => setMaterialForm({ ...materialForm, subject: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="kiswahili">Kiswahili</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="geography">Geography</SelectItem>
                    <SelectItem value="civics">Civics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Form Level *</Label>
                <Select
                  value={materialForm.form_level}
                  onValueChange={(v) => setMaterialForm({ ...materialForm, form_level: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select form" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((form) => (
                      <SelectItem key={form} value={form.toString()}>
                        Form {form}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {uploadType === "link" ? (
              <div>
                <Label>YouTube or External Link *</Label>
                <Input
                  value={materialForm.file_url}
                  onChange={(e) => setMaterialForm({ ...materialForm, file_url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=... or https://..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Paste a YouTube video link or any external resource URL
                </p>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                {selectedFile ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-3">
                      {uploadType === 'video' ? (
                        <Video className="h-8 w-8" style={{ color: primaryColor }} />
                      ) : (
                        <FileText className="h-8 w-8" style={{ color: primaryColor }} />
                      )}
                      <div className="text-left">
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-3">
                      Drag and drop your {uploadType} here, or click to browse
                    </p>
                    <Input
                      type="file"
                      accept={uploadType === 'video' ? 'video/*' : '.pdf,.doc,.docx,.ppt,.pptx'}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setSelectedFile(file);
                      }}
                      className="max-w-xs mx-auto"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {uploadType === 'document' ? 'Max size: 50MB. Formats: PDF, DOCX, PPTX' : 'Formats: MP4, WebM, OGG'}
                    </p>
                  </>
                )}
              </div>
            )}

            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Uploading...</span>
                  <span className="font-semibold">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} style={{
                  ['--progress-background' as any]: primaryColor
                }} />
              </div>
            )}

            <div>
              <Label>Tags (comma-separated)</Label>
              <Input
                value={materialForm.tags}
                onChange={(e) => setMaterialForm({ ...materialForm, tags: e.target.value })}
                placeholder="algebra, equations, form3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setUploadDialogOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="text-white"
              style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Material
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Video Player Dialog */}
      {playVideoDialog && (
        <Dialog open={!!playVideoDialog} onOpenChange={() => setPlayVideoDialog(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{playVideoDialog.title}</DialogTitle>
              <DialogDescription>{playVideoDialog.description}</DialogDescription>
            </DialogHeader>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              {playVideoDialog.video_source === 'youtube' ? (
                <iframe
                  src={getYouTubeEmbedUrl(playVideoDialog.file_url)}
                  className="w-full h-full"
                  allowFullScreen
                  title={playVideoDialog.title}
                />
              ) : (
                <video controls className="w-full h-full">
                  <source src={playVideoDialog.file_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Dialog */}
      {editDialog && (
        <Dialog open={!!editDialog} onOpenChange={() => { setEditDialog(null); resetForm(); }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Material</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title *</Label>
                <Input
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={materialForm.description}
                  onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Subject *</Label>
                  <Select
                    value={materialForm.subject}
                    onValueChange={(v) => setMaterialForm({ ...materialForm, subject: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="kiswahili">Kiswahili</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Form Level *</Label>
                  <Select
                    value={materialForm.form_level}
                    onValueChange={(v) => setMaterialForm({ ...materialForm, form_level: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((form) => (
                        <SelectItem key={form} value={form.toString()}>
                          Form {form}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Tags</Label>
                <Input
                  value={materialForm.tags}
                  onChange={(e) => setMaterialForm({ ...materialForm, tags: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setEditDialog(null); resetForm(); }}>
                Cancel
              </Button>
              <Button
                onClick={handleEdit}
                className="text-white"
                style={{ background: primaryColor }}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Material</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
