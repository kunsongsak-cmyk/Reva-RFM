@echo off
chcp 65001 >nul
title Reva Clinic CRM
cd /d "%~dp0"

echo.
echo  ===========================================
echo    Reva Clinic CRM
echo  ===========================================
echo.

rem --- 1. Check that Node.js is installed ---
where node >nul 2>nul
if errorlevel 1 goto :no_node

rem --- 2. Install or update dependencies (first run takes 1-2 minutes) ---
if not exist "node_modules\" (
  echo  กำลังติดตั้งส่วนประกอบของแอป ครั้งแรกใช้เวลา 1-2 นาที...
) else (
  echo  กำลังตรวจสอบส่วนประกอบของแอป...
)
call npm install --no-audit --no-fund --loglevel=error
if errorlevel 1 (
  if not exist "node_modules\" goto :install_failed
  echo  ตรวจสอบส่วนประกอบไม่สำเร็จ อาจไม่มีอินเทอร์เน็ต จะเปิดแอปด้วยส่วนประกอบเดิม
)

rem --- 3. Start the app on this computer only and open the browser ---
echo.
echo  กำลังเปิดแอปที่ http://localhost:3000
echo  เบราว์เซอร์จะเปิดขึ้นมาเอง
echo.
echo  ** เปิดหน้าต่างนี้ค้างไว้ระหว่างใช้งาน ถ้าปิดหน้าต่าง แอปจะหยุดทำงาน **
echo.
call npx vite --port 3000 --host localhost --open
echo.
echo  แอปหยุดทำงานแล้ว
pause
exit /b 0

:no_node
echo  ไม่พบ Node.js ในเครื่องนี้
echo.
echo  1. ในหน้าเว็บที่กำลังเปิดขึ้นมา ให้ดาวน์โหลดเวอร์ชัน LTS แล้วติดตั้ง
echo  2. ติดตั้งเสร็จแล้ว ดับเบิลคลิกไฟล์ เปิดแอป.bat อีกครั้ง
echo.
start "" "https://nodejs.org/"
pause
exit /b 1

:install_failed
echo.
echo  ติดตั้งส่วนประกอบไม่สำเร็จ
echo  ตรวจสอบว่าเครื่องต่ออินเทอร์เน็ตอยู่ แล้วดับเบิลคลิก เปิดแอป.bat อีกครั้ง
echo.
pause
exit /b 1
