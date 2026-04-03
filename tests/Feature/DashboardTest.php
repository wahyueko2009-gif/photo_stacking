<?php

namespace Tests\Feature;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    public function test_dashboard_page_loads(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertSee('Rona Studio');
        $response->assertSee('Mulai Stacking');
    }

    public function test_photos_can_be_uploaded_to_public_stacking_storage(): void
    {
        Storage::fake('public');

        $firstImage = $this->fakePngUpload('macro-1.png');
        $secondImage = $this->fakePngUpload('macro-2.png');

        $response = $this->post(route('stacking.upload'), [
            'photos' => [
                $firstImage,
                $secondImage,
            ],
        ]);

        $response->assertOk();
        $response->assertJsonPath('counts.uploaded', 2);
        $response->assertJsonPath('storage_disk', 'public');

        $photos = $response->json('photos');

        $this->assertCount(2, $photos);
        Storage::disk('public')->assertExists($photos[0]['path']);
        Storage::disk('public')->assertExists($photos[1]['path']);
    }

    public function test_photo_can_be_deleted_from_public_stacking_storage(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('stacking-uploads/2026/04/01/delete-me.png', 'fake-image-bytes');

        $response = $this->deleteJson(route('stacking.destroy'), [
            'path' => 'stacking-uploads/2026/04/01/delete-me.png',
        ]);

        $response->assertOk();
        $response->assertJsonPath('deleted', true);
        Storage::disk('public')->assertMissing('stacking-uploads/2026/04/01/delete-me.png');
    }

    private function fakePngUpload(string $filename): UploadedFile
    {
        $path = tempnam(sys_get_temp_dir(), 'stacking-test');

        file_put_contents(
            $path,
            base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgQbM90kAAAAASUVORK5CYII=')
        );

        return new UploadedFile(
            $path,
            $filename,
            'image/png',
            null,
            true
        );
    }
}
