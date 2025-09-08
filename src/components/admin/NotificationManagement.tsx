import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bell, Search, Plus, Send, Eye, Edit, Users, Calendar, MessageSquare } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "Announcement" | "System" | "Marketing" | "Alert";
  status: "Sent" | "Draft" | "Scheduled";
  audience: "All Users" | "Youth" | "Mentors" | "Partners";
  recipients: number;
  sent: string;
  scheduled?: string;
  openRate?: number;
}

export default function NotificationManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const mockNotifications: Notification[] = [
    {
      id: "1",
      title: "Platform Maintenance Scheduled",
      message: "We will be performing scheduled maintenance on Sunday, January 21st from 2:00 AM to 4:00 AM EAT.",
      type: "System",
      status: "Sent",
      audience: "All Users",
      recipients: 42156,
      sent: "2024-01-18",
      openRate: 87
    },
    {
      id: "2",
      title: "New ICT Modules Available",
      message: "Exciting new learning modules in software development and data science are now available!",
      type: "Announcement",
      status: "Sent",
      audience: "Youth",
      recipients: 2156,
      sent: "2024-01-17",
      openRate: 76
    },
    {
      id: "3",
      title: "Monthly Mentor Newsletter",
      message: "Updates on platform improvements, new features, and mentor best practices.",
      type: "Marketing",
      status: "Scheduled",
      audience: "Mentors",
      recipients: 127,
      sent: "2024-01-15",
      scheduled: "2024-01-25",
      openRate: 0
    },
    {
      id: "4",
      title: "Career Fair Registration Open",
      message: "Register now for the upcoming virtual career fair featuring top employers in Kenya.",
      type: "Announcement",
      status: "Draft",
      audience: "Youth",
      recipients: 0,
      sent: "2024-01-20"
    }
  ];

  const filteredNotifications = mockNotifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || notification.type === typeFilter;
    const matchesStatus = statusFilter === "all" || notification.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Sent": return "default";
      case "Draft": return "secondary";
      case "Scheduled": return "outline";
      default: return "secondary";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Announcement": return "bg-blue-100 text-blue-800";
      case "System": return "bg-red-100 text-red-800";
      case "Marketing": return "bg-green-100 text-green-800";
      case "Alert": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case "All Users": return "bg-purple-100 text-purple-800";
      case "Youth": return "bg-green-100 text-green-800";
      case "Mentors": return "bg-blue-100 text-blue-800";
      case "Partners": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {!showCreateForm ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Management
              </div>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Notification
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notifications..."
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
                  <SelectItem value="Announcement">Announcement</SelectItem>
                  <SelectItem value="System">System</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Alert">Alert</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Sent">Sent</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notifications Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Notification</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Audience</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Open Rate</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{notification.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {notification.message}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {notification.status === "Scheduled" && notification.scheduled ? (
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Scheduled: {notification.scheduled}
                              </div>
                            ) : (
                              notification.sent && `Sent: ${notification.sent}`
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                          {notification.type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(notification.status)}>
                          {notification.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAudienceColor(notification.audience)}`}>
                          {notification.audience}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                          {notification.recipients.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {notification.openRate ? (
                          <span className="text-sm font-medium">{notification.openRate}%</span>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {notification.status === "Draft" && (
                            <Button variant="ghost" size="sm">
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Create New Notification
              </div>
              <Button 
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input placeholder="Notification title..." />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Audience</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="youth">Youth</SelectItem>
                      <SelectItem value="mentors">Mentors</SelectItem>
                      <SelectItem value="partners">Partners</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Schedule (Optional)</label>
                  <Input type="datetime-local" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <Textarea 
                  placeholder="Enter your notification message here..."
                  rows={6}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline">Save as Draft</Button>
                <Button variant="outline">Schedule</Button>
                <Button>Send Now</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notification Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">156</div>
            <div className="text-sm text-muted-foreground">Total Sent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">23</div>
            <div className="text-sm text-muted-foreground">Scheduled</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">78%</div>
            <div className="text-sm text-muted-foreground">Avg Open Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">12</div>
            <div className="text-sm text-muted-foreground">Drafts</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}