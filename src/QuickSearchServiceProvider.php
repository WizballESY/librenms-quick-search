<?php

namespace WizballEsy\LibreNmsQuickSearch;

use Illuminate\Routing\Router;
use Illuminate\Support\ServiceProvider;
use WizballEsy\LibreNmsQuickSearch\Http\Middleware\InjectQuickSearch;

class QuickSearchServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__ . '/../config/quick-search.php', 'quick-search');
    }

    public function boot(Router $router): void
    {
        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'quick-search');

        $router->pushMiddlewareToGroup('web', InjectQuickSearch::class);
    }
}
