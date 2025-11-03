import buildGeoserverUrl from './build-geoserver-url'

const defaultUrl = process.env.VUE_APP_GEOSERVER_BASE_URL

export default ({ url: rawUrl = defaultUrl, id, layer, styles = '', paint = {}, tileSize = 256, time, filter, mapServiceVersion }) => {
  const url = new URL(rawUrl)
  const searchParamEntries = url.searchParams.entries()
  const searchParamsObject = Object.fromEntries(searchParamEntries)

  const tile = buildGeoserverUrl({
    url: url.origin + url.pathname,
    service: 'WMS',
    request: 'GetMap',
    layers: layer,
    styles,
    width: 256,
    height: 256,
    version: mapServiceVersion,
    ...(time) && { time },
    ...(filter) && { cql_filter: filter },
    crs: 'EPSG:3857',
    transparent: true,
    bbox: '{bbox-epsg-3857}',
    format: 'image/png',
    encode: false,
    ...searchParamsObject,
  })

  return {
    id,
    layer,
    type: 'raster',
    source: {
      type: 'raster',
      tiles: [tile],
      tileSize,
    },
    paint,
  }
}
