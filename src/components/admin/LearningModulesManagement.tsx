import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, Search, Plus, Edit, Trash2, Eye, Users, Star, Clock, Video, FileText, Link as LinkIcon, Save } from "lucide-react";
import { learningModulesService, LearningModule, ModuleCategory, DifficultyLevel, ContentType, ModuleStatus } from "@/services/learningModulesService";
import { useToast } from "@/hooks/use-toast";

export default function LearningModulesManagement() {
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [showDialog, setShowDialog] = useState(false);
  const [editingModule, setEditingModule] = useState<LearningModule | null>(null);
  const [stats, setStats] = useState<any>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    thumbnail_url: "",
    category: "ICT Skills" as ModuleCategory,
    difficulty_level: "beginner" as DifficultyLevel,
    duration_minutes: 60,
    content_type: "article" as ContentType,
    video_url: "",
    pdf_url: "",
    external_link: "",
    learning_objectives: [] as string[],
    prerequisites: [] as string[],
    status: "draft" as ModuleStatus,
  });

  useEffect(() => {
    loadModules();
    loadStats();
  }, []);

  const loadModules = async () => {
    try {
      setLoading(true);
      const data = await learningModulesService.getAllModules();
      setModules(data);
    } catch (error) {
      console.error("Error loading modules:", error);
      toast({
        title: "Error",
        description: "Failed to load learning modules",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await learningModulesService.getModuleStats();
      setStats(data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const filteredModules = modules.filter((module) => {
    const matchesSearch =
      module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || module.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || module.status === statusFilter;
    const matchesLevel = levelFilter === "all" || module.difficulty_level === levelFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesLevel;
  });

  const handleOpenDialog = (module?: LearningModule) => {
    if (module) {
      setEditingModule(module);
      setFormData({
        title: module.title,
        description: module.description || "",
        content: module.content || "",
        thumbnail_url: module.thumbnail_url || "",
        category: module.category,
        difficulty_level: module.difficulty_level,
        duration_minutes: module.duration_minutes || 60,
        content_type: module.content_type,
        video_url: module.video_url || "",
        pdf_url: module.pdf_url || "",
        external_link: module.external_link || "",
        learning_objectives: module.learning_objectives || [],
        prerequisites: module.prerequisites || [],
        status: module.status,
      });
    } else {
      setEditingModule(null);
      setFormData({
        title: "",
        description: "",
        content: "",
        thumbnail_url: "",
        category: "ICT Skills",
        difficulty_level: "beginner",
        duration_minutes: 60,
        content_type: "article",
        video_url: "",
        pdf_url: "",
        external_link: "",
        learning_objectives: [],
        prerequisites: [],
        status: "draft",
      });
    }
    setShowDialog(true);
  };

  const handleSaveModule = async () => {
    try {
      if (!formData.title || !formData.category) {
        toast({
          title: "Validation Error",
          description: "Title and category are required",
          variant: "destructive",
        });
        return;
      }

      if (editingModule) {
        await learningModulesService.updateModule(editingModule.id, formData);
        toast({
          title: "Success",
          description: "Module updated successfully",
        });
      } else {
        await learningModulesService.createModule(formData as any);
        toast({
          title: "Success",
          description: "Module created successfully",
        });
      }

      setShowDialog(false);
      loadModules();
      loadStats();
    } catch (error) {
      console.error("Error saving module:", error);
      toast({
        title: "Error",
        description: "Failed to save module",
        variant: "destructive",
      });
    }
  };

  const handleDeleteModule = async (id: string) => {
    if (!confirm("Are you sure you want to delete this module?")) return;

    try {
      await learningModulesService.deleteModule(id);
      toast({
        title: "Success",
        description: "Module deleted successfully",
      });
      loadModules();
      loadStats();
    } catch (error) {
      console.error("Error deleting module:", error);
      toast({
        title: "Error",
        description: "Failed to delete module",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "published":
        return "default";
      case "draft":
        return "secondary";
      case "archived":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "ICT Skills": "bg-blue-100 text-blue-800",
      "Business & Entrepreneurship": "bg-green-100 text-green-800",
      "Career Development": "bg-purple-100 text-purple-800",
      "Soft Skills": "bg-pink-100 text-pink-800",
      "Academic Support": "bg-yellow-100 text-yellow-800",
      "Technical Skills": "bg-orange-100 text-orange-800",
      "Life Skills": "bg-cyan-100 text-cyan-800",
      Other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "text-green-600";
      case "intermediate":
        return "text-yellow-600";
      case "advanced":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "pdf":
      case "article":
        return <FileText className="h-4 w-4" />;
      case "external_link":
        return <LinkIcon className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Learning Modules Management
            </div>
            <Button className="flex items-center" onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Create Module
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="ICT Skills">ICT Skills</SelectItem>
                <SelectItem value="Business & Entrepreneurship">Business & Entrepreneurship</SelectItem>
                <SelectItem value="Career Development">Career Development</SelectItem>
                <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                <SelectItem value="Academic Support">Academic Support</SelectItem>
                <SelectItem value="Technical Skills">Technical Skills</SelectItem>
                <SelectItem value="Life Skills">Life Skills</SelectItem>
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Modules Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading modules...</p>
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Enrollments</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredModules.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        No modules found. Create your first module to get started!
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredModules.map((module) => (
                      <TableRow key={module.id}>
                        <TableCell>
                          <div className="flex items-start gap-3">
                            <div className="mt-1">{getContentTypeIcon(module.content_type)}</div>
                            <div>
                              <div className="font-medium">{module.title}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {module.description}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {module.duration_minutes} mins
                                <span className={`ml-2 font-medium ${getLevelColor(module.difficulty_level)}`}>
                                  {module.difficulty_level.charAt(0).toUpperCase() +
                                    module.difficulty_level.slice(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                              module.category
                            )}`}
                          >
                            {module.category}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(module.status)}>
                            {module.status.charAt(0).toUpperCase() + module.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                            {module.enrollments_count.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1 text-muted-foreground" />
                            {module.views_count.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(module)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteModule(module.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Module Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Modules</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary">{stats.byStatus?.published || 0}</div>
              <div className="text-sm text-muted-foreground">Published</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.byStatus?.draft || 0}</div>
              <div className="text-sm text-muted-foreground">Drafts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary">
                {modules.reduce((sum, m) => sum + m.enrollments_count, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Enrollments</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {modules.reduce((sum, m) => sum + m.views_count, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create/Edit Module Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingModule ? "Edit Module" : "Create New Module"}</DialogTitle>
            <DialogDescription>
              {editingModule
                ? "Update the module information below"
                : "Fill in the details to create a new learning module"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Introduction to Web Development"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the module"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value as ModuleCategory })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ICT Skills">ICT Skills</SelectItem>
                    <SelectItem value="Business & Entrepreneurship">
                      Business & Entrepreneurship
                    </SelectItem>
                    <SelectItem value="Career Development">Career Development</SelectItem>
                    <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                    <SelectItem value="Academic Support">Academic Support</SelectItem>
                    <SelectItem value="Technical Skills">Technical Skills</SelectItem>
                    <SelectItem value="Life Skills">Life Skills</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select
                  value={formData.difficulty_level}
                  onValueChange={(value) =>
                    setFormData({ ...formData, difficulty_level: value as DifficultyLevel })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="contentType">Content Type</Label>
                <Select
                  value={formData.content_type}
                  onValueChange={(value) => setFormData({ ...formData, content_type: value as ContentType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="external_link">External Link</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) =>
                    setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            {formData.content_type === "video" && (
              <div className="grid gap-2">
                <Label htmlFor="videoUrl">Video URL (YouTube, Vimeo, etc.)</Label>
                <Input
                  id="videoUrl"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            )}

            {formData.content_type === "pdf" && (
              <div className="grid gap-2">
                <Label htmlFor="pdfUrl">PDF URL</Label>
                <Input
                  id="pdfUrl"
                  value={formData.pdf_url}
                  onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                  placeholder="https://example.com/document.pdf"
                />
              </div>
            )}

            {formData.content_type === "external_link" && (
              <div className="grid gap-2">
                <Label htmlFor="externalLink">External Link</Label>
                <Input
                  id="externalLink"
                  value={formData.external_link}
                  onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
                  placeholder="https://example.com/resource"
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="content">Content (Article Text / Instructions)</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Main content or instructions for the module"
                rows={6}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="thumbnail">Thumbnail URL (Optional)</Label>
              <Input
                id="thumbnail"
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Publishing Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as ModuleStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveModule}>
              <Save className="h-4 w-4 mr-2" />
              {editingModule ? "Update Module" : "Create Module"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
