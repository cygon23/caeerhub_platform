import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, Search, Plus, Edit, Trash2, Eye, Loader2, AlertCircle, GraduationCap } from "lucide-react";
import { adminService, Student } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";

interface StudentManagementProps {
  schoolId: string;
}

export default function StudentManagement({ schoolId }: StudentManagementProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [formLevelFilter, setFormLevelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentForm, setStudentForm] = useState<Partial<Student>>({
    school_id: schoolId,
    form_level: 1,
    status: 'active',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await adminService.getStudents(schoolId);
      setStudents(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load students",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.registration_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFormLevel = formLevelFilter === "all" || student.form_level.toString() === formLevelFilter;
    const matchesStatus = statusFilter === "all" || student.status === statusFilter;
    return matchesSearch && matchesFormLevel && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "graduated":
        return "outline";
      case "transferred":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const handleView = (student: Student) => {
    setSelectedStudent(student);
    setViewDialogOpen(true);
  };

  const handleCreateClick = () => {
    setStudentForm({
      school_id: schoolId,
      form_level: 1,
      status: 'active',
    });
    setCreateDialogOpen(true);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setStudentForm({
      student_name: student.student_name,
      form_level: student.form_level,
      email: student.email,
      phone: student.phone,
      gender: student.gender,
      guardian_name: student.guardian_name,
      guardian_phone: student.guardian_phone,
      guardian_email: student.guardian_email,
      status: student.status,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (student: Student) => {
    setSelectedStudent(student);
    setDeleteDialogOpen(true);
  };

  const handleCreateStudent = async () => {
    try {
      // Generate registration number if not provided
      const regNumber = studentForm.registration_number ||
        `${schoolId}-${new Date().getFullYear()}-${String(students.length + 1).padStart(4, '0')}`;

      await adminService.createStudent({
        ...studentForm,
        school_id: schoolId,
        registration_number: regNumber,
        student_name: studentForm.student_name!,
        form_level: studentForm.form_level!,
        status: studentForm.status as any,
      } as any);

      toast({
        title: "Success",
        description: "Student created successfully",
      });
      setCreateDialogOpen(false);
      loadStudents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create student",
        variant: "destructive",
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedStudent) return;

    try {
      await adminService.updateStudent(selectedStudent.id, studentForm);
      toast({
        title: "Success",
        description: "Student updated successfully",
      });
      setEditDialogOpen(false);
      loadStudents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update student",
        variant: "destructive",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedStudent) return;

    try {
      await adminService.deleteStudent(selectedStudent.id);
      toast({
        title: "Success",
        description: "Student deleted successfully",
      });
      setDeleteDialogOpen(false);
      loadStudents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete student",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Get statistics
  const stats = {
    total: students.length,
    byFormLevel: {} as Record<number, number>,
    byStatus: {
      active: students.filter(s => s.status === 'active').length,
      inactive: students.filter(s => s.status === 'inactive').length,
      graduated: students.filter(s => s.status === 'graduated').length,
      transferred: students.filter(s => s.status === 'transferred').length,
    },
  };

  students.forEach(student => {
    stats.byFormLevel[student.form_level] = (stats.byFormLevel[student.form_level] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Student Management
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={loadStudents} variant="outline" size="sm">
                <Loader2 className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleCreateClick} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Student
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
                placeholder="Search by name or registration number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={formLevelFilter} onValueChange={setFormLevelFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Form Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Forms</SelectItem>
                <SelectItem value="1">Form 1</SelectItem>
                <SelectItem value="2">Form 2</SelectItem>
                <SelectItem value="3">Form 3</SelectItem>
                <SelectItem value="4">Form 4</SelectItem>
                <SelectItem value="5">Form 5</SelectItem>
                <SelectItem value="6">Form 6</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="graduated">Graduated</SelectItem>
                <SelectItem value="transferred">Transferred</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Students Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Reg. Number</TableHead>
                  <TableHead>Form Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Guardian</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="font-medium">{student.student_name}</div>
                      {student.email && (
                        <div className="text-xs text-muted-foreground">{student.email}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {student.registration_number}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        Form {student.form_level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(student.status)} className="capitalize">
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {student.guardian_name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {student.phone || student.guardian_phone || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleView(student)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(student)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(student)}
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

          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              No students found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total Students</div>
          </CardContent>
        </Card>
        {[1, 2, 3, 4, 5, 6].map(form => (
          <Card key={form}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary">{stats.byFormLevel[form] || 0}</div>
              <div className="text-xs text-muted-foreground">Form {form}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.byStatus.active}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">{stats.byStatus.inactive}</div>
            <div className="text-xs text-muted-foreground">Inactive</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.byStatus.graduated}</div>
            <div className="text-xs text-muted-foreground">Graduated</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.byStatus.transferred}</div>
            <div className="text-xs text-muted-foreground">Transferred</div>
          </CardContent>
        </Card>
      </div>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Student Name</Label>
                <p className="text-sm font-medium">{selectedStudent.student_name}</p>
              </div>
              <div>
                <Label>Registration Number</Label>
                <p className="text-sm"><code className="bg-muted px-2 py-1 rounded">{selectedStudent.registration_number}</code></p>
              </div>
              <div>
                <Label>Form Level</Label>
                <p className="text-sm">Form {selectedStudent.form_level}</p>
              </div>
              <div>
                <Label>Status</Label>
                <Badge variant={getStatusBadgeVariant(selectedStudent.status)} className="capitalize">
                  {selectedStudent.status}
                </Badge>
              </div>
              <div>
                <Label>Email</Label>
                <p className="text-sm">{selectedStudent.email || 'N/A'}</p>
              </div>
              <div>
                <Label>Phone</Label>
                <p className="text-sm">{selectedStudent.phone || 'N/A'}</p>
              </div>
              <div>
                <Label>Gender</Label>
                <p className="text-sm capitalize">{selectedStudent.gender || 'N/A'}</p>
              </div>
              <div>
                <Label>Date of Birth</Label>
                <p className="text-sm">{formatDate(selectedStudent.date_of_birth)}</p>
              </div>
              <div className="col-span-2">
                <h4 className="font-semibold mb-2">Guardian Information</h4>
              </div>
              <div>
                <Label>Guardian Name</Label>
                <p className="text-sm">{selectedStudent.guardian_name || 'N/A'}</p>
              </div>
              <div>
                <Label>Guardian Phone</Label>
                <p className="text-sm">{selectedStudent.guardian_phone || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <Label>Guardian Email</Label>
                <p className="text-sm">{selectedStudent.guardian_email || 'N/A'}</p>
              </div>
              <div>
                <Label>Created</Label>
                <p className="text-sm">{formatDate(selectedStudent.created_at)}</p>
              </div>
              <div>
                <Label>Last Updated</Label>
                <p className="text-sm">{formatDate(selectedStudent.updated_at)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>Enter student information</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Student Name *</Label>
              <Input
                value={studentForm.student_name || ''}
                onChange={(e) => setStudentForm({ ...studentForm, student_name: e.target.value })}
                placeholder="Full name"
              />
            </div>
            <div>
              <Label>Form Level *</Label>
              <Select
                value={studentForm.form_level?.toString()}
                onValueChange={(value) => setStudentForm({ ...studentForm, form_level: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue />
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
            <div>
              <Label>Gender</Label>
              <Select
                value={studentForm.gender}
                onValueChange={(value) => setStudentForm({ ...studentForm, gender: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={studentForm.email || ''}
                onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                placeholder="student@example.com"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={studentForm.phone || ''}
                onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                placeholder="+255..."
              />
            </div>
            <div className="col-span-2">
              <h4 className="font-semibold mb-2">Guardian Information</h4>
            </div>
            <div className="col-span-2">
              <Label>Guardian Name</Label>
              <Input
                value={studentForm.guardian_name || ''}
                onChange={(e) => setStudentForm({ ...studentForm, guardian_name: e.target.value })}
                placeholder="Parent/Guardian name"
              />
            </div>
            <div>
              <Label>Guardian Phone</Label>
              <Input
                value={studentForm.guardian_phone || ''}
                onChange={(e) => setStudentForm({ ...studentForm, guardian_phone: e.target.value })}
                placeholder="+255..."
              />
            </div>
            <div>
              <Label>Guardian Email</Label>
              <Input
                type="email"
                value={studentForm.guardian_email || ''}
                onChange={(e) => setStudentForm({ ...studentForm, guardian_email: e.target.value })}
                placeholder="guardian@example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateStudent} disabled={!studentForm.student_name || !studentForm.form_level}>
              <Plus className="h-4 w-4 mr-2" />
              Create Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog - Similar to Create but for editing */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>Update student information</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Student Name</Label>
              <Input
                value={studentForm.student_name || ''}
                onChange={(e) => setStudentForm({ ...studentForm, student_name: e.target.value })}
              />
            </div>
            <div>
              <Label>Form Level</Label>
              <Select
                value={studentForm.form_level?.toString()}
                onValueChange={(value) => setStudentForm({ ...studentForm, form_level: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue />
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
            <div>
              <Label>Status</Label>
              <Select
                value={studentForm.status}
                onValueChange={(value) => setStudentForm({ ...studentForm, status: value as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                  <SelectItem value="transferred">Transferred</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={studentForm.email || ''}
                onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={studentForm.phone || ''}
                onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <h4 className="font-semibold mb-2">Guardian Information</h4>
            </div>
            <div className="col-span-2">
              <Label>Guardian Name</Label>
              <Input
                value={studentForm.guardian_name || ''}
                onChange={(e) => setStudentForm({ ...studentForm, guardian_name: e.target.value })}
              />
            </div>
            <div>
              <Label>Guardian Phone</Label>
              <Input
                value={studentForm.guardian_phone || ''}
                onChange={(e) => setStudentForm({ ...studentForm, guardian_phone: e.target.value })}
              />
            </div>
            <div>
              <Label>Guardian Email</Label>
              <Input
                type="email"
                value={studentForm.guardian_email || ''}
                onChange={(e) => setStudentForm({ ...studentForm, guardian_email: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Student</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedStudent?.student_name}? This action cannot be undone.
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
