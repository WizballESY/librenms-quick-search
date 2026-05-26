<div style="margin: 15px; max-width: 760px;">
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px;">
        <h2 style="margin: 0;">
            Quick Search Settings
            @include('quick-search::partials.version-badge')
        </h2>

        <a href="https://github.com/WizballESY/librenms-quick-search"
           class="btn btn-primary btn-sm"
           target="_blank"
           rel="noopener noreferrer"
           title="Quick Search on GitHub">
            <i class="fa fa-github"></i> GitHub
        </a>
    </div>

    <div class="alert alert-warning" style="font-size: 12px;">
        <strong>Experimental alpha:</strong>
        This plugin is under early development. Test carefully before using it broadly.
    </div>

    <p class="text-muted">
        Control where Quick Search is enabled. The current alpha only supports the LibreNMS device list.
    </p>

    <form method="post" style="margin-top: 15px;">
        @csrf

        <div class="panel panel-default">
            <div class="panel-heading">
                <strong>Plugin status</strong>
            </div>

            <div class="panel-body">
                <input type="hidden" name="settings[enabled]" value="0">

                <label style="font-weight: normal;">
                    <input
                        type="checkbox"
                        name="settings[enabled]"
                        value="1"
                        @if ($settings['enabled'] ?? true) checked @endif
                    >
                    Enable Quick Search
                </label>

                <p class="text-muted" style="margin-bottom: 0;">
                    Turns the Quick Search plugin on or off globally.
                </p>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <strong>Device list</strong>
            </div>

            <div class="panel-body">
                <input type="hidden" name="settings[device_list_enabled]" value="0">

                <label style="font-weight: normal;">
                    <input
                        type="checkbox"
                        name="settings[device_list_enabled]"
                        value="1"
                        @if ($settings['device_list_enabled'] ?? true) checked @endif
                    >
                    Enable quick search on the device list
                </label>

                <p class="text-muted" style="margin-bottom: 0;">
                    Adds a Search field next to the LibreNMS Filter button on the device list.
                </p>
            </div>
        </div>

        <button type="submit" class="btn btn-primary">
            <i class="fa fa-save"></i> Save settings
        </button>
    </form>

    <hr>

    @include('quick-search::partials.footer')
</div>
