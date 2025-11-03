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
  format,
  vectorType,
  minZoom,
  maxZoom,
}) {
  const url = new URL(rawUrl)
  const tile = buildGeoserverUrl({
    url: url.origin + url.pathname,
    service: 'WMTS',
    request: 'GetTile',
    layer,
    style,
    version: mapServiceVersion,
    format,
    tilematrixset: 'EPSG:900913',
    tilematrix: 'EPSG:900913:{z}',
    tilerow: '{y}',
    tilecol: '{x}',
    encode: false,
    transparent: true,
  })

  return format === 'application/vnd.mapbox-vector-tile'
    ? {
        'id': layer.split(':')[1],
        layer,
        'type': vectorType,
        'source': {
          type: 'vector',
          tiles: [tile],
          ...(bbox && Array.isArray(bbox) && bbox.length > 0 && { bounds: bbox }),
        },
        'source-layer': layer.split(':')[1],
        paint,
        ...(minZoom && { minzoom: minZoom }),
        ...(maxZoom && { maxzoom: maxZoom }),
      }
    : {
        id,
        layer,
        type: 'raster',
        source: {
          type: 'raster',
          tiles: [tile],
          tileSize: 256,
          ...(bbox && Array.isArray(bbox) && bbox.length > 0 && { bounds: bbox }),
        },
        ...(minZoom && { minzoom: minZoom }),
        ...(maxZoom && { maxzoom: maxZoom }),
      }
}

export default buildWmtsLayer
