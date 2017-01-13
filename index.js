var CSVStream = require('csv-streamify').CSVStream
var createReadStream = require('graceful-fs').createReadStream
var resolve = require('path').resolve

var csv = new CSVStream({
  delimiter: '\t',
  objectMode: true
})

csv.on('error', function (er) {
  console.error(er.stack)
  process.exit(1)
})

csv.on('data', function (entry) {
  if (entry.length !== 8) return
  dump(entry)
})

var FIXME_PATH = resolve('/Volumes', 'SANSA CLIPZ', '.scrobbler.log')
createReadStream(FIXME_PATH).pipe(csv)

function dump (entry) {
  var artist = entry[0]
  var album = entry[1]
  var title = entry[2]
  var index = entry[3]
  var durationInSeconds = entry[4]
  var playRating = entry[5]
  var timestamp = entry[6]
  var mbid = entry[7]

  function toTimeString (timestamp) {
    var then = new Date(parseInt(timestamp, 10) * 1000)

    return then.toUTCString()
  }

  function toDurationString (duration) {
    return Math.floor(duration / 60) + ':' + (duration % 60)
  }

  console.log(
    '[%s] %s - %s - %s %s (%s) %s %s',
    toTimeString(timestamp),
    artist,
    title,
    album,
    index,
    toDurationString(durationInSeconds),
    playRating === 'L' ? 'played' :
      playRating === 'S' ? 'skipped' :
      playRating,
    mbid ? '[mb]' : ''
  )
}
