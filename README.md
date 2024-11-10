### [_fetchProgress_](https://github.com/warren-bank/browser-fetch-progress)

A middleware function for use with the browser [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to provide download progress updates.

#### CDN

* [jsdelivr](https://cdn.jsdelivr.net/npm/@warren-bank/browser-fetch-progress@latest/src/fetch-progress.js)
* [unpkg](https://unpkg.com/@warren-bank/browser-fetch-progress@latest/src/fetch-progress.js)

#### Usage

```javascript
  const buffer = await fetch(url)
    .then(fetchProgress(event => console.log(`download is ${event.progress * 100} percent complete..`)))
    .then(res => res.arrayBuffer())
```

#### Examples

* [download large file](https://warren-bank.github.io/browser-fetch-progress/tests/2-e2e/download-large-file.html)
* [download large file in web worker](https://warren-bank.github.io/browser-fetch-progress/tests/3-web-worker/download-large-file.html)

#### Notes

* `fetchProgress` is a function
  - it accepts 1 input parameter
    * an event handler function
    * lets call it `progressHandler`
* `progressHandler` is a function
  - it accepts 1 input parameter
    * an Object
    * lets call it `event`
      - it has 1 attribute
        * name: `progress`
        * value: number within the inclusive range _0 to 1_
  - it returns a Promise that resolves to an instance of a class
    * having the following public methods:
      - `arrayBuffer()`
      - `blob()`
      - `bytes()`
      - `json()`
      - `text()`
    * having the following public properties:
      - `headers`
      - `ok`
      - `redirected`
      - `status`
      - `statusText`
      - `type`
      - `url`
    * these public methods and properties can be used as drop-in replacements for several of the methods and properties provided by the [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response) class, with the following caveats:
      - `headers` is a plain key/value Object, rather than an instance of the [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers) class

#### Credits

* article: ["Fetch: Download progress"](https://javascript.info/fetch-progress)
* article: ["A horrifying 'globalThis' polyfill in universal JavaScript"](https://mathiasbynens.be/notes/globalthis)

#### Legal

* copyright: [Warren Bank](https://github.com/warren-bank)
* license: [GPL-2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
