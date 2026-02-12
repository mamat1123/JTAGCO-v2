import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { ShoeReturnWithDetails } from '@/entities/ShoeReturn/shoeReturn';
import { shoeReturnAPI } from '@/entities/ShoeReturn/shoeReturnAPI';

export const ShoeReturnsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReturn, setSelectedReturn] = useState<ShoeReturnWithDetails | null>(null);
  const [reason, setReason] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setSelectedReturn(mockReturns[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mock data - Replace with actual API call
  const mockReturns: ShoeReturnWithDetails[] = [
    {
      id: "1",
      eventShoeVariantId: "1",
      quantity: 2,
      returnedBy: 1,
      returnedAt: "2024-03-20",
      reason: "Wrong size",
      createdAt: "2024-03-20",
      eventName: "Summer Event 2024",
      shoeVariantName: "Nike Air Max",
      returnedByName: "John Doe",
    },
  ];

  const handleCreateReturn = async () => {
    if (!selectedReturn) return;
    
    try {
      await shoeReturnAPI.create({
        eventShoeVariantId: selectedReturn.eventShoeVariantId,
        quantity: selectedReturn.quantity,
        returnedBy: selectedReturn.returnedBy,
        reason,
      });
      // Refresh the list
      setIsDialogOpen(false);
      setReason("");
    } catch (error) {
      console.error('Failed to create return:', error);
    }
  };

  const filteredReturns = mockReturns.filter((returnItem) => {
    return (
      returnItem.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.shoeVariantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.returnedByName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shoe Returns Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Search by event, shoe variant, or returned by..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Create New Return</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Return</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Enter reason for return"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  />
                  <Button
                    onClick={handleCreateReturn}
                    className="w-full"
                    disabled={!reason}
                  >
                    Submit Return
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Shoe Variant</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Returned By</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReturns.map((returnItem) => (
                  <TableRow key={returnItem.id}>
                    <TableCell>{returnItem.eventName}</TableCell>
                    <TableCell>{returnItem.shoeVariantName}</TableCell>
                    <TableCell>{returnItem.quantity}</TableCell>
                    <TableCell>{returnItem.returnedByName}</TableCell>
                    <TableCell>{new Date(returnItem.returnedAt).toLocaleDateString()}</TableCell>
                    <TableCell>{returnItem.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 