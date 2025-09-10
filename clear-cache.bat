@echo off
echo Clearing Laravel Caches...
echo.

echo Clearing Application Cache...
php artisan cache:clear

echo.
echo Clearing Route Cache...
php artisan route:clear

echo.
echo Clearing Config Cache...
php artisan config:clear

echo.
echo Clearing View Cache...
php artisan view:clear

echo.
echo Cache Rebuild...
php artisan config:cache

echo.
echo npm run build...
npm run build

echo.
echo Regenerate Ziggy...
php artisan ziggy:generate

echo.
echo All caches have been cleared successfully!
pause
