import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import React from 'react';


const DashboardPage: React.FC = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
        Dashboard
      </h1>

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
};

export default DashboardPage; 