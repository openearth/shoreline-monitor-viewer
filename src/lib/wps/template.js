export function buildWpsExecuteXml ({
  identifier,
  inputs = [],
  outputIdentifier = 'output_json',
  mimeType = 'application/json',
}) {
  const inputXml = inputs.map(input => {
    const { id, title = id, type = 'LiteralData', value, mimeType: inputMimeType } = input

    let dataBlock = ''
    if (type === 'LiteralData') {
      const literalContent = typeof value === 'object' ? JSON.stringify(value) : value
      dataBlock = `<wps:LiteralData>${literalContent}</wps:LiteralData>`
    } else if (type === 'ComplexData') {
      const complexContent = typeof value === 'object' ? JSON.stringify(value) : value
      dataBlock = `<wps:ComplexData${inputMimeType ? ` mimeType="${inputMimeType}"` : ''}>${complexContent}</wps:ComplexData>`
    }

    return `
    <wps:Input>
      <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">${id}</ows:Identifier>
      <ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">${title}</ows:Title>
      <wps:Data>
        ${dataBlock}
      </wps:Data>
    </wps:Input>`
  }).join('')

  return `
<wps:Execute xmlns:wps="http://www.opengis.net/wps/1.0.0"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             service="WPS"
             version="1.0.0"
             xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
  <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">${identifier}</ows:Identifier>
  ${inputs.length > 0 ? `<wps:DataInputs>${inputXml}</wps:DataInputs>` : ''}
  <wps:ResponseForm>
    <wps:RawDataOutput mimeType="${mimeType}">
      <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">${outputIdentifier}</ows:Identifier>
    </wps:RawDataOutput>
  </wps:ResponseForm>
</wps:Execute>`.trim()
}
