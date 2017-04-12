/************************************************************************* 
 * Web DJ Demo                                                           *
 * Written by Mason Bourgeois (@lsmonal) for Music Hacks ATX 04.15.2017  *
 * https://freetailhackers.com/music-hacks/                              *
 ************************************************************************/

// The root Vue Instance
new Vue({
  el: '#app',
  data: function () {
    return {
      faderPosition: 0,       // The position of our crossfader, from 0-1
      tracks: [],             // Will hold our playlist
      playing: false,         // Whether or not the track is playing
      track: false,           // Will hold our currently playing track
    };
  },
  created: function() {
    // We need to load our playlist when the app starts
  },
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
    loadTrack: function (track) {
      // We need to load the mp3 file for playback
    },
    togglePlay: function () {
      if (this.playing) {
        // Track was playing, we need to pause it
      } else {
        // Track was paused, we need to play it
      }
    }
  }
});