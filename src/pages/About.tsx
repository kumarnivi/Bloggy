import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Code, Users, Zap } from 'lucide-react';

export const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            About BlogApp
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A modern, elegant platform for sharing thoughts, ideas, and stories with the world.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid gap-8 md:grid-cols-2 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                We believe everyone has a story worth sharing. BlogApp provides a beautiful, 
                intuitive platform where writers can express themselves, connect with readers, 
                and build meaningful communities around shared interests and passions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To create a space where authentic voices can thrive, where quality content 
                is celebrated, and where the art of writing continues to evolve in the 
                digital age. We're building more than a platform – we're nurturing a community.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose BlogApp?</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Modern Technology
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Built with cutting-edge web technologies for fast, responsive, 
                  and reliable performance across all devices.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Community Focused
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with like-minded writers and readers. Build your audience 
                  and engage in meaningful conversations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  User Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Clean, distraction-free interface designed to let your content 
                  shine and provide readers with the best experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Growing Community</h2>
          <div className="grid gap-8 md:grid-cols-3 max-w-3xl mx-auto">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <p className="text-muted-foreground">Active Writers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">5000+</div>
              <p className="text-muted-foreground">Published Posts</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10k+</div>
              <p className="text-muted-foreground">Monthly Readers</p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold mb-4">Built With</h3>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary">React</Badge>
            <Badge variant="secondary">TypeScript</Badge>
            <Badge variant="secondary">Tailwind CSS</Badge>
            <Badge variant="secondary">Shadcn/ui</Badge>
            <Badge variant="secondary">Vite</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};