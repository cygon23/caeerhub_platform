import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StudyMaterialsManagement() {
  const { toast } = useToast();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadType, setUploadType] = useState<"video" | "document" | "link">("video");

  const [materialForm, setMaterialForm] = useState({
    title: "",
    description: "",
    category: "",
    subject: "",
    form_level: "",
    file_url: "",
    thumbnail_url: "",
    duration: "",
    tags: "",
  });

  const resetForm = () => {
    setMaterialForm({
      title: "",
      description: "",
      category: "",
      subject: "",
      form_level: "",
      file_url: "",
      thumbnail_url: "",
      duration: "",
      tags: "",
    });
  };

  const handleUpload = () => {
    toast({
      title: "Material Uploaded",
      description: "Study material has been successfully uploaded.",
    });
    setUploadDialogOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-hero text-white rounded-lg p-6 md:p-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Study Materials Library</h2>
            <p className="text-white/90">Manage videos, documents, and learning resources</p>
          </div>
          <Video className="h-12 w-12 opacity-50" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          onClick={() => {
            setUploadType("video");
            setUploadDialogOpen(true);
          }}
          className="h-24 flex flex-col gap-2"
        >
          <Video className="h-8 w-8" />
          <span>Upload Video</span>
        </Button>
        <Button
          onClick={() => {
            setUploadType("document");
            setUploadDialogOpen(true);
          }}
          variant="outline"
          className="h-24 flex flex-col gap-2"
        >
          <FileText className="h-8 w-8" />
          <span>Upload Document</span>
        </Button>
        <Button
          onClick={() => {
            setUploadType("link");
            setUploadDialogOpen(true);
          }}
          variant="outline"
          className="h-24 flex flex-col gap-2"
        >
          <LinkIcon className="h-8 w-8" />
          <span>Add External Link</span>
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Video className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">45</div>
            <div className="text-sm text-muted-foreground">Videos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">32</div>
            <div className="text-sm text-muted-foreground">Documents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">1.2K</div>
            <div className="text-sm text-muted-foreground">Total Views</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">12h</div>
            <div className="text-sm text-muted-foreground">Total Duration</div>
          </CardContent>
        </Card>
      </div>

      {/* Content Library */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Content Library</CardTitle>
              <CardDescription>Browse and manage all study materials</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                  <SelectItem value="link">Links</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="math">Mathematics</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sample Material Cards */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-accent relative group">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="h-16 w-16 text-white opacity-75 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary">12:34</Badge>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="default">
                      <Video className="h-3 w-3 mr-1" />
                      Video
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1 line-clamp-2">
                    Introduction to Algebra - Form 3
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    Learn the basics of algebraic expressions and equations
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      234 views
                    </span>
                    <span>2 days ago</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Play className="h-3 w-3 mr-1" />
                      Play
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Content Analytics
          </CardTitle>
          <CardDescription>Track engagement and performance of study materials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completion Rate</span>
                  <span className="font-semibold">68%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: "68%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Average Watch Time</span>
                  <span className="font-semibold">8:42</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: "72%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Student Satisfaction</span>
                  <span className="font-semibold">4.5/5</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: "90%" }} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Upload{" "}
              {uploadType === "video" ? "Video" : uploadType === "document" ? "Document" : "External Link"}
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
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="geography">Geography</SelectItem>
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
                    <SelectItem value="1">Form 1</SelectItem>
                    <SelectItem value="2">Form 2</SelectItem>
                    <SelectItem value="3">Form 3</SelectItem>
                    <SelectItem value="4">Form 4</SelectItem>
                    <SelectItem value="5">Form 5</SelectItem>
                    <SelectItem value="6">Form 6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {uploadType === "link" ? (
              <div>
                <Label>External Link *</Label>
                <Input
                  value={materialForm.file_url}
                  onChange={(e) => setMaterialForm({ ...materialForm, file_url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop your {uploadType} here, or click to browse
                </p>
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
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
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Material
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
