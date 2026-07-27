import axios from 'axios'

function getFeedbackUrl () {
  const wpsUrl = import.meta.env.VITE_WPS_URL

  if (!wpsUrl) {
    throw new Error('VITE_WPS_URL is required to derive feedback endpoint')
  }

  return `${new URL(wpsUrl).origin}/feedback`
}

export default async function submitFeedback (payload) {
  const response = await axios({
    method: 'post',
    url: getFeedbackUrl(),
    data: payload,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return response.data
}
