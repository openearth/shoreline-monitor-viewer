import getTimeseriesData from '@/lib/get-timeseries-data'

// Known profile from the WPS examples; used only to wake the service up.
const WARM_UP_PROFILE_ID = 2_805_066

// Fire-and-forget: the first real WPS call is slow, so trigger it while the user is still looking at the map.
export default function warmUpWps () {
  getTimeseriesData(WARM_UP_PROFILE_ID).catch(() => {})
}
