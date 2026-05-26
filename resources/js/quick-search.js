(function () {
    'use strict';

    const MARKER_CLASS = 'wizball-quick-search-wrapper';

    function debounce(fn, delay) {
        let timer = null;

        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function focusSearchInput($search) {
        const active = document.activeElement;

        if (active && ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(active.tagName)) {
            return;
        }

        setTimeout(() => {
            $search.find('input').trigger('focus').trigger('select');
        }, 100);
    }

    function createSearchElement(options) {
        const value = options.value || '';
        const placeholder = options.placeholder || 'Search';
        const title = options.title || 'Quick search';

        return $(`
            <div class="${MARKER_CLASS} pull-left" style="display:inline-flex;align-items:center;margin-right:12px;margin-bottom:6px;">
                <div class="input-group input-group-sm" style="width:260px;height:34px;">
                    <span class="input-group-addon" title="${escapeHtml(title)}" style="height:34px;line-height:20px;">
                        <i class="fa fa-search"></i>
                    </span>
                    <input
                        type="search"
                        class="form-control wizball-quick-search-input"
                        style="height:34px;"
                        placeholder="${escapeHtml(placeholder)}"
                        value="${escapeHtml(value)}"
                        aria-label="${escapeHtml(placeholder)}"
                    >
                    ${options.clearButton ? `
                        <span class="input-group-addon wizball-quick-search-clear"
                              title="Clear search"
                              style="height:34px;line-height:20px;cursor:pointer;">
                            &times;
                        </span>
                    ` : ''}
                </div>
            </div>
        `);
    }

    function initDeviceListSearch() {
        if (! /^\/devices\/?$/.test(window.location.pathname)) {
            return;
        }

        if ($(`.${MARKER_CLASS}`).length) {
            return;
        }

        const $grid = $('#devices');
        const $menu = $('.devices-headers-table-menu');

        if (! $grid.length || ! $menu.length || ! $.fn.bootgrid) {
            return;
        }

        const $search = createSearchElement({
            placeholder: 'Search',
            title: 'Quick search devices',
            clearButton: true
        });

        const $filterWrapper = $menu.find('.pull-left, [x-data*="filterBarComponent"]').first();

        if ($filterWrapper.length) {
            $search.insertBefore($filterWrapper);
        } else {
            $menu.prepend($search);
        }

        const runSearch = debounce(function (value) {
            $grid.bootgrid('search', value);
        }, 250);

        $search.find('input').on('input', function () {
            runSearch(this.value);
        });

        $search.find('.wizball-quick-search-clear').on('click', function () {
            $search.find('input').val('');
            runSearch('');
        });

        $search.find('input').on('keydown', function (event) {
            if (event.key === 'Escape') {
                event.preventDefault();
                this.value = '';
                runSearch('');
            }
        });

        focusSearchInput($search);
    }

    function isDevicePortsDetailPage() {
        return /^\/device\/[^/]+\/ports(?:\/(?:basic|detail))?\/?$/.test(window.location.pathname);
    }

    function getPortsSearchValue() {
        const url = new URL(window.location.href);

        return url.searchParams.get('filter[search][contains]') || '';
    }

    function hasFilterParams(url) {
        for (const key of url.searchParams.keys()) {
            if (key.startsWith('filter[')) {
                return true;
            }
        }

        return false;
    }

    function getFilterBarState() {
        const filterBar = document.querySelector('[x-data*="filterBarComponent"]');

        if (! filterBar || ! filterBar._x_dataStack) {
            return null;
        }

        return filterBar._x_dataStack.find((item) => item && item.name === 'device.ports') || null;
    }

    function addFormattedFiltersToUrl(url, formattedFilters) {
        if (! formattedFilters || typeof formattedFilters !== 'object') {
            return;
        }

        Object.entries(formattedFilters).forEach(([key, operators]) => {
            if (! operators || typeof operators !== 'object') {
                return;
            }

            Object.entries(operators).forEach(([op, value]) => {
                url.searchParams.set(`filter[${key}][${op}]`, value ?? '');
            });
        });
    }

    function getPortsBaseUrlWithCurrentFilters() {
        const url = new URL(window.location.href);

        if (hasFilterParams(url)) {
            return url;
        }

        const filterState = getFilterBarState();

        if (filterState && filterState.formattedFilters) {
            addFormattedFiltersToUrl(url, filterState.formattedFilters);
            return url;
        }

        const syncedFilterLink = document.querySelector('a.sync-filter-url[href*="filter%5B"], a.sync-filter-url[href*="filter["]');

        if (syncedFilterLink) {
            return new URL(syncedFilterLink.getAttribute('href'), window.location.origin);
        }

        return url;
    }

    function applyPortsSearch(value) {
        const url = getPortsBaseUrlWithCurrentFilters();
        const trimmed = String(value || '').trim();

        if (trimmed === '') {
            url.searchParams.delete('filter[search][contains]');
        } else {
            url.searchParams.set('filter[search][contains]', trimmed);
        }

        url.searchParams.delete('page');

        window.location.href = url.href;
    }

    function initDevicePortsDetailSearch() {
        if (! isDevicePortsDetailPage()) {
            return;
        }

        if ($(`.${MARKER_CLASS}`).length) {
            return;
        }

        const $filterBar = $('[x-data*="filterBarComponent"]').first();

        if (! $filterBar.length) {
            return;
        }

        const $search = createSearchElement({
            placeholder: 'Search ports',
            title: 'Quick search ports',
            value: getPortsSearchValue(),
            clearButton: true
        });

        $search.find('.input-group-addon').first().css('cursor', 'pointer');

        $search.find('.input-group-addon').first().on('click', function () {
            applyPortsSearch($search.find('input').val());
        });

        $search.find('.wizball-quick-search-clear').on('click', function () {
            $search.find('input').val('');
            applyPortsSearch('');
        });

        $search.find('input').on('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                applyPortsSearch(this.value);
            }

            if (event.key === 'Escape') {
                event.preventDefault();
                this.value = '';
                applyPortsSearch('');
            }
        });

        $search.insertBefore($filterBar);

        focusSearchInput($search);
    }

    function init() {
        initDeviceListSearch();
        initDevicePortsDetailSearch();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
