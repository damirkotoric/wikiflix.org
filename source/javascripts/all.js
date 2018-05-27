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

  // Variable definitions
  var instamentaryData = {}
  var controls = document.getElementById('controls')
  var playButton = document.getElementById('controls__play')
  var pauseButton = document.getElementById('controls__pause')
  var playerAudio = document.getElementById('player__audio')
  var playerImage = document.getElementById('player__image')
  var snippets = document.getElementById('snippets')
  var currentSnippetIndex = 0

  // Event listeners
  playButton.addEventListener('click', play)
  pauseButton.addEventListener('click', pause)
  playerAudio.addEventListener('ended', end)
  Array.prototype.forEach.call(snippets.querySelectorAll('.instamentary__snippet'), function(instamentarySnippet, i) {
    instamentarySnippet.addEventListener('click', jumpTo)
  })

  // Init
  loadData('/instamentaries/gesture-talks/info.json')

  // Functions
  function loadData(url) {
    var request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        instamentaryData = JSON.parse(this.response)
        controls.classList.remove('--loading')
      } else {
        // We reached our target server, but it returned an error.
        console.log('We reached our target server, but it returned an error.')
      }
    }
    request.onerror = function() {
      // There was a connection error of some sort.
      console.log('There was a connection error of some sort.')
    }
    request.send()
  }

  function play(e) {
    e = null || e
    if (isEmpty(instamentaryData)) {
      controls.classList.add('--loading')
    } else {
      // Play audio
      console.log('current snippet index is ' + currentSnippetIndex)
      var audioURL = instamentaryData.snippets[currentSnippetIndex].audioURL
      playerAudio.setAttribute('src', audioURL)
      playerAudio.play()
      controls.classList.remove('--loading')
      controls.classList.add('--playing')
      // Highlight active paragraph snippet
      var currentSnippet = snippets.querySelector('.instamentary__snippet.--active')
      if (currentSnippet) {
        currentSnippet.classList.remove('--active')
      }
      console.log(snippets.querySelector('.instamentary__snippet:nth-of-type(' + parseInt(currentSnippetIndex)+1 + ')'))
      snippets.querySelector('.instamentary__snippet:nth-of-type(' + parseInt(currentSnippetIndex+1) + ')').classList.add('--active')
      // Set active image
      console.log('image url is ' + instamentaryData.snippets[currentSnippetIndex].imageURL)
      var imageURL = instamentaryData.snippets[currentSnippetIndex].imageURL
      playerImage.setAttribute('src', imageURL)
    }
  }

  function pause(e) {
    playerAudio.pause()
    controls.classList.remove('--playing')
    var currentSnippet = snippets.querySelector('.instamentary__snippet.--active')
    currentSnippet.classList.remove('--active')
  }

  function end(e) {
    if (currentSnippetIndex < instamentaryData.snippets.length - 1) {
      // There's a next snippet. Play it.
      currentSnippetIndex++
      play(null)
    }
  }

  function jumpTo(e) {
    var el = e.currentTarget
    var childIndex = parseInt(Array.from(el.parentNode.children).indexOf(el))
    Array.prototype.forEach.call(snippets.querySelectorAll('.instamentary__snippet'), function(instamentarySnippet, i) {
      if (instamentarySnippet === el) {
        currentSnippetIndex = i
      }
    })
    play(null)
  }

  // Helpers
  function isEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object
  }
}
