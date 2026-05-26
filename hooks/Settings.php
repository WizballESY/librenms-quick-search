<?php

namespace WizballEsy\LibreNmsQuickSearch\Hooks;

use App\Plugins\Hooks\SettingsHook;

class Settings extends SettingsHook
{
    public function authorize(\Illuminate\Contracts\Auth\Authenticatable $user): bool
    {
        return $user->can('admin');
    }

    public function data(array $settings = []): array
    {
        return [
            'settings' => [
                'enabled' => $this->boolSetting($settings, 'enabled', true),
                'device_list_enabled' => $this->boolSetting($settings, 'device_list_enabled', true),
            ],
        ];
    }

    private function boolSetting(array $settings, string $key, bool $default): bool
    {
        if (! array_key_exists($key, $settings)) {
            return $default;
        }

        $value = $settings[$key];

        if (is_bool($value)) {
            return $value;
        }

        if (is_numeric($value)) {
            return (int) $value === 1;
        }

        if (is_string($value)) {
            return in_array(strtolower(trim($value)), ['1', 'true', 'yes', 'on'], true);
        }

        return $default;
    }
}
