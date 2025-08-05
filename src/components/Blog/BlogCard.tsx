import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/lib/blogStorage';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard = ({ post }: BlogCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="w-fit">
            {post.published ? 'Published' : 'Draft'}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatDate(post.createdAt)}
          </div>
        </div>
        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{post.authorName}</span>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button variant="ghost" size="sm" asChild className="ml-auto group/button">
          <Link to={`/post/${post.id}`}>
            Read more 
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};