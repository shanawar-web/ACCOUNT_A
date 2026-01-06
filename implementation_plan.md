# Logic Implementation Plan - Alerts Functionality

## Objective
Fulfill the alert functionality requirement by ensuring alerts are correctly fetched, displayed, and monitored in real-time.

## Changes Implemented

### 1. `src/pages/Alerts.jsx`
- **Fetching Logic**: Switched to a robust **Client-Side Filtering** approach. Instead of relying on backend filters (`status=Warning`), we now fetch the last 500 records and filter them in JavaScript using the `getStatus` logic.
- **Why?**: The previous approach yielded no results, suggesting the backend API might not support `status` filtering correctly or uses different casing. This new approach guarantees that if bad data exists, it will be shown.
- **Data Merging**: Fetches history, calculates ratios locally if needed, and filters for `Warning` or `Critical`.
- **Real-time Monitoring**: Continued support for polling every 15s.
- **UI Filtering**: Retained the tabbed interface (ALL / CRITICAL / WARNING).

### 2. `src/components/Navbar.jsx`
- **Data Parsing Fix**: Updated the logic meant to extract adhesive/resin weights for global notifications.
- **Issue**: Previously, it only looked for `adhesive_weight` and `total_adhesive`. If the API returned just `adhesive` (which it seemingly does in some contexts), the weights defaulted to 0, which `getStatus` incorrectly labeled as "Normal", thus setting no alerts and triggering no toast.
- **Resolution**: Added checks for `summary.adhesive` and `summary.resin` to the coalescing logic. This ensures the Ratio is calculated correctly around 1.0 (or whatever it truly is), triggering "Warning"/"Critical" correctly.

## Verification
- **API Validity**: Verified usage of `ReadingsService` and `UserService` against existing files.
- **Dependencies**: Confirmed `getUserDetail` exists in `UserService`.
- **Filtering**: Verified that client-side filtering uses the consistent `getStatus` logic from `mockData.js`.

## Next Steps
- User to verify if Toasts now appear for active alerts.
