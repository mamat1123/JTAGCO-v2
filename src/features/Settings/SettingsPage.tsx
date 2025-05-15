import React from 'react';
import { Link } from 'react-router-dom';

const SettingsPage: React.FC = () => {
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

            <Link 
              to="/settings/users"
              className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div>
                <h3 className="font-medium">จัดการผู้ใช้งาน</h3>
                <p className="text-sm text-gray-600">จัดการบัญชีผู้ใช้งานและสิทธิ์การเข้าถึง</p>
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

            <Link 
              to="/settings/company"
              className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div>
                <h3 className="font-medium">ข้อมูลบริษัท</h3>
                <p className="text-sm text-gray-600">จัดการข้อมูลบริษัทและโลโก้</p>
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

            <Link 
              to="/settings/notifications"
              className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
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
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;