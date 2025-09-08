import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, Search, Plus, Edit, Eye, Globe, MapPin } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  type: "University" | "Corporation" | "NGO" | "Government" | "Startup";
  industry: string;
  status: "Active" | "Pending" | "Inactive";
  opportunities: number;
  location: string;
  website: string;
  joinDate: string;
  contact: string;
}

export default function PartnerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const mockPartners: Partner[] = [
    {
      id: "1",
      name: "University of Nairobi",
      type: "University",
      industry: "Education",
      status: "Active",
      opportunities: 15,
      location: "Nairobi, Kenya",
      website: "www.uonbi.ac.ke",
      joinDate: "2023-08-15",
      contact: "partnerships@uonbi.ac.ke"
    },
    {
      id: "2",
      name: "Safaricom PLC",
      type: "Corporation",
      industry: "Telecommunications",
      status: "Active",
      opportunities: 28,
      location: "Nairobi, Kenya",
      website: "www.safaricom.co.ke",
      joinDate: "2023-09-01",
      contact: "careers@safaricom.co.ke"
    },
    {
      id: "3",
      name: "TechStart Kenya",
      type: "NGO",
      industry: "Technology",
      status: "Pending",
      opportunities: 0,
      location: "Mombasa, Kenya",
      website: "www.techstart.co.ke",
      joinDate: "2024-01-10",
      contact: "info@techstart.co.ke"
    },
    {
      id: "4",
      name: "KENGEN",
      type: "Government",
      industry: "Energy",
      status: "Active",
      opportunities: 12,
      location: "Nairobi, Kenya",
      website: "www.kengen.co.ke",
      joinDate: "2023-10-20",
      contact: "hr@kengen.co.ke"
    },
    {
      id: "5",
      name: "iHub Nairobi",
      type: "Startup",
      industry: "Technology",
      status: "Active",
      opportunities: 8,
      location: "Nairobi, Kenya",
      website: "www.ihub.co.ke",
      joinDate: "2023-11-05",
      contact: "partnerships@ihub.co.ke"
    }
  ];

  const filteredPartners = mockPartners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || partner.type === typeFilter;
    const matchesStatus = statusFilter === "all" || partner.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active": return "default";
      case "Pending": return "secondary";
      case "Inactive": return "outline";
      default: return "secondary";
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "University": return "bg-blue-100 text-blue-800";
      case "Corporation": return "bg-green-100 text-green-800";
      case "NGO": return "bg-purple-100 text-purple-800";
      case "Government": return "bg-orange-100 text-orange-800";
      case "Startup": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Partner Management
            </div>
            <Button className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Partner
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search partners..."
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
                <SelectItem value="University">University</SelectItem>
                <SelectItem value="Corporation">Corporation</SelectItem>
                <SelectItem value="NGO">NGO</SelectItem>
                <SelectItem value="Government">Government</SelectItem>
                <SelectItem value="Startup">Startup</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Partners Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Opportunities</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{partner.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Globe className="h-3 w-3 mr-1" />
                          {partner.website}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeColor(partner.type)}`}>
                        {partner.type}
                      </span>
                    </TableCell>
                    <TableCell>{partner.industry}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(partner.status)}>
                        {partner.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-center font-medium">
                        {partner.opportunities}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                        {partner.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
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

      {/* Partner Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">52</div>
            <div className="text-sm text-muted-foreground">Total Partners</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">18</div>
            <div className="text-sm text-muted-foreground">Universities</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">24</div>
            <div className="text-sm text-muted-foreground">Corporations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">189</div>
            <div className="text-sm text-muted-foreground">Opportunities</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">95%</div>
            <div className="text-sm text-muted-foreground">Active Rate</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}