# LibreNMS Quick Search

Experimental LibreNMS plugin package that adds lightweight quick search fields to selected LibreNMS pages.

## Current experimental scope

- Adds a quick search field to the LibreNMS device list.
- Uses the existing LibreNMS Bootgrid search on the device table.
- Does not replace the built-in LibreNMS filter system.
- Currently targets the device list only.

## Status

Experimental alpha package.

**Installation is not currently recommended.**

This package is under early development. The quick search JavaScript has been tested manually in a browser console, but the package installation flow has not yet been safely validated for LibreNMS production or test systems.

Do not install this package on an active LibreNMS instance unless you are deliberately testing it and have a rollback plan.

## Notes

More LibreNMS pages may be added later if the approach proves stable.

The first goal is to validate a safe installation method before recommending normal use.
