@echo off
cd /d "C:\Users\Eda\OneDrive\Masaüstü\Antigravity\stok-takip"

:: Değişiklik var mı kontrol et
git status --porcelain > nul 2>&1
git diff --quiet && git diff --cached --quiet
if %errorlevel% == 0 (
    echo Commit edilecek degisiklik yok, cikiliyor.
    exit /b 0
)

:: Tüm değişiklikleri ekle
git add -A

:: Tarih ile commit at
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set TARIH=%%c-%%b-%%a
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set SAAT=%%a:%%b
git commit -m "Otomatik commit: %TARIH% %SAAT%"

:: GitHub'a push et
git push origin master

echo Basariyla commit edildi ve push edildi.
