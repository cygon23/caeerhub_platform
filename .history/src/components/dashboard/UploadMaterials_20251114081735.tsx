import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileText,
  Image,
  Video,
  File,
  CheckCircle,
  AlertCircle,
  Folder,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AcademicLevelSetup from "./AcademicLevelSetup";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: string;
  subject: string;
  uploadDate: string;
  status: "uploading" | "processing" | "completed" | "failed";
  progress: number;
  file_url?: string;
  ai_processed?: boolean;
  ai_summary?: string;
}

export default function UploadMaterials() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [hasAcademicLevel, setHasAcademicLevel] = useState<boolean | null>(null);
  const [isCheckingLevel, setIsCheckingLevel] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  const categories = [
    { value: "notes", label: "Class Notes" },
    { value: "study-guide", label: "Study Guide" },
    { value: "past-papers", label: "Past Papers" },
    { value: "revision", label: "Revision Material" },
    { value: "reference", label: "Reference Books" },
  ];

  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Kiswahili",
    "History",
    "Geography",
    "Civics",
    "Commerce",
    "Book Keeping",
    "Computer Studies",
  ];

  useEffect(() => {
    checkAcademicLevel();
  }, [user]);

  useEffect(() => {
    if (hasAcademicLevel) {
      fetchUploadedFiles();
    }
  }, [hasAcademicLevel]);

  const checkAcademicLevel = async () => {
    if (!user?.id) return;

    setIsCheckingLevel(true);
    try {
      const { data, error } = await supabase
        .from("student_academic_levels")
        .select("id")
        .eq("user_id", user.id)
        .single();

      setHasAcademicLevel(!!data && !error);
    } catch (err) {
      setHasAcademicLevel(false);
    } finally {
      setIsCheckingLevel(false);
    }
  };

  const fetchUploadedFiles = async () => {
    if (!user?.id) return;

    setIsLoadingFiles(true);
    try {
      const { data, error } = await supabase
        .from("study_materials")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mappedFiles: UploadedFile[] = (data || []).map((file) => ({
        id: file.id,
        name: file.file_name,
        size: file.file_size,
        type: file.file_type,
        category: file.category,
        subject: file.subject,
        uploadDate: new Date(file.created_at).toISOString().split("T")[0],
        status: "completed",
        progress: 100,
        file_url: file.file_url,
        ai_processed: file.ai_processed,
        ai_summary: file.ai_summary,
      }));

      setUploadedFiles(mappedFiles);
    } catch (error: any) {
      console.error("Error fetching files:", error);
      toast({
        title: "Error",
        description: "Failed to load uploaded materials.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    if (!selectedCategory || !selectedSubject) {
      toast({
        title: "Missing Information",
        description: "Please select category and subject before uploading.",
        variant: "destructive",
      });
      return;
    }

    for (const file of Array.from(files)) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    const fileId = Date.now().toString() + Math.random();
    
    const newFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      category: selectedCategory,
      subject: selectedSubject,
      uploadDate: new Date().toISOString().split("T")[0],
      status: "uploading",
      progress: 0,
    };

    setUploadedFiles((prev) => [newFile, ...prev]);

    try {
      // Step 1: Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      // const fileName = `${user.id}/${Date.now()}-${file.name}`;
      //const filePath = `${user.id}/${fileName}`; 
    
     const fileName = `${Date.now()}-${file.name}`;
     const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("study-materials")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("study-materials")
        .getPublicUrl(filePath);

      // Update progress
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: "processing", progress: 50 } : f
        )
      );

      // Step 2: Save to database
      const { data: dbData, error: dbError } = await supabase
        .from("study_materials")
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_url: publicUrl,
          file_type: file.type.includes("pdf") ? "pdf" : 
                    file.type.includes("doc") ? "docx" :
                    file.type.includes("ppt") ? "pptx" :
                    file.type.includes("image") ? "image" : "video",
          file_size: file.size,
          subject: selectedSubject,
          category: selectedCategory,
          description: description || null,
          ai_processed: false,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Update with database ID
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                id: dbData.id,
                file_url: publicUrl,
                progress: 60,
              }
            : f
        )
      );

      // Step 3: Trigger AI Processing via Edge Function
      await processWithAI(dbData.id, file);

    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: "failed", progress: 0 } : f
        )
      );
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const processWithAI = async (materialId: string, file: File) => {
    try {
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === materialId ? { ...f, progress: 70 } : f
        )
      );

      // Read file content as text for processing
      const fileContent = await readFileContent(file);

      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === materialId ? { ...f, progress: 80 } : f
        )
      );

      // Call Edge Function for AI processing
      const { data, error } = await supabase.functions.invoke('process-study-material', {
        body: {
          material_id: materialId,
          content: fileContent,
        },
      });

      if (error) throw error;

      // Update UI with AI results
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === materialId
            ? {
                ...f,
                status: "completed",
                progress: 100,
                ai_processed: true,
                ai_summary: data.summary,
              }
            : f
        )
      );

      toast({
        title: "Upload Complete",
        description: `${file.name} has been processed with AI successfully.`,
        icon: <Sparkles className="h-5 w-5" />,
      });

    } catch (error: any) {
      console.error("AI processing error:", error);
      
      // Mark as completed but not AI processed
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === materialId
            ? { ...f, status: "completed", progress: 100, ai_processed: false }
            : f
        )
      );

      toast({
        title: "Upload Complete (AI Processing Failed)",
        description: "File uploaded but AI analysis failed. You can still use it for practice.",
        variant: "destructive",
      });
    }
  };

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const text = reader.result as string;
        // For PDFs, we'll get base64. For text files, we get the text
        // Limit to first 10000 characters for processing
        resolve(text.substring(0, 10000));
      };
      
      reader.onerror = reject;
      
      if (file.type.includes('text') || file.type.includes('doc')) {
        reader.readAsText(file);
      } else {
        // For PDFs and other files, send as base64 (Edge function will handle extraction)
        reader.readAsDataURL(file);
      }
    });
  };

