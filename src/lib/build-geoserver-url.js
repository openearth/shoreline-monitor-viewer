import queryString from 'query-string'

export default function buildGeoserverUrl ({ url, service, request, encode = true, ...rest }) {
  if (!service || !request) {
    return undefined
  }

  const params = queryString.stringify({ service, request, ...rest }, { encode, sort: false })

  return `${url}?${params}`
}
