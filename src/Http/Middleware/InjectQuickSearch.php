<?php

namespace WizballEsy\LibreNmsQuickSearch\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InjectQuickSearch
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! config('quick-search.enabled', true)) {
            return $response;
        }

        if (! config('quick-search.devices.enabled', true)) {
            return $response;
        }

        if (! $request->is('devices')) {
            return $response;
        }

        $contentType = (string) $response->headers->get('Content-Type', '');

        if ($contentType !== '' && stripos($contentType, 'text/html') === false) {
            return $response;
        }

        $content = (string) $response->getContent();

        if ($content === '' || stripos($content, '</body>') === false) {
            return $response;
        }

        if (strpos($content, 'wizball-quick-device-search') !== false) {
            return $response;
        }

        $scriptPath = dirname(__DIR__, 3) . '/resources/js/quick-search.js';

        if (! is_file($scriptPath) || ! is_readable($scriptPath)) {
            return $response;
        }

        $script = file_get_contents($scriptPath);

        if ($script === false || trim($script) === '') {
            return $response;
        }

        $injection = "\n<!-- LibreNMS Quick Search -->\n<script>\n" . $script . "\n</script>\n";

        $content = preg_replace('/<\/body>/i', $injection . '</body>', $content, 1);

        if (is_string($content)) {
            $response->setContent($content);
            $response->headers->remove('Content-Length');
        }

        return $response;
    }
}
