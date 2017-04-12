/************************************************************************* 
 * Web DJ Demo                                                           *
 * Written by Mason Bourgeois (@lsmonal) for Music Hacks ATX 04.15.2017  *
 * https://freetailhackers.com/music-hacks/                              *
 ************************************************************************/

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
                ':style="labelArt"></div>' +
              '</div>' +
              '<button type="button" :disabled="deck.track == false"' +
              '@click="togglePlay">' +
                '<i class="material-icons">{{ (playing !== false) ? "stop" : "play_arrow" }}</i>' + 
              '</button>' +
            '</div>',
  computed: {
    labelArt: function () {
      // We're going to want to get some artwork for the deck's track
      var artworkUrl = 'none';
      return { 
        backgroundImage: artworkUrl
      };
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
    return {
      faderPosition: 0,
      tracks: [],             // Will hold our playlist
      decks: {
        left: {track: false},
        right: {track: false}
      }
    };
  },
  created: function() {
    // We need to load our playlist when the app starts
  },
  methods: {
    loadTrack: function (side, track) {
      // We need to load the mp3 file for playback
    }
  }
});