import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogPost, blogStorage } from '@/lib/blogStorage';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PostFormProps {
  post?: BlogPost;
  onSave?: () => void;
}

export const PostForm = ({ post, onSave }: PostFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [published, setPublished] = useState(post?.published || false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      if (post) {
        // Update existing post
        blogStorage.updatePost(post.id, {
          title,
          content,
          excerpt,
          published,
        });
        
        toast({
          title: 'Post updated',
          description: 'Your blog post has been updated successfully.',
        });
      } else {
        // Create new post
        blogStorage.createPost({
          title,
          content,
          excerpt,
          published,
          authorId: user.id,
          authorName: user.name,
        });
        
        toast({
          title: 'Post created',
          description: 'Your blog post has been created successfully.',
        });
        
        navigate('/dashboard');
      }
      
      onSave?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save the post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateExcerpt = () => {
    if (content) {
      // Remove markdown formatting and take first 150 characters
      const plainText = content.replace(/[#*`\[\]]/g, '').trim();
      const excerpt = plainText.length > 150 
        ? plainText.substring(0, 150) + '...'
        : plainText;
      setExcerpt(excerpt);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{post ? 'Edit Post' : 'Create New Post'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title..."
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateExcerpt}
                disabled={!content}
              >
                Generate from content
              </Button>
            </div>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief description of your post..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here... (Markdown supported)"
              rows={12}
              required
            />
            <p className="text-xs text-muted-foreground">
              Tip: You can use Markdown formatting (# for headers, **bold**, *italic*, etc.)
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={published}
              onCheckedChange={setPublished}
            />
            <Label htmlFor="published">Publish immediately</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};