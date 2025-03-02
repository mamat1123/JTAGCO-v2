import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SaleDashboardPage() {
  return (
    <div className="container">
      <h1 className="text-4xl font-bold mb-6">Sale Dashboard</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <p className="text-lg mb-6">
            We'd love to hear from you. Fill out the form and we'll get back to you as soon as possible.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Email</h3>
              <p>contact@jtagco.com</p>
            </div>
            <div>
              <h3 className="text-lg font-medium">Phone</h3>
              <p>+1 (555) 123-4567</p>
            </div>
            <div>
              <h3 className="text-lg font-medium">Address</h3>
              <p>123 Tech Street, Suite 456<br />San Francisco, CA 94105</p>
            </div>
          </div>
        </div>
        <div>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Your email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
            </div>
            <Button type="submit">Send Message</Button>
          </form>
        </div>
      </div>
    </div>
  );
}