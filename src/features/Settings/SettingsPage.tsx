import React from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '@/features/Profile/hooks/useProfile';
import { UserRole } from '@/shared/types/roles';

const SettingsPage: React.FC = () => {
  const { profile } = useProfile();
  const isSuperAdmin = profile?.role === UserRole.SUPER_ADMIN;
  console.log(profile);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">ตั้งค่า</h1>

      <div className="grid gap-4 md:gap-6">
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="text-xl font-semibold mb-4">ตั้งค่าทั่วไป</h2>
          <div className="space-y-3 md:space-y-4">
            <Link
              to="/settings/products"
              className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div>
                <h3 className="font-medium">จัดการสินค้า</h3>
                <p className="text-sm text-gray-600">จัดการสินค้าและสินค้าคงคลัง</p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>

            {isSuperAdmin ? (
              <Link
                to="/settings/users"
                className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <h3 className="font-medium">อนุมัติผู้ใช้งานใหม่</h3>
                  <p className="text-sm text-gray-600">ตรวจสอบและอนุมัติผู้ใช้งานที่สมัครเข้ามาใหม่</p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ) : (
              <div
                className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg opacity-50 cursor-not-allowed"
              >
                <div>
                  <h3 className="font-medium">อนุมัติผู้ใช้งานใหม่</h3>
                  <p className="text-sm text-gray-600">ตรวจสอบและอนุมัติผู้ใช้งานที่สมัครเข้ามาใหม่</p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            )}

            <div
              className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg opacity-50 cursor-not-allowed"
            >
              <div>
                <h3 className="font-medium">การแจ้งเตือน</h3>
                <p className="text-sm text-gray-600">ตั้งค่าการแจ้งเตือนและอีเมล</p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;