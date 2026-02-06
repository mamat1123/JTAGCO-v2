// Sub-type code to Thai name mapping
export const SUB_TYPE_CODES = {
  // Call (โทร) sub types
  QUOTATION_NEW: 'QUOTATION_NEW',     // เสนอราคา (ใหม่)
  QUOTATION_OLD: 'QUOTATION_OLD',     // เสนอราคา (เก่า)
  PO_NEW: 'PO_NEW',                   // PO (ใหม่)
  PO_OLD: 'PO_OLD',                   // PO (เก่า)
  CALL_OLD: 'CALL_OLD',               // ลูกค้าเก่า
  CALL_NEW_1: 'CALL_NEW_1',           // ลูกค้าใหม่ 1
  CALL_NEW_2: 'CALL_NEW_2',           // ลูกค้าใหม่ 2

  // Visit (เข้าพบ) sub types
  SHIPPING: 'SHIPPING',               // ส่งของ
  BILLING: 'BILLING',                 // วางบิล
  ACCEPTING_CHEQUE: 'ACCEPTING_CHEQUE', // รับเช็ค
  SENT_TEST: 'SENT_TEST',             // ส่งเทส
  CHANGE_SIZE: 'CHANGE_SIZE',         // เปลี่ยนไซส์
  MEASURE: 'MEASURE',                 // วัดไซส์
  TEST_RESULT: 'TEST_RESULT',         // ผลเทส
  VISIT_SEND_SAMPLE: 'VISIT_SEND_SAMPLE', // ส่งตัวอย่าง
  EXHIBIT_BOOTHS: 'EXHIBIT_BOOTHS',   // ออกบูท
  FOUND_PROBLEM: 'FOUND_PROBLEM',     // พบปัญหา
  OTHER: 'OTHER',                     // อื่นๆ
  PRESENT: 'PRESENT',                 // นำเสนอ
} as const;

// Thai name fallback mapping (if codes not set in DB)
export const SUB_TYPE_THAI_NAMES: Record<string, string> = {
  'เสนอราคา (ใหม่)': 'QUOTATION_NEW',
  'เสนอราคา (เก่า)': 'QUOTATION_OLD',
  'PO (ใหม่)': 'PO_NEW',
  'PO (เก่า)': 'PO_OLD',
  'ลูกค้าเก่า': 'CALL_OLD',
  'ลูกค้าใหม่ 1': 'CALL_NEW_1',
  'ลูกค้าใหม่ 2': 'CALL_NEW_2',
  'ส่งของ': 'SHIPPING',
  'วางบิล': 'BILLING',
  'รับเช็ค': 'ACCEPTING_CHEQUE',
  'ส่งเทส': 'SENT_TEST',
  'เปลี่ยนไซส์': 'CHANGE_SIZE',
  'วัดไซส์': 'MEASURE',
  'ผลเทส': 'TEST_RESULT',
  'ส่งตัวอย่าง': 'VISIT_SEND_SAMPLE',
  'ออกบูท': 'EXHIBIT_BOOTHS',
  'พบปัญหา': 'FOUND_PROBLEM',
  'อื่นๆ': 'OTHER',
  'เสนอ': 'PRESENT',
};

export const MONTHS = [
  { value: '01', label: 'มกราคม' },
  { value: '02', label: 'กุมภาพันธ์' },
  { value: '03', label: 'มีนาคม' },
  { value: '04', label: 'เมษายน' },
  { value: '05', label: 'พฤษภาคม' },
  { value: '06', label: 'มิถุนายน' },
  { value: '07', label: 'กรกฎาคม' },
  { value: '08', label: 'สิงหาคม' },
  { value: '09', label: 'กันยายน' },
  { value: '10', label: 'ตุลาคม' },
  { value: '11', label: 'พฤศจิกายน' },
  { value: '12', label: 'ธันวาคม' },
] as const;

export const PROBLEM_TYPES = [
  { value: 'sole', label: 'พื้น' },
  { value: 'leather', label: 'หนัง' },
  { value: 'eyelet', label: 'ตาไก่' },
  { value: 'steel_toe', label: 'หัวเหล็ก' },
  { value: 'insole', label: 'แผ่นรองใน' },
] as const;

// Special insole name that disables price field
export const NO_INSOLE_NAME = 'ไม่มีแผ่นรองใน';

// Helper function to get sub-type code from name
export const getSubTypeCodeFromName = (name: string): string => {
  return SUB_TYPE_THAI_NAMES[name] || '';
};
