import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Briefcase, Search, Plus, Edit, Eye, CheckCircle, XCircle, MapPin, Clock } from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  type: "Full-time" | "Part-time" | "Internship" | "Contract";
  level: "Entry" | "Mid" | "Senior";
  status: "Active" | "Draft" | "Expired" | "Pending";
  location: string;
  salary: string;
  applications: number;
  posted: string;
  expires: string;
}

export default function JobBoardManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const mockJobs: Job[] = [
    {
      id: "1",
      title: "Software Developer",
      company: "Safaricom PLC",
      type: "Full-time",
      level: "Entry",
      status: "Active",
      location: "Nairobi, Kenya",
      salary: "KSh 80,000 - 120,000",
      applications: 45,
      posted: "2024-01-15",
      expires: "2024-02-15"
    },
    {
      id: "2",
      title: "Marketing Intern",
      company: "KCB Bank",
      type: "Internship",
      level: "Entry",
      status: "Active",
      location: "Nairobi, Kenya",
      salary: "KSh 20,000",
      applications: 128,
      posted: "2024-01-18",
      expires: "2024-02-18"
    },
    {
      id: "3",
      title: "Data Analyst",
      company: "Equity Bank",
      type: "Full-time",
      level: "Mid",
      status: "Pending",
      location: "Mombasa, Kenya",
      salary: "KSh 100,000 - 150,000",
      applications: 0,
      posted: "2024-01-20",
      expires: "2024-02-20"
    },
    {
      id: "4",
      title: "Graphic Designer",
      company: "Creative Agency",
      type: "Contract",
      level: "Mid",
      status: "Expired",
      location: "Remote",
      salary: "KSh 50,000/month",
      applications: 67,
      posted: "2023-12-10",
      expires: "2024-01-10"
    },
    {
      id: "5",
      title: "Customer Service Rep",
      company: "Airtel Kenya",
      type: "Full-time",
      level: "Entry",
      status: "Draft",
      location: "Kisumu, Kenya",
      salary: "KSh 35,000 - 45,000",
      applications: 0,
      posted: "2024-01-19",
      expires: "2024-02-19"
    }
  ];

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || job.type === typeFilter;
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active": return "default";
      case "Draft": return "secondary";
      case "Pending": return "outline";
      case "Expired": return "destructive";
      default: return "secondary";
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "Full-time": return "bg-green-100 text-green-800";
      case "Part-time": return "bg-blue-100 text-blue-800";
      case "Internship": return "bg-purple-100 text-purple-800";
      case "Contract": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleApprove = (jobId: string) => {
    console.log("Approving job:", jobId);
  };

  const handleReject = (jobId: string) => {
    console.log("Rejecting job:", jobId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Job Board Management
            </div>
            <Button className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Post Job
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Jobs Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Details</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{job.title}</div>
                        <div className="text-sm text-muted-foreground">{job.company}</div>
                        <div className="text-sm text-green-600 font-medium">{job.salary}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeColor(job.type)}`}>
                        {job.type}
                      </span>
                      <div className="text-xs text-muted-foreground mt-1">{job.level} Level</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(job.status)}>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-center font-medium">
                        {job.applications}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                        {job.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        {job.expires}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {job.status === "Pending" && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleApprove(job.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleReject(job.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
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

      {/* Job Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">189</div>
            <div className="text-sm text-muted-foreground">Total Jobs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">156</div>
            <div className="text-sm text-muted-foreground">Active Jobs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">2,847</div>
            <div className="text-sm text-muted-foreground">Applications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">23</div>
            <div className="text-sm text-muted-foreground">Pending Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">78%</div>
            <div className="text-sm text-muted-foreground">Fill Rate</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}