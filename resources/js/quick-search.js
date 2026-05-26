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
            <div class="wizball-quick-search-wrapper pull-left" style="display:inline-flex;align-items:center;margin-right:12px;margin-bottom:6px;">
                <div class="input-group input-group-sm" style="width:260px;height:34px;">
                    <span class="input-group-addon" title="Quick search" style="height:34px;line-height:20px;">
                        <i class="fa fa-search" aria-hidden="true"></i>
                    </span>
                    <input
                        id="${INPUT_ID}"
                        type="search"
                        class="form-control"
                        style="height:34px;"
                        placeholder="Search"
                        autocomplete="off"
                        aria-label="Search">
                </div>
            </div>
        `);

        const $filterWrapper = $menu.find('.pull-left, [x-data*="filterBarComponent"]').first();

        if ($filterWrapper.length) {
            $search.insertBefore($filterWrapper);
        } else {
            $menu.prepend($search);
        }

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
