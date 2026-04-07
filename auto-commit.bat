@echo off
setlocal enabledelayedexpansion

:: Proje dizinine git (scriptin bulundugu yer)
cd /d "%~dp0"

:: Log dosyasını tanımla
set LOGFILE=commit-history.log

:: Tarih ve Saat Bilgisini Al
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set TARIH=%%c-%%b-%%a
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set SAAT=%%a:%%b

echo [%TARIH% %SAAT%] Otomatik kontrol baslatildi... >> %LOGFILE%

:: Değişiklik var mı kontrol et
git status --porcelain > nul 2>&1
git diff --quiet && git diff --cached --quiet
if %errorlevel% == 0 (
    echo [%TARIH% %SAAT%] Commit edilecek degisiklik yok. >> %LOGFILE%
    exit /b 0
)

:: Tüm değişiklikleri ekle
echo [%TARIH% %SAAT%] Degisiklikler algilandi, ekleniyor... >> %LOGFILE%
git add -A

:: "Güzel" bir commit mesajı oluştur
:: Örn: [Daily Sync] 2026-04-07 21:15 - Claude tarafından yapılan güncellemeler
set COMMIT_MSG="[Daily Sync] %TARIH% %SAAT% - Claude tarafindan yapilan guncellemeler"

git commit -m %COMMIT_MSG% >> %LOGFILE% 2>&1

:: GitHub'a push et
echo [%TARIH% %SAAT%] GitHub'a pushlaniyor (master)... >> %LOGFILE%
git push origin master >> %LOGFILE% 2>&1

if %errorlevel% == 0 (
    echo [%TARIH% %SAAT%] Basariyla tamamlandi. >> %LOGFILE%
    echo Basariyla tamamlandi.
) else (
    echo [%TARIH% %SAAT%] HATA: Push islemi basarisiz oldu! >> %LOGFILE%
    echo HATA: Push islemi basarisiz oldu!
)

echo. >> %LOGFILE%
