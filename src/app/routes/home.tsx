import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function HomePage() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Welcome back, {user?.name || 'User'}!</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Manage your active projects</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You have 3 active projects</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Track your pending tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You have 5 pending tasks</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>View project performance</CardDescription>
          </CardHeader>
          <CardContent>
            <p>30% increase in productivity</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}