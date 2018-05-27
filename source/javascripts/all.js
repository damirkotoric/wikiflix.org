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
  var inputForm = document.getElementById('input__form')
  var subscribeForm = document.getElementById('subscribe__form')
  var inputUrl = document.getElementById('input__url')
  var email = document.getElementById('email')
  var instamentaryControls = document.getElementById('instamentary__controls')
  var controls = document.getElementById('controls')
  var playButton = document.getElementById('play')
  var pauseButton = document.getElementById('pause')
  var player = document.getElementById('player')
  var playerAudio = document.getElementById('player__audio')
  var playerImage = document.getElementById('player__image')
  var playerBackground = document.getElementById('player__background')
  var snippets = document.getElementById('snippets')
  var modalClose = document.getElementById('modal__close')
  var subscribe = document.getElementById('subscribe')
  var subscribeOutputDone = document.getElementById('subscribe__output__done')
  var currentSnippetIndex = 0

  // Event listeners
  inputForm.addEventListener('submit', inputFormSubmitted)
  subscribeForm.addEventListener('submit', subscribeFormSubmitted)
  playButton.addEventListener('click', play)
  pauseButton.addEventListener('click', pause)
  playerAudio.addEventListener('ended', end)
  Array.prototype.forEach.call(snippets.querySelectorAll('.instamentary__snippet'), function(instamentarySnippet, i) {
    instamentarySnippet.addEventListener('click', jumpTo)
  })
  window.addEventListener('scroll', scrolling)
  modalClose.addEventListener('click', hideModal)
  subscribeOutputDone.addEventListener('click', hideModal)

  // Init
  loadData('/data/gesture-talks/info.json')

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
      console.log('image url is ' + instamentaryData.snippets[currentSnippetIndex].image.url)
      var imageURL = instamentaryData.snippets[currentSnippetIndex].image.url
      playerImage.setAttribute('src', '')
      playerImage.setAttribute('src', imageURL)
      playerBackground.setAttribute('src', '')
      playerBackground.setAttribute('src', imageURL)
      if (instamentaryData.snippets[currentSnippetIndex].image.style) {
        player.classList.remove('--style-cover')
        player.classList.remove('--style-contain')
        player.classList.add('--style-' + instamentaryData.snippets[currentSnippetIndex].image.style)
      }
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

  function scrolling(e) {
    if (window.pageYOffset < instamentaryControls.offsetTop) {
      controls.classList.remove('--sticky')
      console.log('normal')
    } else {
      controls.classList.add('--sticky')
      console.log('sticky')
    }
  }

  function inputFormSubmitted(e) {
    e.preventDefault()
    showModal(e)
  }

  function subscribeFormSubmitted(e) {
    e.preventDefault()
    var request = new XMLHttpRequest()
    var url = 'https://hooks.zapier.com/hooks/catch/437741/a8fgqq?email=' + email.value + '&url=' + inputUrl.value
    subscribe.classList.add('--loading')
    request.open('GET', url, true)
    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        console.log(this.response)
        subscribe.classList.remove('--loading')
        subscribe.classList.add('--subscribed')
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
    console.log()
    console.log(email.value)
  }

  function showModal(e) {
    document.body.classList.remove('--modal-hide')
    document.body.classList.add('--modal-show')
  }

  function hideModal(e) {
    document.body.classList.remove('--modal-show')
    document.body.classList.add('--modal-hide')
  }

  // Helpers
  function isEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object
  }
}