const handleDelete = async (id: string) => {
  try {
    const file = uploadedFiles.find((f) => f.id === id);
    if (!file?.file_url) return;

    //  Correct file path extraction
    const urlParts = file.file_url.split('/study-materials/');
    if (urlParts.length < 2) {
      throw new Error('Invalid file URL');
    }
    const filePath = urlParts[1];

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("study-materials")
      .remove([filePath]);

    if (storageError) throw storageError;

    // Delete from database (cascade will delete related questions/guides)
    const { error } = await supabase
      .from("study_materials")
      .delete()
      .eq("id", id);

    if (error) throw error;

    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
    
    toast({
      title: "File Deleted",
      description: "Material and all related content removed successfully.",
    });
  } catch (error: any) {
    console.error("Delete error:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to delete file. Please try again.",
      variant: "destructive",
    });
  }
};

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return <FileText className="h-5 w-5" />;
    if (type.includes("image")) return <Image className="h-5 w-5" />;
    if (type.includes("video")) return <Video className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      notes: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "study-guide": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      "past-papers": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      revision: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      reference: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (isCheckingLevel) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasAcademicLevel) {
    return <AcademicLevelSetup onComplete={() => setHasAcademicLevel(true)} />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Upload Study Materials
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHasAcademicLevel(false)}
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Change Level
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Material Category *</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add notes about this material..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>

          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="fileInput"
              multiple
              onChange={handleFileInput}
              className="hidden"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.txt"
            />
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-base md:text-lg font-medium text-foreground mb-2">
                  Drag and drop files here
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse from your device
                </p>
                <Button
                  type="button"
                  onClick={() => document.getElementById("fileInput")?.click()}
                  disabled={!selectedCategory || !selectedSubject}
                >
                  <Folder className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Supported: PDF, Word, PowerPoint, Images, Text (Max 20MB)
                <br />
                <Sparkles className="h-3 w-3 inline mr-1" />
                AI will automatically analyze your materials
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              My Materials ({uploadedFiles.length})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchUploadedFiles}
              disabled={isLoadingFiles}
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingFiles ? "animate-spin" : ""}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingFiles ? (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading materials...</p>
            </div>
          ) : uploadedFiles.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No materials uploaded yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Upload your first study material to get started with AI-powered learning
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-accent/50 rounded-lg gap-3"
                >
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <div className="p-2 bg-background rounded-lg flex-shrink-0">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{file.name}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="secondary" className={getCategoryBadgeColor(file.category)}>
                          {categories.find((c) => c.value === file.category)?.label}
                        </Badge>
                        <Badge variant="outline">{file.subject}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </span>
                        <span className="text-xs text-muted-foreground">{file.uploadDate}</span>
                        {file.ai_processed && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <Sparkles className="h-3 w-3 mr-1" />
                            AI Analyzed
                          </Badge>
                        )}
                      </div>
                      {file.ai_summary && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          {file.ai_summary}
                        </p>
                      )}
                      {file.status === "uploading" && (
                        <Progress value={file.progress} className="mt-2 h-1" />
                      )}
                      {file.status === "processing" && (
                        <div className="flex items-center mt-2 text-xs text-muted-foreground">
                          <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                          AI is analyzing your material...
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {file.status === "completed" && file.file_url && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => window.open(file.file_url, "_blank")}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => window.open(file.file_url, "_blank")}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {file.status === "completed" ? (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : file.status === "failed" ? (
                      <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                    ) : null}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(file.id)}
                      disabled={file.status === "uploading"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Storage Used</span>
            <span className="text-sm text-muted-foreground">
              {formatFileSize(uploadedFiles.reduce((acc, file) => acc + file.size, 0))} / 500 MB
            </span>
          </div>
          <Progress
            value={(uploadedFiles.reduce((acc, file) => acc + file.size, 0) / (500 * 1024 * 1024)) * 100}
            className="h-2"
          />
        </CardContent>
      </Card>
    </div>
  );
}