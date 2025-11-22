import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Building, CheckCircle, XCircle, Eye, Loader2, AlertCircle, Copy, Check } from "lucide-react";
import { adminService, School } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";

export default function SchoolManagement() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [credentialsDialogOpen, setCredentialsDialogOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminName, setAdminName] = useState("");
  const [rejectNotes, setRejectNotes] = useState("");
  const [generatedCredentials, setGeneratedCredentials] = useState<{username: string; password: string} | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    setLoading(true);
    try {
      const data = await adminService.getSchools();
      setSchools(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load schools",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleView = (school: School) => {
    setSelectedSchool(school);
    setViewDialogOpen(true);
  };

  const handleApproveClick = (school: School) => {
    setSelectedSchool(school);
    setAdminEmail(school.contact_email);
    setAdminName(`${school.school_name} Admin`);
    setApproveDialogOpen(true);
  };

  const handleRejectClick = (school: School) => {
    setSelectedSchool(school);
    setRejectNotes("");
    setRejectDialogOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (!selectedSchool) return;

    try {
      const credentials = await adminService.approveSchool(
        selectedSchool.id,
        adminEmail,
        adminName
      );

      setGeneratedCredentials(credentials);
      setApproveDialogOpen(false);
      setCredentialsDialogOpen(true);

      toast({
        title: "Success",
        description: "School approved and admin account created",
      });

      loadSchools();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve school",
        variant: "destructive",
      });
    }
  };

  const handleConfirmReject = async () => {
    if (!selectedSchool) return;

    try {
      await adminService.rejectSchool(selectedSchool.id, rejectNotes);
      toast({
        title: "Success",
        description: "School registration rejected",
      });
      setRejectDialogOpen(false);
      loadSchools();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject school",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    toast({
      title: "Copied!",
      description: `${field} copied to clipboard`,
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const renderSchoolsTable = (filteredSchools: School[]) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>School Name</TableHead>
            <TableHead>Registration #</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSchools.map((school) => (
            <TableRow key={school.id}>
              <TableCell>
                <div className="font-medium">{school.school_name}</div>
              </TableCell>
              <TableCell>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {school.registration_number}
                </code>
              </TableCell>
              <TableCell>
                <div>
                  <div className="text-sm">{school.contact_email}</div>
                  <div className="text-xs text-muted-foreground">{school.contact_phone}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(school.status)} className="capitalize">
                  {school.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(school.created_at)}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleView(school)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  {school.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApproveClick(school)}
                        className="text-green-600 hover:text-green-700">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRejectClick(school)}
                        className="text-red-600 hover:text-red-700">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const pendingSchools = schools.filter(s => s.status === 'pending');
  const approvedSchools = schools.filter(s => s.status === 'approved');
  const rejectedSchools = schools.filter(s => s.status === 'rejected');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              School Management
            </div>
            <Button onClick={loadSchools} variant="outline" size="sm">
              <Loader2 className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">
                Pending ({pendingSchools.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedSchools.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({rejectedSchools.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {pendingSchools.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  No pending school registrations
                </div>
              ) : (
                renderSchoolsTable(pendingSchools)
              )}
            </TabsContent>

            <TabsContent value="approved">
              {approvedSchools.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  No approved schools yet
                </div>
              ) : (
                renderSchoolsTable(approvedSchools)
              )}
            </TabsContent>

            <TabsContent value="rejected">
              {rejectedSchools.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  No rejected schools
                </div>
              ) : (
                renderSchoolsTable(rejectedSchools)
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">{pendingSchools.length}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{approvedSchools.length}</div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">{rejectedSchools.length}</div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{schools.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
      </div>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>School Details</DialogTitle>
          </DialogHeader>
          {selectedSchool && (
            <div className="space-y-4">
              <div>
                <Label>School Name</Label>
                <p className="text-sm font-medium">{selectedSchool.school_name}</p>
              </div>
              <div>
                <Label>Registration Number</Label>
                <p className="text-sm"><code className="bg-muted px-2 py-1 rounded">{selectedSchool.registration_number}</code></p>
              </div>
              <div>
                <Label>Contact Email</Label>
                <p className="text-sm">{selectedSchool.contact_email}</p>
              </div>
              <div>
                <Label>Contact Phone</Label>
                <p className="text-sm">{selectedSchool.contact_phone}</p>
              </div>
              <div>
                <Label>Status</Label>
                <Badge variant={getStatusBadgeVariant(selectedSchool.status)} className="capitalize">
                  {selectedSchool.status}
                </Badge>
              </div>
              <div>
                <Label>Submitted Date</Label>
                <p className="text-sm">{formatDate(selectedSchool.created_at)}</p>
              </div>
              {selectedSchool.admin_notes && (
                <div>
                  <Label>Admin Notes</Label>
                  <p className="text-sm text-muted-foreground">{selectedSchool.admin_notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve School Registration</DialogTitle>
            <DialogDescription>
              Create a school admin account for {selectedSchool?.school_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                A school admin account will be created with an auto-generated password.
                Make sure to copy the credentials to share with the school.
              </AlertDescription>
            </Alert>
            <div>
              <Label>Admin Name</Label>
              <Input
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="e.g., Mianzini School Admin"
              />
            </div>
            <div>
              <Label>Admin Email</Label>
              <Input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@school.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmApprove} disabled={!adminEmail || !adminName}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve & Create Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Credentials Dialog */}
      <Dialog open={credentialsDialogOpen} onOpenChange={setCredentialsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>School Admin Credentials Created</DialogTitle>
            <DialogDescription>
              Copy these credentials and share them with the school. They won't be shown again!
            </DialogDescription>
          </DialogHeader>
          {generatedCredentials && (
            <div className="space-y-4">
              <Alert variant="default" className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">School Approved Successfully!</AlertTitle>
                <AlertDescription className="text-green-700">
                  {selectedSchool?.school_name} has been approved and can now manage students.
                </AlertDescription>
              </Alert>

              <div className="space-y-3 p-4 bg-muted rounded-lg">
                <div>
                  <Label className="text-xs text-muted-foreground">Username / Email</Label>
                  <div className="flex items-center justify-between mt-1">
                    <code className="text-sm font-mono">{generatedCredentials.username}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(generatedCredentials.username, 'Username')}>
                      {copiedField === 'Username' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Temporary Password</Label>
                  <div className="flex items-center justify-between mt-1">
                    <code className="text-sm font-mono">{generatedCredentials.password}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(generatedCredentials.password, 'Password')}>
                      {copiedField === 'Password' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  The school admin should change this password on first login.
                </AlertDescription>
              </Alert>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setCredentialsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject School Registration</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting {selectedSchool?.school_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rejection Notes</Label>
              <Textarea
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                placeholder="Explain why this registration is being rejected..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmReject}
              disabled={!rejectNotes.trim()}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject Registration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
