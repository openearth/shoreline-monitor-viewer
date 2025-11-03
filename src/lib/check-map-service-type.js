export default function checkMapServiceType (url) {
  // Check if the layer is a WMTS layer based on the URL
  const urlObject = new URL(url)
  const mapServiceType = urlObject.pathname.includes('wmts') ? 'wmts' : 'wms'
  return mapServiceType
}
