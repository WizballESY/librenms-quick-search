<?php

namespace WizballEsy\LibreNmsQuickSearch\Services;

use App\Models\Plugin;

class QuickSearchSettingsService
{
    public const PACKAGE_PLUGIN_NAME = 'quick-search';

    public function settings(): array
    {
        $plugin = Plugin::where('plugin_name', self::PACKAGE_PLUGIN_NAME)->first();

        $settings = $plugin ? ($plugin->settings ?? []) : [];

        return is_array($settings) ? $settings : [];
    }

    public function enabled(?array $settings = null): bool
    {
        return $this->boolSetting($settings ?? $this->settings(), 'enabled', true);
    }

    public function deviceListEnabled(?array $settings = null): bool
    {
        return $this->boolSetting($settings ?? $this->settings(), 'device_list_enabled', true);
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
