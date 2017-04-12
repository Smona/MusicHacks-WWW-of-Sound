var clientID = '28b05a26f8f8bec9d27bea7c938337ff';
//https://soundcloud.com/delatropic/sets/music-hacks-party-playlist
var playlistID = '313538315';

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
      playing: false
    };
  },
  // Templates are made much easier with ES6 template literals:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
  template: '<div class="deck">' +
              '<div class="record" :class="{ spinning: playing !== false}">' +
                '<div class="record-label"' +
                ':style="{ backgroundImage: \'url(\' + deck.track.artwork_url + \')\' }"></div>' +
              '</div>' +
              '<button type="button" :disabled="deck.track == false"' +
              '@click="togglePlay">' +
                '<i class="material-icons">{{ (playing !== false) ? "pause" : "play_arrow" }}</i>' + 
              '</button>' +
            '</div>',
  watch: {
    // Make sure the deck is paused before we load a new track
    track: function () {
      if (this.playing !== false) {
        this.togglePlay();
      }
    }
  },
  methods: {
    togglePlay: function () {
      if (playingBuffer) {
        // Track was playing, we need to pause it
      } else {
        // Track was paused, we need to play it
      }
    }
  }
});

// The root Vue Instance
new Vue({
  el: '#app',
  data: function () {
    function emptyDeck () { 
      return {
        track: false
      };
    }
    return {
      faderPosition: 0,
      tracks: [],
      decks: {
        left: emptyDeck(),
        right: emptyDeck()
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
          console.log(audioData);
        }, 
        // Request the track in a format compatible with Web Audio API
        'arraybuffer' 
      );
    }
  }
});