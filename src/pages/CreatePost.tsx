import { PostForm } from '@/components/Blog/PostForm';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const CreatePost = () => {
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
            <h1 className="text-3xl font-bold">Create New Post</h1>
            <p className="text-muted-foreground">
              Share your thoughts and ideas with the community
            </p>
          </div>
          
          <PostForm />
        </div>
      </div>
    </div>
  );
};