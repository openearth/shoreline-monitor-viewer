import sendWpsRequest from '@/lib/wps'

export default async function getTimeseriesData (peilfilterId, startDate = '', endDate = '') {
  if (!peilfilterId) {
    throw new Error('No peilfilterId provided to getTimeseriesData')
  }
  const peilfilterinfo = {
    peilfilterid: peilfilterId,
    start_date: startDate,
    end_date: endDate,
  }
  try {
    const response = await sendWpsRequest({
      identifier: 'wps_get_peilfilter_data',
      inputs: [{ id: 'peilfilterinfo', title: 'Peilfilterinfo as peilfilterId, StartDate and EndDate',
        type: 'ComplexData', mimeType: 'application/json', value: peilfilterinfo }],
      outputIdentifier: 'peilfilter_data',
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
