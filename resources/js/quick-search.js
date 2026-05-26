(function () {
    'use strict';

    const INPUT_ID = 'wizball-quick-device-search';

    function isDevicesPage() {
        return window.location.pathname === '/devices'
            || window.location.pathname === '/devices/';
    }

    function debounce(fn, delay) {
        let timer = null;

        return function () {
            const args = arguments;

            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(null, args);
            }, delay);
        };
    }

    function addDeviceSearch() {
        if (!isDevicesPage()) {
            return;
        }

        const $ = window.jQuery || window.$;

        if (!$ || !$.fn || !$.fn.bootgrid) {
            return;
        }

        const $grid = $('#devices');
        const $menu = $('.devices-headers-table-menu');

        if (!$grid.length || !$menu.length || $('#' + INPUT_ID).length) {
            return;
        }

        const $search = $(`
            <div class="wizball-quick-search-wrapper" style="display:inline-flex;align-items:center;margin-left:12px;margin-right:8px;margin-bottom:6px;">
                <div class="input-group input-group-sm" style="width:260px;">
                    <span class="input-group-addon" title="Quick search">
                        <i class="fa fa-search" aria-hidden="true"></i>
                    </span>
                    <input
                        id="${INPUT_ID}"
                        type="search"
                        class="form-control"
                        placeholder="Search"
                        autocomplete="off"
                        aria-label="Search">
                </div>
            </div>
        `);

        $menu.prepend($search);

        const runSearch = debounce(function (value) {
            $grid.bootgrid('search', value);
        }, 250);

        $('#' + INPUT_ID).on('input', function () {
            runSearch(this.value);
        });

        $('#' + INPUT_ID).on('keydown', function (event) {
            if (event.key === 'Escape') {
                this.value = '';
                runSearch('');
            }
        });
    }

    function boot() {
        addDeviceSearch();

        setTimeout(addDeviceSearch, 250);
        setTimeout(addDeviceSearch, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
