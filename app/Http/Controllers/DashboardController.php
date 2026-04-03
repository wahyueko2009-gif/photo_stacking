<?php

namespace App\Http\Controllers;

use App\Services\PhotoStacking\PythonStackingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function __invoke(PythonStackingService $stackingService): View
    {
        return view('dashboard', [
            'stackSchema' => $stackingService->schema(),
            'stackConfig' => $stackingService->defaultConfig(),
            'stackSummary' => [
                'project_name' => 'Rona Studio',
                'uploaded_count' => 0,
                'selected_count' => 0,
                'rejected_count' => 0,
            ],
            'stackMeta' => [
                'estimated_seconds' => 10,
            ],
            'uploadMeta' => [
                'endpoint' => route('stacking.upload'),
                'delete_endpoint' => route('stacking.destroy'),
                'storage_disk' => 'public',
                'storage_directory' => 'stacking-uploads',
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'photos' => ['required', 'array', 'min:1'],
            'photos.*' => ['required', 'image', 'mimes:jpg,jpeg,png,webp,tif,tiff'],
        ]);

        $directory = 'stacking-uploads/'.now()->format('Y/m/d');
        $uploadedPhotos = [];

        foreach ($validated['photos'] as $index => $photo) {
            $filename = Str::uuid()->toString().'_'.$index.'.'.$photo->getClientOriginalExtension();
            $path = $photo->storeAs($directory, $filename, 'public');

            $uploadedPhotos[] = [
                'label' => 'IMG '.($index + 1),
                'name' => $photo->getClientOriginalName(),
                'path' => $path,
                'url' => Storage::disk('public')->url($path),
                'state' => 'selected',
                'accent' => '#3dd7ff',
            ];
        }

        return response()->json([
            'message' => 'Foto berhasil diupload.',
            'storage_disk' => 'public',
            'storage_directory' => $directory,
            'photos' => $uploadedPhotos,
            'counts' => [
                'uploaded' => count($uploadedPhotos),
                'selected' => count($uploadedPhotos),
            ],
        ]);
    }

    /**
     * @throws ValidationException
     */
    public function destroy(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'path' => ['required', 'string'],
        ]);

        $path = ltrim(str_replace('\\', '/', $validated['path']), '/');

        if (! Str::startsWith($path, 'stacking-uploads/')) {
            throw ValidationException::withMessages([
                'path' => 'Path file tidak valid.',
            ]);
        }

        $deleted = Storage::disk('public')->delete($path);

        return response()->json([
            'message' => $deleted ? 'Foto berhasil dihapus.' : 'File sudah tidak ada di storage.',
            'deleted' => $deleted,
            'path' => $path,
        ]);
    }
}
