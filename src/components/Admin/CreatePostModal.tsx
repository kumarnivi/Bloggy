import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { blogStorage, BlogPost } from '@/lib/blogStorage';
import { useToast } from '@/hooks/use-toast';
import { Plus, Sparkles } from 'lucide-react';

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated: () => void;
}

export const CreatePostModal = ({ open, onOpenChange, onPostCreated }: CreatePostModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [published, setPublished] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const generateExcerpt = (content: string) => {
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || generateExcerpt(content),
      published,
      authorId: user?.id || '',
      authorName: user?.name || 'Unknown Author',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (blogStorage.createPost(newPost)) {
      toast({
        title: 'Success!',
        description: 'Your blog post has been created successfully.',
      });
      
      // Reset form
      setTitle('');
      setContent('');
      setExcerpt('');
      setPublished(false);
      
      onPostCreated();
      onOpenChange(false);
    } else {
      toast({
        title: 'Error',
        description: 'Failed to create the blog post.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setExcerpt('');
    setPublished(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="modal-content max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Create New Blog Post
          </DialogTitle>
          <DialogDescription>
            Create a new blog post to share with your audience. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter a captivating title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="search-magical"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt" className="text-sm font-medium">
              Excerpt
            </Label>
            <Textarea
              id="excerpt"
              placeholder="Brief description of your post (auto-generated if left empty)..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="search-magical min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium">
              Content <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="content"
              placeholder="Write your amazing content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="search-magical min-h-[200px]"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={published}
              onCheckedChange={setPublished}
            />
            <Label htmlFor="published" className="text-sm font-medium cursor-pointer">
              Publish immediately
            </Label>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="hover-scale"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-magical"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};