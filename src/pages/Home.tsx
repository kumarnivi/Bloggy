import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BlogCard } from '@/components/Blog/BlogCard';
import { BlogPost, blogStorage } from '@/lib/blogStorage';
import { Search, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const Home = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const allPosts = blogStorage.getPublishedPosts();
    setPosts(allPosts);
    setFilteredPosts(allPosts);
  }, []);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20">
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-primary to-primary-glow bg-clip-text text-transparent">
              Welcome to BlogApp
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover amazing stories, insights, and ideas from our community of writers. 
              Join the conversation and share your own thoughts.
            </p>
            {!isAuthenticated && (
              <div className="flex items-center justify-center gap-4 pt-4">
                <Button size="lg" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            )}
            {isAuthenticated && (
              <Button size="lg" asChild>
                <Link to="/create">
                  <PenTool className="mr-2 h-5 w-5" />
                  Write a Post
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Search and Posts Section */}
      <section className="py-16">
        <div className="container">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts by title, content, or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 text-base"
              />
            </div>
          </div>

          {/* Posts Grid */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Latest Posts</h2>
              <p className="text-muted-foreground">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
              </p>
            </div>

            {filteredPosts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto max-w-sm">
                  <div className="rounded-full bg-muted p-6 mx-auto w-fit mb-4">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm 
                      ? `No posts match "${searchTerm}". Try a different search term.`
                      : 'No published posts available yet.'
                    }
                  </p>
                  {isAuthenticated && (
                    <Button asChild>
                      <Link to="/create">Create the first post</Link>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};