import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/Admin/AdminSidebar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlogPost, blogStorage } from '@/lib/blogStorage';
import { useAuth, User } from '@/contexts/AuthContext';
import { CreatePostModal } from '@/components/Admin/CreatePostModal';
import { CreateUserModal } from '@/components/Admin/CreateUserModal';
import { Shield, Users, FileText, Search, Edit, Trash2, Eye, Calendar, Plus, Settings, UserPlus, Crown, Mail, MoreHorizontal, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const AdminDashboard = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeSection, setActiveSection] = useState('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUserData, setNewUserData] = useState<{ name: string; email: string; password: string; role: 'user' | 'admin' }>({ name: '', email: '', password: '', role: 'user' });
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) {
      // Load all posts
      const allPosts = blogStorage.getAllPosts();
      setPosts(allPosts);
      setFilteredPosts(allPosts);

      // Load all users
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]')
        .map((u: any) => ({ ...u, password: undefined })); // Remove passwords for display
      setUsers(allUsers);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(
        post =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.authorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [searchTerm, posts]);

  const handleDeletePost = (postId: string) => {
    if (blogStorage.deletePost(postId)) {
      const updatedPosts = posts.filter(post => post.id !== postId);
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts.filter(post =>
        searchTerm.trim() === '' ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.authorName.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      
      toast({
        title: 'Post deleted',
        description: 'The blog post has been deleted successfully.',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete the post.',
        variant: 'destructive',
      });
    }
  };

  const handleEditPost = (post: BlogPost) => {
    if (blogStorage.updatePost(post.id, post)) {
      const updatedPosts = posts.map(p => p.id === post.id ? post : p);
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts.filter(p =>
        searchTerm.trim() === '' ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.authorName.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      setEditingPost(null);
      
      toast({
        title: 'Post updated',
        description: 'The blog post has been updated successfully.',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update the post.',
        variant: 'destructive',
      });
    }
  };

  const handleTogglePublish = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      const updatedPost = { ...post, published: !post.published };
      handleEditPost(updatedPost);
    }
  };

  const handleDeleteUser = (userId: string) => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = storedUsers.filter((u: any) => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    const usersWithoutPasswords = updatedUsers.map((u: any) => ({ ...u, password: undefined }));
    setUsers(usersWithoutPasswords);
    
    toast({
      title: 'User deleted',
      description: 'The user has been deleted successfully.',
    });
  };

  const handleCreateUser = (userData: { name: string; email: string; password: string; role: 'user' | 'admin' }) => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (storedUsers.find((u: any) => u.email === userData.email)) {
      toast({
        title: 'Error',
        description: 'A user with this email already exists.',
        variant: 'destructive',
      });
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
    };

    storedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(storedUsers));
    
    const usersWithoutPasswords = storedUsers.map((u: any) => ({ ...u, password: undefined }));
    setUsers(usersWithoutPasswords);
    
    toast({
      title: 'User created',
      description: 'New user has been created successfully.',
    });
  };

  const handlePostCreated = () => {
    // Refresh posts when a new post is created
    const allPosts = blogStorage.getAllPosts();
    setPosts(allPosts);
    setFilteredPosts(allPosts);
  };

  const handleEditUser = (userData: User) => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = storedUsers.map((u: any) => 
      u.id === userData.id ? { ...u, ...userData } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    const usersWithoutPasswords = updatedUsers.map((u: any) => ({ ...u, password: undefined }));
    setUsers(usersWithoutPasswords);
    setEditingUser(null);
    
    toast({
      title: 'User updated',
      description: 'User information has been updated successfully.',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">
            You don't have permission to access the admin dashboard.
          </p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="card-magical cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {adminUsers} admin{adminUsers !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-magical cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
          </CardContent>
        </Card>
        
        <Card className="card-magical cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{publishedPosts}</div>
          </CardContent>
        </Card>
        
        <Card className="card-magical cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{draftPosts}</div>
          </CardContent>
        </Card>
        
        <Card className="card-magical cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posts.filter(post => {
                const postDate = new Date(post.createdAt);
                const now = new Date();
                return postDate.getMonth() === now.getMonth() && 
                       postDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPostsManagement = () => (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 search-magical"
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsCreatePostOpen(true)}
            className="btn-magical w-full sm:w-auto"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Quick Create
          </Button>
          <Button asChild variant="outline" className="hover-scale w-full sm:w-auto">
            <Link to="/create">
              <Plus className="h-4 w-4 mr-2" />
              Full Editor
            </Link>
          </Button>
        </div>
      </div>

      {/* Posts Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Title</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">Author</th>
                <th className="text-left p-4 font-medium hidden lg:table-cell">Created</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="border-t table-row-hover">
                    <td className="p-4">
                      <div className="space-y-1">
                        <Link 
                          to={`/post/${post.id}`} 
                          className="font-medium hover:text-primary block"
                        >
                          {post.title}
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {post.excerpt}
                        </p>
                        <div className="text-xs text-muted-foreground md:hidden">
                          By {post.authorName}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="text-sm">
                        {post.authorName}
                      </div>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <div className="text-sm text-muted-foreground">
                        {formatDate(post.createdAt)}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={post.published ? 'default' : 'secondary'}>
                        {post.published ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/post/${post.id}`} className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              View Post
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditingPost(post)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Quick Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/edit/${post.id}`} className="cursor-pointer">
                              <Settings className="mr-2 h-4 w-4" />
                              Full Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTogglePublish(post.id)}>
                            {post.published ? (
                              <>
                                <Eye className="mr-2 h-4 w-4" />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <Eye className="mr-2 h-4 w-4" />
                                Publish
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Post
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Post</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{post.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeletePost(post.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {searchTerm ? 'No matching posts' : 'No posts yet'}
                    </h3>
                    <p className="text-muted-foreground">
                      {searchTerm 
                        ? `No posts match "${searchTerm}"`
                        : 'Posts will appear here once users start creating content.'
                      }
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUsersManagement = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <h3 className="text-lg font-semibold">
            All Users ({users.length})
          </h3>
          <Button 
            onClick={() => setIsCreateUserOpen(true)}
            className="btn-magical w-full sm:w-auto"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add New User
          </Button>
        </div>

        {/* Users Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">Email</th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell">Joined</th>
                  <th className="text-left p-4 font-medium">Role</th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell">Posts</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u.id} className="border-t table-row-hover">
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="font-medium flex items-center gap-2">
                            {u.name}
                            {u.role === 'admin' && <Crown className="h-4 w-4 text-primary" />}
                          </div>
                          <div className="text-sm text-muted-foreground md:hidden">
                            {u.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <div className="text-sm">
                          {u.email}
                        </div>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <div className="text-sm text-muted-foreground">
                          {formatDate(u.createdAt)}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <div className="text-sm text-muted-foreground">
                          {blogStorage.getPostsByAuthor(u.id).length} post{blogStorage.getPostsByAuthor(u.id).length !== 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingUser(u)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a href={`mailto:${u.email}`} className="cursor-pointer">
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </a>
                            </DropdownMenuItem>
                            {u.id !== user?.id && (
                              <>
                                <DropdownMenuSeparator />
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete User
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete User</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete {u.name}? This action cannot be undone and will remove all their posts.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteUser(u.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center">
                      <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No users yet</h3>
                      <p className="text-muted-foreground">
                        Users will appear here once they register on the platform.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'posts':
        return renderPostsManagement();
      case 'users':
        return renderUsersManagement();
      case 'settings':
        return (
          <div className="space-y-6">
            <Card className="p-8 text-center">
              <Settings className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Settings</h3>
              <p className="text-muted-foreground">Platform settings coming soon...</p>
            </Card>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  const totalPosts = posts.length;
  const publishedPosts = posts.filter(post => post.published).length;
  const draftPosts = posts.filter(post => !post.published).length;
  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.role === 'admin').length;

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <AdminSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        <main className="flex-1">
          {/* Global trigger */}
          <header className="h-12 flex items-center border-b px-4">
            <SidebarTrigger />
          </header>
          
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                  Manage users, posts, and platform settings
                </p>
              </div>
            </div>

            {/* Content based on active section */}
            {renderContent()}
          </div>
        </main>
      </div>
      
      {/* Edit Post Modal */}
      {editingPost && (
        <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Post</DialogTitle>
              <DialogDescription>
                Make quick changes to the blog post details.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-excerpt">Excerpt</Label>
                <Textarea
                  id="edit-excerpt"
                  value={editingPost.excerpt}
                  onChange={(e) => setEditingPost({...editingPost, excerpt: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                  rows={8}
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-published"
                    checked={editingPost.published}
                    onChange={(e) => setEditingPost({...editingPost, published: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="edit-published">Published</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingPost(null)}>Cancel</Button>
              <Button onClick={() => handleEditPost(editingPost)}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-user-name">Name</Label>
                <Input
                  id="edit-user-name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-user-email">Email</Label>
                <Input
                  id="edit-user-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-user-role">Role</Label>
                <Select value={editingUser.role} onValueChange={(value: 'user' | 'admin') => setEditingUser({...editingUser, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
              <Button onClick={() => handleEditUser(editingUser)}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Post Modal */}
      <CreatePostModal 
        open={isCreatePostOpen}
        onOpenChange={setIsCreatePostOpen}
        onPostCreated={handlePostCreated}
      />

      {/* Create User Modal */}
      <CreateUserModal 
        open={isCreateUserOpen}
        onOpenChange={setIsCreateUserOpen}
        onUserCreated={handleCreateUser}
      />
    </SidebarProvider>
  );
};