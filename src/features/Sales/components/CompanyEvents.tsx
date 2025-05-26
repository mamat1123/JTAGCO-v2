import { useEffect, useState } from "react";
import { Event } from "@/entities/Event/types";
import { eventAPI } from "@/entities/Event/eventAPI";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { format } from "date-fns";
import { th } from "date-fns/locale";

interface CompanyEventsProps {
  companyId: string;
}

export function CompanyEvents({ companyId }: CompanyEventsProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventAPI.getEvents({ company_id: companyId });
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [companyId]);

  if (loading) {
    return <div className="text-center py-4">กำลังโหลด...</div>;
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">ประวัติการติดต่อ</CardTitle>
          <CardDescription>ไม่มีประวัติการติดต่อ</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">ประวัติการติดต่อ</CardTitle>
        <CardDescription>ประวัติการติดต่อกับบริษัท</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border rounded-lg p-4 space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {format(new Date(event.scheduled_at), 'PPP', { locale: th })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(event.scheduled_at), 'HH:mm', { locale: th })}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  event.status === 'completed' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {event.status === 'completed' ? 'เสร็จสิ้น' : 'วางแผน'}
                </span>
              </div>
              {event.description && (
                <p className="text-sm text-gray-600">{event.description}</p>
              )}
              {event.test_start_at && event.test_end_at && (
                <div className="text-sm text-gray-500">
                  <p>เวลาเริ่มต้น: {format(new Date(event.test_start_at), 'HH:mm', { locale: th })}</p>
                  <p>เวลาสิ้นสุด: {format(new Date(event.test_end_at), 'HH:mm', { locale: th })}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 