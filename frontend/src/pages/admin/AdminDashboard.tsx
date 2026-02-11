import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/db/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Users, Activity, TrendingUp, MessageSquare, Search, Send } from "lucide-react";
import { toast } from "sonner";

interface AdminStats {
  total_users: number;
  active_users_today: number;
  active_users_week: number;
  new_users_today: number;
  new_users_week: number;
  total_applications: number;
  total_interviews: number;
  total_tasks_completed: number;
  completion_rate: number;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  total_tasks: number;
  completed_tasks: number;
  total_applications: number;
}

export const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Check if user is admin
    const { data: adminData, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error || !adminData) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/dashboard");
      return;
    }

    // Load admin data
    loadAdminStats();
    loadUsers();
  };

  const loadAdminStats = async () => {
    try {
      const { data, error } = await supabase.rpc("get_admin_dashboard_stats");

      if (error) throw error;

      setStats(data);
    } catch (error) {
      console.error("Error loading admin stats:", error);
      toast.error("Failed to load statistics");
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);

      // Get all users with their profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select(`
          user_id,
          full_name,
          created_at
        `)
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Get user statistics
      const usersWithStats = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: stats } = await supabase.rpc("get_user_statistics", {
            target_user_id: profile.user_id,
          });

          // Get user email from auth.users table
          const { data: authUsers } = await supabase
            .from("auth.users")
            .select("email")
            .eq("id", profile.user_id)
            .single();

          return {
            id: profile.user_id,
            email: authUsers?.email || "N/A",
            full_name: profile.full_name || "N/A",
            created_at: profile.created_at,
            total_tasks: stats?.total_tasks || 0,
            completed_tasks: stats?.completed_tasks || 0,
            total_applications: stats?.total_applications || 0,
          };
        })
      );

      setUsers(usersWithStats);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!messageSubject || !messageBody) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setSendingMessage(true);

      // Get admin user record
      const { data: adminData } = await supabase
        .from("admin_users")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      if (!adminData) {
        toast.error("Admin record not found");
        return;
      }

      // Send message
      const { error } = await supabase.from("user_messages").insert({
        from_admin_id: adminData.id,
        to_user_id: selectedUser?.id || null,
        subject: messageSubject,
        message: messageBody,
      });

      if (error) throw error;

      toast.success(
        selectedUser
          ? `Message sent to ${selectedUser.full_name}`
          : "Message sent to all users"
      );

      setMessageSubject("");
      setMessageBody("");
      setSelectedUser(null);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateProgress = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users and monitor platform activity
          </p>
        </div>
        <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.new_users_week || 0} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active_users_today || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.active_users_week || 0} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_applications || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.total_interviews || 0} interviews scheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completion_rate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              {stats?.total_tasks_completed || 0} tasks completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                View and manage all registered users
              </CardDescription>
              <div className="flex items-center space-x-2 pt-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {calculateProgress(user.completed_tasks, user.total_tasks)}%
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            ({user.completed_tasks}/{user.total_tasks})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge>{user.total_applications}</Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Message
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Send Message to {user.full_name}</DialogTitle>
                              <DialogDescription>
                                Send a direct message to this user
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                  id="subject"
                                  value={messageSubject}
                                  onChange={(e) => setMessageSubject(e.target.value)}
                                  placeholder="Message subject"
                                />
                              </div>
                              <div>
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                  id="message"
                                  value={messageBody}
                                  onChange={(e) => setMessageBody(e.target.value)}
                                  placeholder="Type your message here..."
                                  rows={5}
                                />
                              </div>
                              <Button
                                onClick={sendMessage}
                                disabled={sendingMessage}
                                className="w-full"
                              >
                                <Send className="h-4 w-4 mr-2" />
                                {sendingMessage ? "Sending..." : "Send Message"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Broadcast Message</CardTitle>
              <CardDescription>
                Send a message to all users on the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="broadcast-subject">Subject</Label>
                <Input
                  id="broadcast-subject"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  placeholder="Message subject"
                />
              </div>
              <div>
                <Label htmlFor="broadcast-message">Message</Label>
                <Textarea
                  id="broadcast-message"
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  placeholder="Type your message here..."
                  rows={8}
                />
              </div>
              <Button
                onClick={() => {
                  setSelectedUser(null);
                  sendMessage();
                }}
                disabled={sendingMessage}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                {sendingMessage ? "Sending..." : "Send to All Users"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
