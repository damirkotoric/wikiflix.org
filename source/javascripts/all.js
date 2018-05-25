//= require fastclick
//= require modernizr

'use strict'

window.onload = function () {
  // Initiate Fastclick.js
  if ('addEventListener' in document) {
  	document.addEventListener('DOMContentLoaded', function() {
  		FastClick.attach(document.body)
  	}, false)
  }

  var controls = document.getElementById('controls')
  var playButton = document.getElementById('controls__play')
  var pauseButton = document.getElementById('controls__pause')
  var playerAudios = document.getElementById('player__audios')
  var snippets = document.getElementById('snippets')
  var snippetIndexToPlay = 0

  if (playButton) {
    playButton.addEventListener('click', function(e) {
      controls.classList.toggle('--playing')
      play()
    })
  }

  if (pauseButton) {
    pauseButton.addEventListener('click', function(e) {
      controls.classList.toggle('--playing')
      playerAudios.querySelector('audio').pause()
    })
  }

  // Functions
  function play() {
    playerAudios.querySelector('audio:nth-child(' + snippetIndexToPlay+1 + ')').play()
    var currentSnippet = snippets.querySelector('.instamentary__snippet.--active')
    if (currentSnippet) {
      currentSnippet.classList.remove('--active').nextElementSibling.classList.add('--active')
    } else {
      snippets.querySelector('.instamentary__snippet:first-child').classList.add('--active')
    }
  }
}
