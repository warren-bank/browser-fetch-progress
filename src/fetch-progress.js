(function() {

  const fetchProgress = (progressHandler) => {
    return (progressHandler && (typeof progressHandler === 'function'))
      ? progressMiddleware.bind(null, progressHandler)
      : passThroughMiddleware
  }

  const passThroughMiddleware = async (res) => res

  const progressMiddleware = async (progressHandler, res) => {
    const content_length = parseInt(res.headers.get('Content-Length'), 10)

    /*
     * passthrough if any of the following conditions are met:
     */
    try {
      // bad status
      if ((res.status < 200) || (res.status >= 300))
        throw 1

      // empty body
      if (!res.body || !res.body.getReader)
        throw 1

      // {mode: 'no-cors'}
      if (['error', 'opaque', 'opaqueredirect'].includes(res.type))
        throw 1

      // unable to determine the total size of download
      if (isNaN(content_length) || (content_length <= 0))
        throw 1
    }
    catch(e) {
      return res
    }

    const reader = res.body.getReader()
    const received_chunks = []
    let received_length = 0
    while(true) {
      const {done, value} = await reader.read()

      if (value && value.length) {
        received_chunks.push(value)
        received_length += value.length

        const progress = received_length / content_length
        progressHandler({progress})
      }

      if (done) {
        break
      }
    }

    const combined_chunks = new Uint8Array(received_length)  // concatenate chunks into single Uint8Array
    let position = 0
    for (const chunk of received_chunks) {
      combined_chunks.set(chunk, position)
      position += chunk.length
    }

    return new ResponseWrapper(res, combined_chunks)
  }

  class ResponseWrapper {
    constructor(res, uint8) {
      this.uint8 = uint8

      // copy a selection of response properties
      try {
        for (const prop of ['ok', 'redirected', 'status', 'statusText', 'type', 'url']) {
          this[prop] = res[prop]
        }

        this.headers = {}
        for (const [key, value] of res.headers.entries()) {
          this.headers[key] = value
        }
      }
      catch(e) {
        console.error(e)
      }
    }

    bytes() {
      return this.uint8
    }

    arrayBuffer() {
      return this.uint8.buffer
    }

    blob() {
      return new Blob([this.uint8])
    }

    text() {
      return new TextDecoder('utf-8').decode(this.uint8)
    }

    json() {
      return JSON.parse(
        this.text()
      )
    }
  }

  const init = () => {
    const _globalThis = getGlobalThis()
    if (_globalThis) _globalThis.fetchProgress = fetchProgress
  }

  const getGlobalThis = () => {
    if (typeof globalThis !== 'undefined') return globalThis
    if (typeof self !== 'undefined') return self
    if (typeof window !== 'undefined') return window
    if (typeof global !== 'undefined') return global
    return null
  }

  init()

})()
