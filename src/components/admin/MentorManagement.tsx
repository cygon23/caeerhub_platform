import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserCheck, Search, CheckCircle, XCircle, Eye, MessageSquare, Star } from "lucide-react";

interface Mentor {
  id: string;
  name: string;
  email: string;
  expertise: string;
  status: "Active" | "Pending" | "Rejected" | "Inactive";
  mentees: number;
  rating: number;
  joinDate: string;
  experience: string;
  verified: boolean;
}

export default function MentorManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const mockMentors: Mentor[] = [
    {
      id: "1",
      name: "Dr. Sarah Kimani",
      email: "sarah@example.com",
      expertise: "Software Engineering",
      status: "Active",
      mentees: 8,
      rating: 4.9,
      joinDate: "2024-01-10",
      experience: "10+ years",
      verified: true
    },
    {
      id: "2",
      name: "James Mwangi",
      email: "james@example.com",
      expertise: "Digital Marketing",
      status: "Pending",
      mentees: 0,
      rating: 0,
      joinDate: "2024-01-18",
      experience: "5+ years",
      verified: false
    },
    {
      id: "3",
      name: "Grace Achieng",
      email: "grace@example.com",
      expertise: "Business Development",
      status: "Active",
      mentees: 12,
      rating: 4.8,
      joinDate: "2023-12-15",
      experience: "8+ years",
      verified: true
    },
    {
      id: "4",
      name: "Michael Ouma",
      email: "michael@example.com",
      expertise: "Graphic Design",
      status: "Inactive",
      mentees: 3,
      rating: 4.5,
      joinDate: "2023-11-20",
      experience: "6+ years",
      verified: true
    }
  ];

  const filteredMentors = mockMentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.expertise.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || mentor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active": return "default";
      case "Pending": return "secondary";
      case "Rejected": return "destructive";
      case "Inactive": return "outline";
      default: return "secondary";
    }
  };

  const handleApprove = (mentorId: string) => {
    console.log("Approving mentor:", mentorId);
  };

  const handleReject = (mentorId: string) => {
    console.log("Rejecting mentor:", mentorId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="h-5 w-5 mr-2" />
            Mentor Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search mentors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mentors Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mentor</TableHead>
                  <TableHead>Expertise</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Mentees</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMentors.map((mentor) => (
                  <TableRow key={mentor.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{mentor.name}</span>
                            {mentor.verified && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{mentor.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{mentor.expertise}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(mentor.status)}>
                        {mentor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{mentor.mentees}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span>{mentor.rating || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell>{mentor.experience}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {mentor.status === "Pending" && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleApprove(mentor.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleReject(mentor.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
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

      {/* Mentor Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">127</div>
            <div className="text-sm text-muted-foreground">Active Mentors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">23</div>
            <div className="text-sm text-muted-foreground">Pending Applications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">4.7</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">1,456</div>
            <div className="text-sm text-muted-foreground">Total Mentees</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}