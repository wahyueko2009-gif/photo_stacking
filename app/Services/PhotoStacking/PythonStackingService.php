<?php

namespace App\Services\PhotoStacking;

class PythonStackingService
{
    public function blueprint(): array
    {
        return [
            'driver' => config('photo_stacking.driver'),
            'python_binary' => config('photo_stacking.python_binary'),
            'entry_script' => config('photo_stacking.entry_script'),
            'queue' => config('photo_stacking.queue'),
            'timeout' => config('photo_stacking.timeout'),
            'steps' => [
                'Laravel menerima upload dan metadata job.',
                'Queue memanggil worker Python untuk alignment dan blending.',
                'AI lokal CPU membantu seleksi frame blur, denoise, detail boost, dan upscale ringan.',
                'Hasil stack disimpan ke storage publik dan siap dipublish.',
            ],
        ];
    }

    public function schema(): array
    {
        return $this->fallbackSchema();
    }

    public function defaultConfig(): array
    {
        $config = [];

        foreach ($this->schema() as $groupKey => $group) {
            foreach (($group['fields'] ?? []) as $fieldKey => $field) {
                $config[$groupKey][$fieldKey] = $field['default'] ?? null;
            }
        }

        return $config;
    }

    protected function schemaPayload(): array
    {
        $pythonBinary = config('photo_stacking.python_binary', 'python');
        $entryScript = base_path(config('photo_stacking.entry_script', 'python/stack_images.py'));

        if (! is_file($entryScript)) {
            return ['schema' => $this->fallbackSchema()];
        }

        $descriptorSpec = [
            0 => ['pipe', 'r'],
            1 => ['pipe', 'w'],
            2 => ['pipe', 'w'],
        ];

        $process = @proc_open([$pythonBinary, $entryScript], $descriptorSpec, $pipes, base_path());

        if (! is_resource($process)) {
            return ['schema' => $this->fallbackSchema()];
        }

        fclose($pipes[0]);
        $stdout = stream_get_contents($pipes[1]);
        $stderr = stream_get_contents($pipes[2]);
        fclose($pipes[1]);
        fclose($pipes[2]);

        $exitCode = proc_close($process);

        if ($exitCode !== 0 || $stdout === false || $stdout === '') {
            return [
                'schema' => $this->fallbackSchema(),
                'error' => $stderr ?: 'Python schema command failed.',
            ];
        }

        $decoded = json_decode($stdout, true);

        if (! is_array($decoded)) {
            return [
                'schema' => $this->fallbackSchema(),
                'error' => 'Invalid Python schema response.',
            ];
        }

        return $decoded;
    }

    protected function fallbackSchema(): array
    {
        return [
            'edit_light' => [
                'label' => 'Edit Light',
                'fields' => [
                    'exposure' => ['type' => 'range', 'label' => 'Exposure', 'min' => -100, 'max' => 100, 'step' => 1, 'default' => 0],
                    'contrast' => ['type' => 'range', 'label' => 'Contrast', 'min' => -100, 'max' => 100, 'step' => 1, 'default' => 0],
                    'highlights' => ['type' => 'range', 'label' => 'Highlights', 'min' => -100, 'max' => 100, 'step' => 1, 'default' => 0],
                    'shadows' => ['type' => 'range', 'label' => 'Shadows', 'min' => -100, 'max' => 100, 'step' => 1, 'default' => 0],
                    'whites' => ['type' => 'range', 'label' => 'Whites', 'min' => -100, 'max' => 100, 'step' => 1, 'default' => 0],
                    'blacks' => ['type' => 'range', 'label' => 'Blacks', 'min' => -100, 'max' => 100, 'step' => 1, 'default' => 0],
                ],
            ],
            'edit_color' => [
                'label' => 'Edit Color',
                'fields' => [
                    'temperature' => ['type' => 'range', 'label' => 'Temperature', 'min' => -100, 'max' => 100, 'step' => 1, 'default' => 0],
                    'tint' => ['type' => 'range', 'label' => 'Tint', 'min' => -100, 'max' => 100, 'step' => 1, 'default' => 0],
                    'vibrance' => ['type' => 'range', 'label' => 'Vibrance', 'min' => -100, 'max' => 100, 'step' => 1, 'default' => 0],
                    'saturation' => ['type' => 'range', 'label' => 'Saturation', 'min' => -100, 'max' => 100, 'step' => 1, 'default' => 0],
                ],
            ],
            'edit_detail' => [
                'label' => 'Edit Detail',
                'fields' => [
                    'sharpen' => ['type' => 'range', 'label' => 'Sharpen', 'min' => 0, 'max' => 100, 'step' => 1, 'default' => 10],
                    'noise_reduction' => ['type' => 'range', 'label' => 'Noise Reduction', 'min' => 0, 'max' => 100, 'step' => 1, 'default' => 0],
                ],
            ],
            'edit_geometry' => [
                'label' => 'Edit Geometry',
                'fields' => [
                    'rotation' => ['type' => 'number', 'label' => 'Rotation', 'min' => -270, 'max' => 270, 'step' => 90, 'default' => 0],
                ],
            ],
            'ai_assist' => [
                'label' => 'AI Assist',
                'fields' => [
                    'mode' => ['type' => 'toggle', 'label' => 'AI Assist', 'default' => 'off', 'checked_label' => 'On', 'unchecked_label' => 'Off'],
                ],
            ],
        ];
    }
}