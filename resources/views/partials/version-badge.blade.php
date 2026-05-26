@php
    $quickSearchVersion = 'unknown';

    try {
        if (class_exists(\Composer\InstalledVersions::class)) {
            $quickSearchVersion = \Composer\InstalledVersions::getPrettyVersion('wizballesy/librenms-quick-search') ?: $quickSearchVersion;
        }
    } catch (\Throwable $e) {
        $quickSearchVersion = 'unknown';
    }
@endphp

<span class="label label-info" style="vertical-align: middle;">
    {{ $quickSearchVersion }}
</span>
