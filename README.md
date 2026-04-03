# Rona Studio

Rona Studio adalah editor foto berbasis Laravel dan Python untuk workflow edit tunggal, compare, crop, rotate, preset, dan multi-frame focus stack.

## Komponen utama

- Laravel: dashboard, upload foto, hapus file storage, dan integrasi konfigurasi.
- Python: schema parameter stacking modular dan blueprint pipeline.
- Frontend preview: simulasi stacking + AI assist ringan berbasis CPU di browser.

## Struktur penting

- `app/Http/Controllers/DashboardController.php`
- `app/Services/PhotoStacking/PythonStackingService.php`
- `resources/views/dashboard.blade.php`
- `resources/js/app.js`
- `resources/css/app.css`
- `python/stack_images.py`
- `python/stacking/config.py`
- `python/stacking/pipeline.py`

## Jalankan project

```bash
composer install
php artisan key:generate
php artisan storage:link
php artisan serve
```

Untuk frontend Vite:

```bash
npm install
npm run dev
```

## Test

```bash
php artisan test
python python/stack_images.py
```

## Catatan

- Upload foto disimpan ke disk Laravel `public` pada folder `stacking-uploads/...`.
- Hapus thumbnail akan menghapus file di storage juga.
- Preview AI saat ini masih berjalan di browser sebagai simulasi CPU-friendly, belum menjadi pipeline OpenCV final.
