import sendWpsRequest from '@/lib/wps'

export default async function getStatsData (profileid) {
  if (!profileid) {
    throw new Error('No profileid provided to getStatsData')
  }

  try {
    const response = await sendWpsRequest({
      baseUrl: import.meta.env.VITE_WPS_URL,
      identifier: 'wps_shoreline_getstats',
      inputs: [
        {
          id: 'profileid',
          title: 'Retrieve shoreline statistics',
          type: 'ComplexData',
          mimeType: 'application/json',
          value: {
            profileid,
          },
        },
      ],
      outputIdentifier: 'profileinformation',
      mimeType: 'application/json',
    })

    if (response.errMsg) {
      throw new Error(response.errMsg)
    }

    return response
  } catch (error) {
    console.error('Failed to fetch shoreline data:', error)
    throw error
  }
}
