<?php

return [
    'driver' => env('PHOTO_STACKING_DRIVER', 'python-cli'),
    'python_binary' => env('PHOTO_STACKING_PYTHON_BINARY', 'python'),
    'entry_script' => env('PHOTO_STACKING_ENTRY_SCRIPT', base_path('python/stack_images.py')),
    'queue' => env('PHOTO_STACKING_QUEUE', 'stacking'),
    'timeout' => (int) env('PHOTO_STACKING_TIMEOUT', 180),
];
