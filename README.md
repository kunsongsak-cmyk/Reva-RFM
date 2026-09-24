# Reva Clinic CRM

ระบบติดตามคนไข้และวิเคราะห์ RFM ของ Reva Aesthetic Clinic Bangkok

## เปิดแอปบน Windows

1. ติดตั้ง [Node.js](https://nodejs.org/) เวอร์ชัน **LTS** (ทำครั้งเดียว)
2. ดาวน์โหลดโค้ด: หน้า GitHub → ปุ่ม **Code** → **Download ZIP** แล้ว **Extract All**
3. เปิดโฟลเดอร์ที่แตกไฟล์ แล้ว **ดับเบิลคลิก `เปิดแอป.bat`**
   - ครั้งแรกจะติดตั้งส่วนประกอบ ใช้เวลา 1–2 นาที
   - เบราว์เซอร์จะเปิด http://localhost:3000 ให้เอง
   - เปิดหน้าต่างสีดำค้างไว้ระหว่างใช้งาน ปิดหน้าต่างเมื่อเลิกใช้

แอปเปิดได้เฉพาะในเครื่องนี้ (`localhost`) เครื่องอื่นในเครือข่ายเข้าไม่ได้

## สำหรับนักพัฒนา

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # unit tests
npm run lint    # typecheck
npm run build
```
