import { Button } from "@/components/ui/button";
import { Sparkles, LayoutDashboard, Users, Zap, BarChart3, CheckCircle2 } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">Fusion Circle</span>
          </div>
          <Button asChild data-testid="button-login">
            <a href="/api/login">Sign In</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ai/10 text-ai border border-ai/20">
            <Sparkles className="h-3 w-3" />
            <span className="text-xs font-medium uppercase tracking-wide">AI-Powered Project Management</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Transform Team Collaboration with{" "}
            <span className="bg-gradient-to-r from-primary to-ai bg-clip-text text-transparent">
              Intelligent Insights
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Fusion Circle combines AI-driven task prioritization, real-time updates, and intuitive dashboards 
            to help your team ship faster and collaborate better.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" asChild className="min-w-40" data-testid="button-get-started">
              <a href="/api/login">Get Started Free</a>
            </Button>
            <Button size="lg" variant="outline" className="min-w-40" data-testid="button-learn-more">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold mb-4">Everything you need to succeed</h2>
            <p className="text-muted-foreground text-lg">
              Powerful features designed for modern teams
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-lg border border-border bg-card hover-elevate transition-all"
                data-testid={`feature-${index}`}
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-20 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2" data-testid={`stat-${index}`}>
                <div className="text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 border-t border-border">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to transform your workflow?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join teams using Fusion Circle to collaborate smarter and deliver faster.
          </p>
          <Button size="lg" asChild className="min-w-40" data-testid="button-cta-start">
            <a href="/api/login">Start Your Journey</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Fusion Circle</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Fusion Circle. Built for teams that ship.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Sparkles,
    title: "AI Task Prioritization",
    description: "Smart algorithms analyze deadlines, dependencies, and team capacity to suggest optimal task priorities.",
  },
  {
    icon: LayoutDashboard,
    title: "Interactive Kanban Boards",
    description: "Visualize your workflow with drag-and-drop boards that update in real-time across your team.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Assign tasks, track progress, and keep everyone aligned with role-based access control.",
  },
  {
    icon: Zap,
    title: "Real-Time Updates",
    description: "See changes instantly with WebSocket-powered live synchronization across all devices.",
  },
  {
    icon: BarChart3,
    title: "Insightful Analytics",
    description: "Track completion rates, workload distribution, and project health at a glance.",
  },
  {
    icon: CheckCircle2,
    title: "Streamlined Workflow",
    description: "From planning to execution, manage your entire project lifecycle in one place.",
  },
];

const stats = [
  { value: "10x", label: "Faster Task Management" },
  { value: "95%", label: "Team Satisfaction" },
  { value: "24/7", label: "Real-Time Sync" },
];
