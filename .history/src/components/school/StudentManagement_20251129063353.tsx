import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, Search, Plus, Edit, Trash2, Eye, Loader2, AlertCircle, GraduationCap, Upload, Download, FileSpreadsheet } from "lucide-react";
import { adminService, Student } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

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
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [uploadFormLevel, setUploadFormLevel] = useState<number>(1);
  const [credentialsDialogOpen, setCredentialsDialogOpen] = useState(false);
  const [studentCredentials, setStudentCredentials] = useState<{
    studentName: string;
    email: string;
    registrationNumber: string;
    password: string;
  } | null>(null);
  const { toast} = useToast();

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
      // Don't send school_id or registration_number - they'll be auto-generated
      const result = await adminService.createStudent({
        student_name: studentForm.student_name!,
        form_level: studentForm.form_level!,
        email: studentForm.email,
        phone: studentForm.phone,
        gender: studentForm.gender,
        date_of_birth: studentForm.date_of_birth,
        guardian_name: studentForm.guardian_name,
        guardian_phone: studentForm.guardian_phone,
        guardian_email: studentForm.guardian_email,
        status: studentForm.status as any || 'active',
      } as any);

      // Close create dialog
      setCreateDialogOpen(false);

      // If auth was created, show credentials
      if (result.defaultPassword && result.registrationNumber) {
        setStudentCredentials({
          studentName: studentForm.student_name!,
          email: studentForm.email || '',
          registrationNumber: result.registrationNumber,
          password: result.defaultPassword,
        });
        setCredentialsDialogOpen(true);
      } else {
        toast({
          title: "Success",
          description: "Student created successfully (no email provided, no login credentials)",
        });
      }

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelFile(file);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        setExcelData(jsonData);
        toast({
          title: "File Loaded",
          description: `Found ${jsonData.length} student records`,
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to parse Excel file. Please check the format.",
          variant: "destructive",
        });
      }
    };

    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    const template = [
      {
        'Student Name': 'John Doe',
        'Email': 'john@example.com',
        'Phone': '+255712345678',
        'Gender': 'male',
        'Date of Birth': '2008-01-15',
        'Guardian Name': 'Jane Doe',
        'Guardian Phone': '+255712345679',
        'Guardian Email': 'jane@example.com',
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    XLSX.writeFile(workbook, `student_upload_template_form_${uploadFormLevel}.xlsx`);

    toast({
      title: "Template Downloaded",
      description: `Template for Form ${uploadFormLevel} students downloaded successfully`,
    });
  };

  const handleBulkUpload = async () => {
    if (excelData.length === 0) {
      toast({
        title: "Error",
        description: "No data to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const row of excelData) {
        try {
          // Don't send school_id or registration_number - they'll be auto-generated
          await adminService.createStudent({
            student_name: row['Student Name'] || row['student_name'],
            form_level: uploadFormLevel, // Use selected form level from dialog
            email: row['Email'] || row['email'],
            phone: row['Phone'] || row['phone'],
            gender: row['Gender'] || row['gender'],
            date_of_birth: row['Date of Birth'] || row['date_of_birth'],
            guardian_name: row['Guardian Name'] || row['guardian_name'],
            guardian_phone: row['Guardian Phone'] || row['guardian_phone'],
            guardian_email: row['Guardian Email'] || row['guardian_email'],
            status: (row['Status'] || row['status'] || 'active') as any,
          } as any);

          successCount++;
        } catch (error) {
          errorCount++;
          console.error('Error creating student:', error);
        }
      }

      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${successCount} students. ${errorCount > 0 ? `Failed: ${errorCount}` : ''}`,
      });

      setUploadDialogOpen(false);
      setExcelData([]);
      setExcelFile(null);
      loadStudents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload students",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
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
                <Button onClick={loadStudents} variant="outline" size="sm" disabled>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Refresh
                </Button>
                <Button onClick={() => setUploadDialogOpen(true)} variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Excel
                </Button>
                <Button onClick={handleCreateClick} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or registration number..."
                  className="pl-10"
                  disabled
                />
              </div>
              <Select disabled>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Form Level" />
                </SelectTrigger>
              </Select>
              <Select disabled>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
              </Select>
            </div>

            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-muted-foreground">Loading students...</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[...Array(7)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-muted-foreground">-</div>
                <div className="text-xs text-muted-foreground">Loading...</div>
              </CardContent>
            </Card>
          ))}
        </div>
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
      {/* Colorful Stats Cards at Top - Form Levels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {/* Total Students */}
        <Card className="overflow-hidden border-l-4 border-l-primary bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stats.total}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form 1 */}
        <Card className="overflow-hidden border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-500/5 to-transparent">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Form 1</p>
              <p className="text-3xl font-bold text-foreground mt-1">{stats.byFormLevel[1] || 0}</p>
            </div>
          </CardContent>
        </Card>

        {/* Form 2 */}
        <Card className="overflow-hidden border-l-4 border-l-green-500 bg-gradient-to-br from-green-500/5 to-transparent">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Form 2</p>
              <p className="text-3xl font-bold text-foreground mt-1">{stats.byFormLevel[2] || 0}</p>
            </div>
          </CardContent>
        </Card>

        {/* Form 3 */}
        <Card className="overflow-hidden border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-500/5 to-transparent">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Form 3</p>
              <p className="text-3xl font-bold text-foreground mt-1">{stats.byFormLevel[3] || 0}</p>
            </div>
          </CardContent>
        </Card>

        {/* Form 4 */}
        <Card className="overflow-hidden border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-500/5 to-transparent">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Form 4</p>
              <p className="text-3xl font-bold text-foreground mt-1">{stats.byFormLevel[4] || 0}</p>
            </div>
          </CardContent>
        </Card>

        {/* Form 5 */}
        <Card className="overflow-hidden border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-500/5 to-transparent">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Form 5</p>
              <p className="text-3xl font-bold text-foreground mt-1">{stats.byFormLevel[5] || 0}</p>
            </div>
          </CardContent>
        </Card>

        {/* Form 6 */}
        <Card className="overflow-hidden border-l-4 border-l-pink-500 bg-gradient-to-br from-pink-500/5 to-transparent">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Form 6</p>
              <p className="text-3xl font-bold text-foreground mt-1">{stats.byFormLevel[6] || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

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
              <Button onClick={() => setUploadDialogOpen(true)} variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Excel
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

      {/* Upload Excel Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileSpreadsheet className="h-5 w-5 mr-2" />
              Upload Students from Excel
            </DialogTitle>
            <DialogDescription>
              Upload multiple students at once using an Excel file
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Instructions */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-sm">Instructions:</h4>
              <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
                <li>Select the form level for all students in the upload</li>
                <li>Download the Excel template using the button below</li>
                <li>Fill in the student information in the template</li>
                <li>Upload the completed Excel file</li>
                <li>Review the data and click "Upload Students"</li>
              </ol>
            </div>

            {/* Form Level Selector */}
            <div className="space-y-2">
              <Label>Select Form Level for All Students *</Label>
              <Select
                value={uploadFormLevel.toString()}
                onValueChange={(value) => setUploadFormLevel(parseInt(value))}>
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
              <p className="text-xs text-muted-foreground">
                All students in the uploaded file will be assigned to Form {uploadFormLevel}
              </p>
            </div>

            {/* Download Template Button */}
            <Button onClick={downloadTemplate} variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Excel Template
            </Button>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>Upload Excel File</Label>
              <Input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
              {excelFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {excelFile.name}
                </p>
              )}
            </div>

            {/* Preview Data */}
            {excelData.length > 0 && (
              <div className="space-y-2">
                <Label>Preview ({excelData.length} students)</Label>
                <div className="border rounded-lg max-h-64 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Form</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Guardian</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {excelData.slice(0, 5).map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row['Student Name'] || row['student_name'] || 'N/A'}</TableCell>
                          <TableCell>{row['Form Level'] || row['form_level'] || 'N/A'}</TableCell>
                          <TableCell className="text-xs">{row['Email'] || row['email'] || 'N/A'}</TableCell>
                          <TableCell>{row['Guardian Name'] || row['guardian_name'] || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {excelData.length > 5 && (
                    <div className="p-2 text-center text-sm text-muted-foreground border-t">
                      And {excelData.length - 5} more students...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setUploadDialogOpen(false);
                setExcelData([]);
                setExcelFile(null);
              }}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkUpload}
              disabled={excelData.length === 0 || uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload {excelData.length} Students
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Student Credentials Dialog */}
      <Dialog open={credentialsDialogOpen} onOpenChange={setCredentialsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Student Created Successfully!
            </DialogTitle>
            <DialogDescription>
              Save these login credentials for the student
            </DialogDescription>
          </DialogHeader>

          {studentCredentials && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Student Name</Label>
                  <p className="text-sm font-semibold">{studentCredentials.studentName}</p>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Registration Number</Label>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono bg-background px-2 py-1 rounded flex-1">
                      {studentCredentials.registrationNumber}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(studentCredentials.registrationNumber);
                        toast({ title: "Copied!", description: "Registration number copied to clipboard" });
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="text-sm">{studentCredentials.email}</p>
                </div>

                <div className="border-t pt-3">
                  <Label className="text-xs text-muted-foreground">Default Password</Label>
                  <div className="flex items-center gap-2">
                    <code className="text-lg font-mono bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 px-3 py-2 rounded font-bold flex-1">
                      {studentCredentials.password}
                    </code>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => {
                        navigator.clipboard.writeText(studentCredentials.password);
                        toast({ title: "Copied!", description: "Password copied to clipboard" });
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                    ⚠️ Student should change this password after first login
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Login Instructions:</strong><br />
                  The student can login using their email and the password shown above.
                  They should change their password immediately after first login.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => {
                setCredentialsDialogOpen(false);
                setStudentCredentials(null);
              }}
              className="w-full"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
