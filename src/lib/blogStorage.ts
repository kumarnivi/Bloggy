export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

class BlogStorage {
  private storageKey = 'blogPosts';

  constructor() {
    this.initializeDemoData();
  }

  private initializeDemoData() {
    if (!localStorage.getItem(this.storageKey)) {
      const demoPosts: BlogPost[] = [
        {
          id: '1',
          title: 'Welcome to Our Blog Platform',
          content: `# Welcome to Our Blog Platform

This is a demonstration of our modern blog platform built with React and TypeScript. Here are some of the features you can explore:

## Features

- **User Authentication**: Secure login and registration system
- **Role-based Access**: Different permissions for users and administrators
- **Rich Content**: Write and edit blog posts with markdown support
- **Responsive Design**: Beautiful UI that works on all devices
- **Real-time Updates**: See changes instantly as you make them

## Getting Started

To get started, you can:

1. **Login** with demo credentials:
   - Admin: admin@blog.com / admin123
   - User: user@blog.com / user123

2. **Register** your own account

3. **Create** your first blog post

4. **Explore** the admin dashboard if you're an administrator

We hope you enjoy using our platform!`,
          excerpt: 'Welcome to our modern blog platform. Discover features like user authentication, role-based access, and rich content creation.',
          authorId: '1',
          authorName: 'Admin User',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          published: true,
        },
        {
          id: '2',
          title: 'The Future of Web Development',
          content: `# The Future of Web Development

Web development continues to evolve at a rapid pace. Here are some trends to watch:

## Modern Frontend Technologies

- **React & TypeScript**: Type-safe component development
- **Tailwind CSS**: Utility-first styling approach
- **Server Components**: Better performance and SEO

## Development Practices

- **Component-driven Development**: Reusable, maintainable code
- **Progressive Enhancement**: Starting with a solid foundation
- **Accessibility First**: Building for everyone

The future looks bright for web developers who embrace these modern approaches!`,
          excerpt: 'Exploring the latest trends and technologies shaping the future of web development.',
          authorId: '2',
          authorName: 'John Doe',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          published: true,
        },
        {
          id: '3',
          title: 'Building Better User Experiences',
          content: `# Building Better User Experiences

User experience is at the heart of every successful application. Here's how we approach UX design:

## Core Principles

1. **Simplicity**: Keep interfaces clean and intuitive
2. **Consistency**: Maintain design patterns throughout
3. **Accessibility**: Ensure everyone can use your app
4. **Performance**: Fast loading times and smooth interactions

## Design Process

Our design process involves:

- User research and persona development
- Wireframing and prototyping
- Usability testing and iteration
- Implementation with attention to detail

Great UX doesn't happen by accident - it's the result of careful planning and execution.`,
          excerpt: 'Learn about the principles and processes behind creating exceptional user experiences.',
          authorId: '1',
          authorName: 'Admin User',
          createdAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
          published: true,
        },
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(demoPosts));
    }
  }

  getAllPosts(): BlogPost[] {
    const posts = localStorage.getItem(this.storageKey);
    return posts ? JSON.parse(posts) : [];
  }

  getPublishedPosts(): BlogPost[] {
    return this.getAllPosts()
      .filter(post => post.published)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getPostById(id: string): BlogPost | null {
    const posts = this.getAllPosts();
    return posts.find(post => post.id === id) || null;
  }

  getPostsByAuthor(authorId: string): BlogPost[] {
    return this.getAllPosts()
      .filter(post => post.authorId === authorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): BlogPost {
    const posts = this.getAllPosts();
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    posts.push(newPost);
    localStorage.setItem(this.storageKey, JSON.stringify(posts));
    return newPost;
  }

  updatePost(id: string, updates: Partial<BlogPost>): BlogPost | null {
    const posts = this.getAllPosts();
    const index = posts.findIndex(post => post.id === id);
    
    if (index === -1) return null;
    
    posts[index] = {
      ...posts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(this.storageKey, JSON.stringify(posts));
    return posts[index];
  }

  deletePost(id: string): boolean {
    const posts = this.getAllPosts();
    const filteredPosts = posts.filter(post => post.id !== id);
    
    if (filteredPosts.length === posts.length) return false;
    
    localStorage.setItem(this.storageKey, JSON.stringify(filteredPosts));
    return true;
  }
}

export const blogStorage = new BlogStorage();