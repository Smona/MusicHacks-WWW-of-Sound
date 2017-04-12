/************************************************************************* 
 * Web DJ Demo                                                           *
 * Written by Mason Bourgeois (@lsmonal) for Music Hacks ATX 04.15.2017  *
 * https://freetailhackers.com/music-hacks/                              *
 ************************************************************************/

var clientID = '28b05a26f8f8bec9d27bea7c938337ff';
//https://soundcloud.com/delatropic/sets/music-hacks-party-playlist
var playlistID = '313538315';

// Create an audio context. All Web Audio components are created through
// this context object. (notice the name can vary across browsers)
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx = new AudioContext();

// Sends an XmlHttpRequest to Soundcloud, including our client ID
// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
function sendScXhr(url, callback, responseType) {
  var request = new XMLHttpRequest();
  if (responseType !== undefined) {
    request.responseType = responseType;
  }
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      callback(this.response);
    }
  };
  request.open('GET', url + '?client_id=' + clientID, true);
  request.send();
}

// A reusable deck Vue Component
// https://vuejs.org/v2/guide/components.html
Vue.component('audio-deck', {
  props: ['deck', 'gain'],
  data: function () {
    return {
      playing: false,
      gainNode: audioCtx.createGain()
    };
  },
  // Templates are made much easier with ES6 template literals:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
  template: '<div class="deck">' +
              '<div class="record" :class="{ spinning: playing !== false}">' +
                '<div class="record-label"' +
                ':style="labelArt"></div>' +
              '</div>' +
              '<button type="button" :disabled="deck.track == false"' +
              '@click="togglePlay">' +
                '<i class="material-icons">{{ (playing !== false) ? "stop" : "play_arrow" }}</i>' + 
              '</button>' +
            '</div>',
  created: function () {
    // Connect the gain node to the speakers and initialize its value
    // when the component is created:
    this.gainNode.connect(audioCtx.destination);
    this.gainNode.gain.value = this.gain;
  },
  watch: {
    // Binds the gain node's value to our Vue prop
    gain: function (newGain) {
      this.gainNode.gain.value = newGain;
    }
  },
  computed: {
    labelArt: function () {
      var artworkUrl = 'none';
      if (this.deck.track.artwork_url) {
        artworkUrl = 'url(' + this.deck.track.artwork_url + ')';
      } else if (this.deck.track.waveform_url) {
        artworkUrl = 'url(' + this.deck.track.waveform_url + ')';
      }
      return { 
        backgroundImage: artworkUrl
      };
    }
  },
  methods: {
    togglePlay: function () {
      var playingBuffer = this.playing;
      if (playingBuffer) {
        // Stopping and disconnecting the buffer is important 
        // as it frees the buffer from memory
        playingBuffer.stop(0);
        playingBuffer.disconnect(this.gainNode);
        this.playing = false;
      } else {
        // Most Web Audio sources can only be started once, so
        // we create a new buffer whenever playback starts
        var source = audioCtx.createBufferSource();
        source.buffer = this.deck.track.audioData; // Load the decoded audio data
        source.onended = this.togglePlay;          // Pause the deck when the song finishes
        source.connect(this.gainNode);
        source.start(0);                           // Start playback of the buffer

        this.playing = source; // Store the playing buffer so we can stop it later
      }
    }
  }
});

// The root Vue Instance
new Vue({
  el: '#app',
  data: function () {
    return {
      faderPosition: 0,
      tracks: [],
      decks: {
        left: {track: false},
        right: {track: false}
      }
    };
  },
  // Load our playlist when the app starts
  created: function() {
    var app = this;
    sendScXhr('https://api.soundcloud.com/playlists/' + playlistID, 
      function (playlistData) {
        console.log(JSON.parse(playlistData));
        app.tracks = JSON.parse(playlistData).tracks;
      }
    );
  },
  methods: {
    loadTrack: function (side, track) {
      var deck = this.decks[side];
      sendScXhr(track.stream_url, function(audioData) {
          audioCtx.decodeAudioData(audioData, function(decodedData) {
            deck.track = track;
            deck.track.audioData = decodedData;
          });
        }, 
        // Request the track in a format compatible with Web Audio API
        'arraybuffer' 
      );
    }
  }
});