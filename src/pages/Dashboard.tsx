import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BlogPost, blogStorage } from '@/lib/blogStorage';
import { useAuth } from '@/contexts/AuthContext';
import { PenTool, Search, Edit, Trash2, Eye, Plus, Sparkles, MoreHorizontal, Settings } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export const Dashboard = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    published: false
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const userPosts = blogStorage.getPostsByAuthor(user.id);
      setPosts(userPosts);
      setFilteredPosts(userPosts);
    }
  }, [user]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(
        post =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [searchTerm, posts]);

  const handleDelete = (postId: string) => {
    if (blogStorage.deletePost(postId)) {
      const updatedPosts = posts.filter(post => post.id !== postId);
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts.filter(post =>
        searchTerm.trim() === '' ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      
      toast({
        title: '✨ Post deleted',
        description: 'Your blog post has been deleted successfully.',
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
        p.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      setEditingPost(null);
      
      toast({
        title: '✨ Post updated',
        description: 'Your blog post has been updated successfully.',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update the post.',
        variant: 'destructive',
      });
    }
  };

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const postData = {
      ...newPost,
      authorId: user?.id || '',
      authorName: user?.name || 'Anonymous',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const createdPost = blogStorage.createPost(postData);
    if (createdPost) {
      const updatedPosts = [createdPost, ...posts];
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
      setNewPost({ title: '', excerpt: '', content: '', published: false });
      setIsCreatePostOpen(false);
      
      toast({
        title: '✨ Post created',
        description: 'Your new blog post has been created successfully.',
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const publishedCount = posts.filter(post => post.published).length;
  const draftCount = posts.filter(post => !post.published).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your blog posts and track your writing progress
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsCreatePostOpen(true)}
                className="btn-magical cursor-magic"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Quick Create
              </Button>
              <Button asChild variant="outline" className="hover-scale">
                <Link to="/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Full Editor
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="card-magical hover-glow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                <PenTool className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{posts.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Your content library
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-magical hover-glow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
                <Eye className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{publishedCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Live on your blog
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-magical hover-glow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                <Edit className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{draftCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Work in progress
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 search-magical"
            />
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Your Posts ({filteredPosts.length})
          </h2>

          {filteredPosts.length > 0 ? (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="card-magical hover-float">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold story-link">
                            <Link to={`/post/${post.id}`}>{post.title}</Link>
                          </h3>
                          <Badge variant={post.published ? 'default' : 'secondary'}>
                            {post.published ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Created {formatDate(post.createdAt)}</span>
                          {post.updatedAt !== post.createdAt && (
                            <span>Updated {formatDate(post.updatedAt)}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="hover-scale">
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
                              <AlertDialogContent className="modal-content">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Post</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{post.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="hover-scale">Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(post.id)}
                                    className="btn-delete"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 card-magical">
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary/20 to-primary-glow/20 rounded-full flex items-center justify-center hover-glow">
                  <PenTool className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {searchTerm ? 'No matching posts' : 'No posts yet'}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? `No posts match "${searchTerm}". Try a different search term.`
                      : 'Start writing your first blog post to see it here.'
                    }
                  </p>
                </div>
                {!searchTerm && (
                  <div className="flex gap-2 justify-center">
                    <Button
                      onClick={() => setIsCreatePostOpen(true)}
                      className="btn-magical"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Quick Create
                    </Button>
                    <Button asChild variant="outline" className="hover-scale">
                      <Link to="/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Full Editor
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Quick Create Post Modal */}
        <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
          <DialogContent className="modal-content max-w-2xl">
            <DialogHeader className="space-y-4">
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="h-6 w-6 text-primary" />
                Create New Post
              </DialogTitle>
              <DialogDescription>
                Quickly create a new blog post. You can always edit it later using the full editor.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Enter post title..."
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="search-magical"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt" className="text-sm font-medium">
                  Excerpt
                </Label>
                <Input
                  id="excerpt"
                  placeholder="Brief description of your post..."
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                  className="search-magical"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium">
                  Content <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="content"
                  placeholder="Write your post content..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="search-magical min-h-[200px]"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="publish"
                  checked={newPost.published}
                  onChange={(e) => setNewPost({ ...newPost, published: e.target.checked })}
                  className="rounded border-border"
                />
                <Label htmlFor="publish" className="text-sm font-medium cursor-pointer">
                  Publish immediately
                </Label>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreatePostOpen(false)}
                className="hover-scale"
              >
                Cancel
              </Button>
              <Button onClick={handleCreatePost} className="btn-magical">
                <Sparkles className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Quick Edit Post Modal */}
        {editingPost && (
          <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
            <DialogContent className="modal-content max-w-2xl">
              <DialogHeader className="space-y-4">
                <DialogTitle className="flex items-center gap-2 text-2xl">
                  <Edit className="h-6 w-6 text-primary" />
                  Edit Post
                </DialogTitle>
                <DialogDescription>
                  Make quick changes to your post. For advanced editing, use the full editor.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="edit-title" className="text-sm font-medium">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-title"
                    value={editingPost.title}
                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    className="search-magical"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-excerpt" className="text-sm font-medium">
                    Excerpt
                  </Label>
                  <Input
                    id="edit-excerpt"
                    value={editingPost.excerpt}
                    onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                    className="search-magical"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-content" className="text-sm font-medium">
                    Content <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="edit-content"
                    value={editingPost.content}
                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                    className="search-magical min-h-[200px]"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-publish"
                    checked={editingPost.published}
                    onChange={(e) => setEditingPost({ ...editingPost, published: e.target.checked })}
                    className="rounded border-border"
                  />
                  <Label htmlFor="edit-publish" className="text-sm font-medium cursor-pointer">
                    Published
                  </Label>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingPost(null)}
                  className="hover-scale"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleEditPost({ ...editingPost, updatedAt: new Date().toISOString() })}
                  className="btn-edit"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Update Post
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};