import buildGeoserverUrl from './build-geoserver-url'

const defaultUrl = import.meta.env.VITE_WMTS_URL

function buildWmtsLayer ({
  url: rawUrl = defaultUrl,
  id,
  layer,
  style = '',
  paint = {},
  mapServiceVersion = '1.0.0',
  bbox = [],
  isVectorTiles = false,
  format,
}) {
  const url = new URL(rawUrl)
  const tile = buildGeoserverUrl({
    url: url.origin + url.pathname,
    service: 'WMTS',
    request: 'GetTile',
    layer,
    style,
    version: mapServiceVersion,
    format: isVectorTiles || format === 'application/vnd.mapbox-vector-tile'
      ? 'application/vnd.mapbox-vector-tile'
      : 'image/png',
    tilematrixset: 'EPSG:900913',
    tilematrix: 'EPSG:900913:{z}',
    tilerow: '{y}',
    tilecol: '{x}',
    encode: false,
    transparent: true,
  })

  console.log('layer', layer)
  return isVectorTiles || format === 'application/vnd.mapbox-vector-tile'
    ? {
        'id': layer.split(':')[1],
        layer,
        'type': 'line',
        'source': {
          type: 'vector',
          tiles: [tile],
          // bounds: bbox,
        },
        'source-layer': layer.split(':')[1],
        'paint': {
          'fill-color': '#0080ff',
          'fill-opacity': 1,
        },
      }
    : {
        id,
        layer,
        type: 'raster',
        source: {
          type: 'raster',
          tiles: [tile],
          tileSize: 256,
          // bounds: bbox,
        },
        paint,
      }
}

export default buildWmtsLayer
