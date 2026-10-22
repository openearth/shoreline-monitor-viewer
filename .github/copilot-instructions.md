# Repository guidance

## Build, lint, and tests

- `npm run dev` starts Vite on port 3000.
- `npm run build` creates the production build.
- `npm run preview` serves the production build locally.
- `npm run lint` runs ESLint with `--fix` across the repository, so it may modify files. To lint one file without fixing it, run `npx eslint src/path/to/file.vue`.
- There is currently no test script or tracked test/spec suite, so there is no single-test command.

## Application structure

- `src/main.js` creates the Vue app, registers Vuetify, Vue Router, and Pinia via `src/plugins/index.js`, then mounts `src/App.vue`. The app shell renders the map in `src/components/MapComponent.vue`.
- `src/stores/map.js` loads `src/data/layers-config.json` and converts each entry into a Mapbox layer using `src/lib/build-mapbox-layer.js`. That helper selects the WMS or WMTS builder based on the configured service URL; `MapComponent.vue` renders the resulting layers through `@studiometa/vue-mapbox-gl`.
- Map layer visibility, source URLs, service format, and zoom limits are configured in `src/data/layers-config.json`. Keep service-specific URL construction in the corresponding `src/lib/build-*-layer.js` helpers rather than embedding it in UI components.
- Clicking a rendered feature in `MapLayer.vue` opens `FeaturePropertiesDialog.vue`. The dialog requests profile/time-series data through `src/lib/get-timeseries-data.js` and the WPS helpers in `src/lib/wps/`.
- `src/stores/app.js` owns shared application UI state, including the legal acceptance and panel state. Keep shared reactive state and its mutations in Pinia stores.
- Configure the runtime endpoints and token in `.env` using the `VITE_WMTS_URL`, `VITE_WPS_URL`, and `VITE_MAPBOX_TOKEN` variables documented in `.env.example`. Vite exposes client-side `VITE_` variables to the browser; do not put secrets in them.

## Purpose and WPS integration

- This viewer presents shoreline-change data on an interactive map. Selecting a shoreline profile loads its time-series visualization and allows the user to submit feedback. The WPS service is maintained separately in the `shoreline-monitor-wps` repository; do not assume its source or runtime is available in this workspace.
- Treat WPS process identifiers, input/output identifiers, data types, MIME types, response shapes, and returned URLs as client/server contracts. Coordinate changes to these contracts with the backend and update both sides when needed.
- `src/lib/get-timeseries-data.js` sends a WPS Execute request to `VITE_WPS_URL` for `wps_shoreline_getprofile`. It sends `profileid` as complex `application/json`, requests `application/json`, and uses the returned `url` to load the visualization. Preserve this request/response behavior when changing the dialog or WPS helpers.
- In this interface, `profileid` is the selected feature's `id`, corresponding to the backend's `gctr.index`; it is not `transect_id`. Keep the two identifiers distinct.
- Feedback is posted as JSON to `/feedback` on the origin of `VITE_WPS_URL` by `src/lib/submit-feedback.js`. Its payload includes `profileid` and the feature's `transect_id`; the backend uses the profile ID to look up metadata and checks that the transect ID matches. Preserve these field names and their meanings.
- For integration issues, trace the request from the viewer through the WPS adapter and processing handler to the generated result or feedback response, then back to its display in the viewer. Establish which side owns the failure from code or runtime evidence; if the backend is unavailable, state that it was not verified.

## Repository conventions

- Use the `@/` alias for imports from `src/`; it is configured in `vite.config.mjs`.
- Vue components are single-file `.vue` components and primarily use `<script setup>`. `MapLayer.vue` currently uses the Options API; follow the surrounding component pattern when editing it.
- Vite is configured with automatic imports for Vue, Pinia, router APIs, Vuetify components, and local components under `src/components/`. Check `vite.config.mjs` and the generated `auto-imports.d.ts` / `components.d.ts` before adding imports or changing component registration.
- Mapbox basemap choices, default center, and zoom are centralized in `src/lib/constants.js`; keep shared map defaults there.
