import { Company } from "@/entities/Company/company";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface CompanyHeaderProps {
  company: Company;
}

export function CompanyHeader({ company }: CompanyHeaderProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg sm:text-xl font-bold text-primary">
          {company.name}
        </CardTitle>
      </CardHeader>
    </Card>
  );
} 