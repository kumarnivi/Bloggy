import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { PostForm } from '@/components/Blog/PostForm';
import { BlogPost, blogStorage } from '@/lib/blogStorage';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (id) {
      const foundPost = blogStorage.getPostById(id);
      setPost(foundPost);
    }
    setLoading(false);
  }, [id]);

  const handleSave = () => {
    // Refresh the post data after saving
    if (id) {
      const updatedPost = blogStorage.getPostById(id);
      setPost(updatedPost);
    }
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
          <p className="text-muted-foreground mb-6">The blog post you're trying to edit doesn't exist.</p>
          <Button asChild>
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Check if user can edit this post
  const canEdit = user && (post.authorId === user.id || isAdmin);
  
  if (!canEdit) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Edit Post</h1>
            <p className="text-muted-foreground">
              Make changes to your blog post
            </p>
          </div>
          
          <PostForm post={post} onSave={handleSave} />
        </div>
      </div>
    </div>
  );
};