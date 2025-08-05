import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BlogPost, blogStorage } from '@/lib/blogStorage';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Calendar, User, Edit, Trash2 } from 'lucide-react';
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

export const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      const foundPost = blogStorage.getPostById(id);
      setPost(foundPost);
    }
    setLoading(false);
  }, [id]);

  const canEdit = post && user && (post.authorId === user.id || isAdmin);

  const handleDelete = () => {
    if (post && blogStorage.deletePost(post.id)) {
      toast({
        title: 'Post deleted',
        description: 'The blog post has been deleted successfully.',
      });
      navigate('/');
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete the post.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderContent = (content: string) => {
    // Simple markdown-like rendering
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-semibold mt-6 mb-3">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold mt-4 mb-2">{line.slice(4)}</h3>;
        }
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-4">{line.slice(2)}</li>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        
        // Handle bold and italic
        let processedLine = line
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        return (
          <p key={index} className="mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: processedLine }} />
        );
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Link>
        </Button>

        {/* Post Header */}
        <article className="space-y-6">
          <header className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant={post.published ? 'default' : 'secondary'}>
                {post.published ? 'Published' : 'Draft'}
              </Badge>
              
              {canEdit && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/edit/${post.id}`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the blog post.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">{post.title}</h1>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Published {formatDate(post.createdAt)}</span>
              </div>
              {post.updatedAt !== post.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Updated {formatDate(post.updatedAt)}</span>
                </div>
              )}
            </div>
          </header>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-lg text-muted-foreground mb-8 p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
              {post.excerpt}
            </div>
            
            <div className="text-foreground space-y-4">
              {renderContent(post.content)}
            </div>
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Posts
              </Link>
            </Button>
            
            {user && (
              <Button asChild>
                <Link to="/create">Write a Post</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};