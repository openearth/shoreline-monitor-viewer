import sendWpsRequest from '@/lib/wps'

export default async function getLocationsData () {
  try {
    const response = await sendWpsRequest({
      identifier: 'wps_get_locations',
      inputs: [],
      outputIdentifier: 'locations',
      mimeType: 'application/json',
    })

    if (response.errMsg) {
      throw new Error(response.errMsg)
    }

    return response
  } catch (error) {
    console.error('Failed to fetch locations:', error)
    throw error
  }
}
