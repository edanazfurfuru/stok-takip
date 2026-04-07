# Bu scripti PowerShell'de Yönetici olarak çalıştır
$action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument '/c "C:\Users\Eda\OneDrive\Masaüstü\Antigravity\stok-takip\auto-commit.bat"'
$trigger = New-ScheduledTaskTrigger -Daily -At "11:00"
$settings = New-ScheduledTaskSettingsSet -RunOnlyIfNetworkAvailable -StartWhenAvailable

Register-ScheduledTask -TaskName "StokTakip Gunluk Commit" -Action $action -Trigger $trigger -Settings $settings -Force

Write-Host "Gorev zamanlayici basariyla kuruldu! Her gun saat 11:00'de otomatik commit edilecek."
