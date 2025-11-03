import axios from 'axios'
import { buildWpsExecuteXml } from './template'

/**
/**
 * Sends a WPS Execute request using XML.
 *
 * @param {Object} config
 * @param {string} config.identifier - WPS process identifier (e.g., 'create_transect')
 * @param {Array<Object>} [config.inputs] - List of input parameters, each with:
 *    - id {string}: WPS input identifier
 *    - type {string}: 'LiteralData' or 'ComplexData'
 *    - value {string|object}: Literal value or GeoJSON object
 *    - title {string} [optional]: Optional title
 *    - mimeType {string} [optional]: Only for ComplexData
 * @param {string} [config.outputIdentifier='output_json'] - Output identifier name
 * @param {string} [config.mimeType='application/json'] - Desired response mime type
 *
 * @returns {Promise<Object>} Parsed response data
 */

export default function sendWpsRequest ({
  baseUrl,
  identifier,
  inputs = [],
  outputIdentifier = 'output_json',
  mimeType = 'application/json',
}) {
  const template = buildWpsExecuteXml({
    identifier,
    inputs,
    outputIdentifier,
    mimeType,
  })

  return axios({
    method: 'post',
    url: baseUrl,
    data: template,

    headers: {
      'Content-Type': 'application/xml',
      'Accept': 'application/json',
    },
  }).then(({ data }) => {
    return typeof data === 'object' ? data : JSON.parse(data)
  })
}
