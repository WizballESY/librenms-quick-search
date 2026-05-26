<?php

namespace WizballEsy\LibreNmsQuickSearch;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class QuickSearchServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__ . '/../config/quick-search.php', 'quick-search');
    }

    public function boot(): void
    {
        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'quick-search');

        Blade::directive('quickSearchVersion', function () {
            return "<?php echo 'librenms-quick-search alpha'; ?>";
        });
    }
}
