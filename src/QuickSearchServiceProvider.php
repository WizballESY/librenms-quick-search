<?php

namespace WizballEsy\LibreNmsQuickSearch;

use Illuminate\Routing\Router;
use Illuminate\Support\ServiceProvider;
use LibreNMS\Interfaces\Plugins\Hooks\SettingsHook as SettingsHookInterface;
use LibreNMS\Interfaces\Plugins\PluginManagerInterface;
use WizballEsy\LibreNmsQuickSearch\Hooks\Settings;
use WizballEsy\LibreNmsQuickSearch\Http\Middleware\InjectQuickSearch;

class QuickSearchServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__ . '/../config/quick-search.php', 'quick-search');
    }

    public function boot(Router $router): void
    {
        $pluginName = 'quick-search';

        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'quick-search');

        /*
         * Compatibility view path for LibreNMS plugin settings pages.
         * LibreNMS may request quick-search::resources.views.settings.
         */
        $this->loadViewsFrom(__DIR__ . '/..', 'quick-search');

        $router->pushMiddlewareToGroup('web', InjectQuickSearch::class);

        $pluginManager = $this->app->make(PluginManagerInterface::class);
        $pluginManager->publishHook($pluginName, SettingsHookInterface::class, Settings::class);
    }
}
