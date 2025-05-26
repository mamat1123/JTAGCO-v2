import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { PROVINCES } from "@/shared/constants/provinces";

interface AddressFormProps {
  address: string;
  province: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  onAddressChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onProvinceChange: (value: string) => void;
  onZipCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPositionChange?: (lat: number, lng: number) => void;
}

export function AddressForm({ 
  address, 
  province, 
  zipCode,
  latitude,
  longitude,
  onAddressChange, 
  onProvinceChange,
  onZipCodeChange,
  onPositionChange
}: AddressFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">ข้อมูลที่อยู่</h3>
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="address">ที่อยู่</Label>
          <Textarea
            id="address"
            name="address"
            value={address}
            onChange={onAddressChange}
            placeholder="กรอกที่อยู่"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="province">จังหวัด</Label>
          <Select
            value={province}
            onValueChange={onProvinceChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="เลือกจังหวัด" />
            </SelectTrigger>
            <SelectContent>
              {PROVINCES.map((province) => (
                <SelectItem key={province.name} value={province.name}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">รหัสไปรษณีย์</Label>
          <Input
            id="zipCode"
            name="zipCode"
            value={zipCode}
            onChange={onZipCodeChange}
            placeholder="กรอกรหัสไปรษณีย์"
            maxLength={5}
            pattern="[0-9]*"
            inputMode="numeric"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">ละติจูด</Label>
            <Input
              id="latitude"
              name="latitude"
              type="number"
              step="any"
              value={latitude || ''}
              onChange={(e) => {
                const lat = parseFloat(e.target.value);
                if (!isNaN(lat) && onPositionChange && longitude !== undefined) {
                  onPositionChange(lat, longitude);
                }
              }}
              placeholder="0.000000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longitude">ลองจิจูด</Label>
            <Input
              id="longitude"
              name="longitude"
              type="number"
              step="any"
              value={longitude || ''}
              onChange={(e) => {
                const lng = parseFloat(e.target.value);
                if (!isNaN(lng) && onPositionChange && latitude !== undefined) {
                  onPositionChange(latitude, lng);
                }
              }}
              placeholder="0.000000"
            />
          </div>
        </div>
      </div>
    </div>
  );
}