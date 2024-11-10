importScripts('../../src/fetch-progress.js')

const init = async () => {
  await run_test(4)
}

const run_test = async (which) => {
  const url = get_url(which)

  await fetch(url)
    .then(fetchProgress(event => {postMessage({type: 'progress', event})}))
    .then(res => 'Download is complete. Total size is ' + res.bytes().byteLength + ' bytes.')
    .then(message => {postMessage({type: 'alert', message})})
}

const get_url = (which) => {
  switch(which) {
    case 4:
      return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

    case 3:
      // https://peach.blender.org/download/
      // https://download.blender.org/demo/movies/BBB/
      //   CORS blocks fetch()
      return 'https://download.blender.org/demo/movies/BBB/bbb_sunflower_1080p_60fps_normal.mp4.zip'

    case 2:
      // https://fedoraproject.org/spins/xfce/download
      //   CORS blocks fetch()
      return 'https://download.fedoraproject.org/pub/fedora/linux/releases/41/Spins/x86_64/iso/Fedora-Xfce-Live-x86_64-41-1.4.iso'

    case 1:
    default:
      // https://ubuntu.com/download/desktop
      //   CORS blocks fetch()
      return 'https://releases.ubuntu.com/24.04.1/ubuntu-24.04.1-desktop-amd64.iso'
  }
}

onmessage = (event) => {
  if (event && (event.data === 'init'))
    init()
}
