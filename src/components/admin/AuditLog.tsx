import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Activity, 
  Search, 
  Download, 
  Filter, 
  Calendar,
  Shield,
  User,
  Settings,
  Database,
  Lock,
  AlertTriangle,
  Eye,
  RefreshCw
} from "lucide-react";

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  category: "authentication" | "user_management" | "system" | "data" | "security";
  severity: "low" | "medium" | "high" | "critical";
  ipAddress: string;
  userAgent: string;
  details?: string;
  success: boolean;
}

export default function AuditLog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [dateRange, setDateRange] = useState("7days");

  const mockAuditData: AuditEntry[] = [
    {
      id: "1",
      timestamp: "2024-01-20 14:30:25",
      user: "John Admin",
      userId: "admin-001",
      action: "User Role Updated",
      resource: "User Profile",
      resourceId: "user-123",
      category: "user_management",
      severity: "medium",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 Chrome/120.0",
      details: "Changed user role from 'youth' to 'mentor'",
      success: true
    },
    {
      id: "2",
      timestamp: "2024-01-20 14:25:15",
      user: "Sarah Kimani",
      userId: "user-456",
      action: "Failed Login Attempt",
      resource: "Authentication",
      category: "authentication",
      severity: "high",
      ipAddress: "203.0.113.45",
      userAgent: "Mozilla/5.0 Safari/605.1",
      details: "Invalid password - 3rd attempt",
      success: false
    },
    {
      id: "3",
      timestamp: "2024-01-20 14:20:10",
      user: "System",
      userId: "system",
      action: "Database Backup",
      resource: "Database",
      category: "system",
      severity: "low",
      ipAddress: "127.0.0.1",
      userAgent: "System Process",
      details: "Automated daily backup completed",
      success: true
    },
    {
      id: "4",
      timestamp: "2024-01-20 14:15:30",
      user: "Alice Wanjiku",
      userId: "user-789",
      action: "Data Export",
      resource: "User Data",
      category: "data",
      severity: "medium",
      ipAddress: "10.0.0.50",
      userAgent: "Mozilla/5.0 Firefox/121.0",
      details: "Exported personal learning progress data",
      success: true
    },
    {
      id: "5",
      timestamp: "2024-01-20 14:10:45",
      user: "John Admin",
      userId: "admin-001",
      action: "Security Settings Modified",
      resource: "System Settings",
      category: "security",
      severity: "critical",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 Chrome/120.0",
      details: "Updated password policy requirements",
      success: true
    },
    {
      id: "6",
      timestamp: "2024-01-20 14:05:20",
      user: "Unknown",
      userId: "unknown",
      action: "Unauthorized Access Attempt",
      resource: "Admin Panel",
      category: "security",
      severity: "critical",
      ipAddress: "198.51.100.10",
      userAgent: "curl/7.68.0",
      details: "Attempted to access admin endpoint without authentication",
      success: false
    }
  ];

  const filteredAuditData = mockAuditData.filter(entry => {
    const matchesSearch = entry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || entry.category === categoryFilter;
    const matchesSeverity = severityFilter === "all" || entry.severity === severityFilter;
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "authentication": return <Lock className="h-4 w-4" />;
      case "user_management": return <User className="h-4 w-4" />;
      case "system": return <Settings className="h-4 w-4" />;
      case "data": return <Database className="h-4 w-4" />;
      case "security": return <Shield className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "authentication": return "bg-blue-100 text-blue-800";
      case "user_management": return "bg-green-100 text-green-800";
      case "system": return "bg-gray-100 text-gray-800";
      case "data": return "bg-purple-100 text-purple-800";
      case "security": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case "low": return "secondary";
      case "medium": return "outline";
      case "high": return "destructive";
      case "critical": return "destructive";
      default: return "secondary";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "text-green-600";
      case "medium": return "text-yellow-600";
      case "high": return "text-orange-600";
      case "critical": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const handleExport = () => {
    console.log("Exporting audit logs...");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              System Audit Log
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search audit logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="authentication">Authentication</SelectItem>
                <SelectItem value="user_management">User Management</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="data">Data</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1day">Last 24 hours</SelectItem>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Audit Log Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAuditData.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <div className="text-sm">
                        <div>{entry.timestamp.split(' ')[1]}</div>
                        <div className="text-muted-foreground">{entry.timestamp.split(' ')[0]}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{entry.user}</div>
                        <div className="text-sm text-muted-foreground">{entry.userId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{entry.action}</div>
                        <div className="text-sm text-muted-foreground">{entry.resource}</div>
                        {entry.resourceId && (
                          <div className="text-xs text-muted-foreground">ID: {entry.resourceId}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(entry.category)}`}>
                        {getCategoryIcon(entry.category)}
                        <span className="ml-1 capitalize">{entry.category.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center font-medium ${getSeverityColor(entry.severity)}`}>
                        {entry.severity === "critical" && <AlertTriangle className="h-4 w-4 mr-1" />}
                        <span className="capitalize">{entry.severity}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={entry.success ? "default" : "destructive"}>
                        {entry.success ? "Success" : "Failed"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-mono">{entry.ipAddress}</div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAuditData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No audit entries found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audit Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">156</div>
            <div className="text-sm text-muted-foreground">Total Events</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">3</div>
            <div className="text-sm text-muted-foreground">Critical Events</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">12</div>
            <div className="text-sm text-muted-foreground">Failed Actions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">89</div>
            <div className="text-sm text-muted-foreground">User Actions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">98.2%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}