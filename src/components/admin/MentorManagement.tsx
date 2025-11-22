import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { UserCheck, Search, Eye, Edit, Trash2, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { adminService, Mentor } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";

export default function MentorManagement() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Mentor>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadMentors();
  }, []);

  const loadMentors = async () => {
    setLoading(true);
    try {
      const data = await adminService.getMentors();
      setMentors(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load mentors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || mentor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "pending":
        return "secondary";
      case "suspended":
      case "inactive":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const handleView = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setViewDialogOpen(true);
  };

  const handleEdit = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setEditForm({
      name: mentor.name,
      phone: mentor.phone,
      location: mentor.location,
      status: mentor.status,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setDeleteDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedMentor) return;

    try {
      await adminService.updateUserProfile(selectedMentor.id, editForm);
      toast({
        title: "Success",
        description: "Mentor updated successfully",
      });
      setEditDialogOpen(false);
      loadMentors();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update mentor",
        variant: "destructive",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedMentor) return;

    try {
      await adminService.deleteUser(selectedMentor.id);
      toast({
        title: "Success",
        description: "Mentor deleted successfully",
      });
      setDeleteDialogOpen(false);
      loadMentors();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete mentor",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <UserCheck className="h-5 w-5 mr-2" />
              Mentor Management
            </div>
            <Button onClick={loadMentors} variant="outline" size="sm">
              <Loader2 className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search mentors by name or email..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mentors Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mentor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMentors.map((mentor) => (
                  <TableRow key={mentor.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div>
                          <div className="font-medium">{mentor.name}</div>
                          <div className="text-sm text-muted-foreground">{mentor.email}</div>
                        </div>
                        <CheckCircle className="h-4 w-4 text-green-500" title="Verified Mentor" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(mentor.status)} className="capitalize">
                        {mentor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{mentor.phone || 'N/A'}</TableCell>
                    <TableCell>{mentor.location || 'N/A'}</TableCell>
                    <TableCell>{formatDate(mentor.created_at)}</TableCell>
                    <TableCell>{formatDate(mentor.last_sign_in_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleView(mentor)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(mentor)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(mentor)}
                          className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredMentors.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              No mentors found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mentor Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {mentors.filter((m) => m.status === 'active').length}
            </div>
            <div className="text-sm text-muted-foreground">Active Mentors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">
              {mentors.filter((m) => m.status === 'pending').length}
            </div>
            <div className="text-sm text-muted-foreground">Pending Applications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {mentors.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Mentors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">
              {mentors.filter((m) => m.status === 'inactive').length}
            </div>
            <div className="text-sm text-muted-foreground">Inactive</div>
          </CardContent>
        </Card>
      </div>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mentor Details</DialogTitle>
          </DialogHeader>
          {selectedMentor && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <p className="text-sm">{selectedMentor.name}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="text-sm">{selectedMentor.email}</p>
              </div>
              <div>
                <Label>Status</Label>
                <p className="text-sm capitalize">{selectedMentor.status}</p>
              </div>
              <div>
                <Label>Phone</Label>
                <p className="text-sm">{selectedMentor.phone || 'N/A'}</p>
              </div>
              <div>
                <Label>Location</Label>
                <p className="text-sm">{selectedMentor.location || 'N/A'}</p>
              </div>
              <div>
                <Label>Joined</Label>
                <p className="text-sm">{formatDate(selectedMentor.created_at)}</p>
              </div>
              <div>
                <Label>Last Login</Label>
                <p className="text-sm">{formatDate(selectedMentor.last_sign_in_at)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Mentor</DialogTitle>
            <DialogDescription>Update mentor information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={editForm.name || ''}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={editForm.phone || ''}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={editForm.location || ''}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(value) => setEditForm({ ...editForm, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Mentor</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedMentor?.name}? This will set their status to
              inactive.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
