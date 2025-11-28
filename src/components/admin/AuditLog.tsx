import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
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
  RefreshCw,
  Loader2
} from "lucide-react";
import { adminService, AuditLog as AuditLogType } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";

export default function AuditLog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [dateRange, setDateRange] = useState("7days");
  const [auditLogs, setAuditLogs] = useState<AuditLogType[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAuditLogs();
  }, [categoryFilter, severityFilter, dateRange]);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      // Calculate date range
      const now = new Date();
      let startDate: string | undefined;

      switch (dateRange) {
        case '1day':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
          break;
        case '7days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
          break;
        case '30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
          break;
        case '90days':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
          break;
      }

      const [logs, logStats] = await Promise.all([
        adminService.getAuditLogs({
          category: categoryFilter,
          severity: severityFilter,
          startDate,
          search: searchTerm,
        }, 200),
        adminService.getAuditLogStats()
      ]);

      setAuditLogs(logs);
      setStats(logStats);
    } catch (error: any) {
      console.error('Error loading audit logs:', error);
      toast({
        title: "Error",
        description: "Failed to load audit logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAuditData = auditLogs.filter(entry => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      entry.user_email?.toLowerCase().includes(search) ||
      entry.action.toLowerCase().includes(search) ||
      entry.resource.toLowerCase().includes(search)
    );
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
    const csv = [
      ['Timestamp', 'User', 'Action', 'Resource', 'Category', 'Severity', 'Status', 'IP Address'].join(','),
      ...filteredAuditData.map(entry =>
        [
          entry.timestamp,
          entry.user_email || 'System',
          entry.action,
          entry.resource,
          entry.category,
          entry.severity,
          entry.success ? 'Success' : 'Failed',
          entry.ip_address || 'N/A'
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading && auditLogs.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              System Audit Log
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-[180px]" />
              <Skeleton className="h-10 w-[150px]" />
              <Skeleton className="h-10 w-[150px]" />
            </div>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <Button variant="outline" size="sm" onClick={handleExport} disabled={filteredAuditData.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={loadAuditLogs} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
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
                <SelectItem value="school_management">School Management</SelectItem>
                <SelectItem value="student_management">Student Management</SelectItem>
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
                {filteredAuditData.map((entry) => {
                  const timestamp = new Date(entry.timestamp);
                  const timeStr = timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                  const dateStr = timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                  return (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{timeStr}</div>
                          <div className="text-muted-foreground">{dateStr}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{entry.user_email || 'System'}</div>
                          <div className="text-sm text-muted-foreground capitalize">{entry.user_role || 'system'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{entry.action}</div>
                          <div className="text-sm text-muted-foreground">{entry.resource}</div>
                          {entry.resource_id && (
                            <div className="text-xs text-muted-foreground">ID: {entry.resource_id}</div>
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
                        <div className="text-sm font-mono">{entry.ip_address || 'N/A'}</div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          title={entry.details ? JSON.stringify(entry.details, null, 2) : 'No additional details'}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.total || 0}</div>
              <div className="text-sm text-muted-foreground">Total Events</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.criticalEvents || 0}</div>
              <div className="text-sm text-muted-foreground">Critical Events</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.failureCount || 0}</div>
              <div className="text-sm text-muted-foreground">Failed Actions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.successCount || 0}</div>
              <div className="text-sm text-muted-foreground">Successful Actions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.total > 0 ? ((stats.successCount / stats.total) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}