import buildWmsLayer from './build-wms-layer'
import buildWmtsLayer from './build-wmts-layer'
import checkMapServiceType from './check-map-service-type'

export default function buildMapboxLayer (layerConfig) {
  const mapServiceType = checkMapServiceType(layerConfig.url)
  if (mapServiceType === 'wms') {
    return buildWmsLayer(layerConfig)
  } else if (mapServiceType === 'wmts') {
    console.log('buildWmtsLayer', buildWmtsLayer(layerConfig))
    return buildWmtsLayer(layerConfig)
  }
}
