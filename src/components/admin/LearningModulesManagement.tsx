import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Search, Plus, Edit, Eye, Play, Users, Star, Clock } from "lucide-react";

interface LearningModule {
  id: string;
  title: string;
  category: "ICT" | "Business" | "Agriculture" | "Creative" | "Healthcare" | "Engineering";
  level: "Beginner" | "Intermediate" | "Advanced";
  status: "Published" | "Draft" | "Under Review";
  enrollments: number;
  rating: number;
  duration: string;
  completionRate: number;
  author: string;
  lastUpdated: string;
}

export default function LearningModulesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  const mockModules: LearningModule[] = [
    {
      id: "1",
      title: "Introduction to Web Development",
      category: "ICT",
      level: "Beginner",
      status: "Published",
      enrollments: 1247,
      rating: 4.8,
      duration: "8 weeks",
      completionRate: 87,
      author: "Dr. Sarah Kimani",
      lastUpdated: "2024-01-15"
    },
    {
      id: "2",
      title: "Digital Marketing Fundamentals",
      category: "Business",
      level: "Intermediate",
      status: "Published",
      enrollments: 892,
      rating: 4.6,
      duration: "6 weeks",
      completionRate: 78,
      author: "James Mwangi",
      lastUpdated: "2024-01-10"
    },
    {
      id: "3",
      title: "Sustainable Agriculture Practices",
      category: "Agriculture",
      level: "Beginner",
      status: "Under Review",
      enrollments: 0,
      rating: 0,
      duration: "10 weeks",
      completionRate: 0,
      author: "Prof. Grace Achieng",
      lastUpdated: "2024-01-18"
    },
    {
      id: "4",
      title: "Advanced Data Science",
      category: "ICT",
      level: "Advanced",
      status: "Draft",
      enrollments: 0,
      rating: 0,
      duration: "12 weeks",
      completionRate: 0,
      author: "Dr. Michael Ouma",
      lastUpdated: "2024-01-20"
    },
    {
      id: "5",
      title: "Creative Photography",
      category: "Creative",
      level: "Intermediate",
      status: "Published",
      enrollments: 456,
      rating: 4.9,
      duration: "4 weeks",
      completionRate: 92,
      author: "Alice Wanjiku",
      lastUpdated: "2024-01-12"
    }
  ];

  const filteredModules = mockModules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || module.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || module.status === statusFilter;
    const matchesLevel = levelFilter === "all" || module.level === levelFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesLevel;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Published": return "default";
      case "Draft": return "secondary";
      case "Under Review": return "outline";
      default: return "secondary";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "ICT": return "bg-blue-100 text-blue-800";
      case "Business": return "bg-green-100 text-green-800";
      case "Agriculture": return "bg-yellow-100 text-yellow-800";
      case "Creative": return "bg-purple-100 text-purple-800";
      case "Healthcare": return "bg-red-100 text-red-800";
      case "Engineering": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "text-green-600";
      case "Intermediate": return "text-yellow-600";
      case "Advanced": return "text-red-600";
      default: return "text-gray-600";
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
            <Button className="flex items-center">
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
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="ICT">ICT</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Agriculture">Agriculture</SelectItem>
                <SelectItem value="Creative">Creative</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Modules Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Module</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Enrollments</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredModules.map((module) => (
                  <TableRow key={module.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{module.title}</div>
                        <div className="text-sm text-muted-foreground">by {module.author}</div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {module.duration}
                          <span className={`ml-2 font-medium ${getLevelColor(module.level)}`}>
                            {module.level}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(module.category)}`}>
                        {module.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(module.status)}>
                        {module.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                        {module.enrollments.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {module.rating > 0 ? (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                          {module.rating}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {module.completionRate > 0 ? (
                        <div className="flex items-center">
                          <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${module.completionRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{module.completionRate}%</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Module Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">89</div>
            <div className="text-sm text-muted-foreground">Total Modules</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">67</div>
            <div className="text-sm text-muted-foreground">Published</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">12,547</div>
            <div className="text-sm text-muted-foreground">Total Enrollments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">4.7</div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">83%</div>
            <div className="text-sm text-muted-foreground">Completion Rate</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}