import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  X,
  CheckCircle,
  AlertCircle,
  Folder,
  Download,
  Eye,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: string;
  subject: string;
  uploadDate: string;
  status: "uploading" | "completed" | "failed";
  progress: number;
}

export default function UploadMaterials() {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: "1",
      name: "Mathematics_Notes_Chapter5.pdf",
      size: 2456789,
      type: "application/pdf",
      category: "notes",
      subject: "Mathematics",
      uploadDate: "2024-01-15",
      status: "completed",
      progress: 100,
    },
    {
      id: "2",
      name: "Physics_Revision_Guide.pdf",
      size: 3145678,
      type: "application/pdf",
      category: "study-guide",
      subject: "Physics",
      uploadDate: "2024-01-14",
      status: "completed",
      progress: 100,
    },
  ]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [description, setDescription] = useState("");

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
  ];

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

  const handleFiles = (files: FileList) => {
    if (!selectedCategory || !selectedSubject) {
      toast({
        title: "Missing Information",
        description: "Please select category and subject before uploading.",
        variant: "destructive",
      });
      return;
    }

    Array.from(files).forEach((file) => {
      const newFile: UploadedFile = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        category: selectedCategory,
        subject: selectedSubject,
        uploadDate: new Date().toISOString().split("T")[0],
        status: "uploading",
        progress: 0,
      };

      setUploadedFiles((prev) => [...prev, newFile]);

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress <= 100) {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === newFile.id ? { ...f, progress } : f
            )
          );
        }
        if (progress === 100) {
          clearInterval(interval);
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === newFile.id ? { ...f, status: "completed" } : f
            )
          );
          toast({
            title: "Upload Complete",
            description: `${file.name} has been uploaded successfully.`,
          });
        }
      }, 200);
    });
  };

  const handleDelete = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
    toast({
      title: "File Deleted",
      description: "Material has been removed successfully.",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
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

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Upload Study Materials
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category and Subject Selection */}
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

          {/* Description */}
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

          {/* Drag and Drop Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
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
              accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.mp4,.mp3"
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
                Supported formats: PDF, Word, PowerPoint, Images, Videos (Max 20MB)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              My Materials ({uploadedFiles.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {uploadedFiles.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No materials uploaded yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Upload your first study material to get started
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
                      <p className="font-medium text-foreground truncate">
                        {file.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className={getCategoryBadgeColor(file.category)}
                        >
                          {categories.find((c) => c.value === file.category)?.label}
                        </Badge>
                        <Badge variant="outline">{file.subject}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {file.uploadDate}
                        </span>
                      </div>
                      {file.status === "uploading" && (
                        <Progress value={file.progress} className="mt-2 h-1" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {file.status === "completed" && (
                      <>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
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

      {/* Storage Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Storage Used</span>
            <span className="text-sm text-muted-foreground">
              {formatFileSize(uploadedFiles.reduce((acc, file) => acc + file.size, 0))} / 500 MB
            </span>
          </div>
          <Progress
            value={
              (uploadedFiles.reduce((acc, file) => acc + file.size, 0) / (500 * 1024 * 1024)) * 100
            }
            className="h-2"
          />
        </CardContent>
      </Card>
    </div>
  );
}
