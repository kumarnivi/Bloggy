import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BlogPost, blogStorage } from '@/lib/blogStorage';
import { Search, Calendar, User, BookOpen, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const allPosts = blogStorage.getAllPosts().filter(post => post.published);
    setPosts(allPosts);
    setFilteredPosts(allPosts);
  }, []);

  useEffect(() => {
    let filtered = posts;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        post =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.authorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort posts
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.authorName.localeCompare(b.authorName);
        default: // newest
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    setFilteredPosts(filtered);
  }, [searchTerm, sortBy, posts]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            All Blog Posts
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover stories, insights, and ideas from our community of writers.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts, authors, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
              <SelectItem value="author">Author A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredPosts.length === posts.length 
              ? `Showing all ${posts.length} posts`
              : `Showing ${filteredPosts.length} of ${posts.length} posts`
            }
          </p>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <CardContent className="p-0">
                  {/* Post Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-primary/40" />
                  </div>
                  
                  <div className="p-6">
                    {/* Post Meta */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.authorName}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      <Link to={`/post/${post.id}`} className="line-clamp-2">
                        {post.title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {getReadingTime(post.content)}
                      </Badge>
                      
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/post/${post.id}`}>
                          Read More
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12">
            <div className="text-center">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? 'No matching posts found' : 'No posts available'}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? `Try adjusting your search terms or browse all posts.`
                  : 'Check back later for new content from our writers.'
                }
              </p>
              {searchTerm && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};