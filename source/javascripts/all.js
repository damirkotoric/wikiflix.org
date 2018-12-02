//= require fastclick
//= require modernizr
//= require howler.min

'use strict'

$(document).ready(function() {
  // Initiate Fastclick.js
  FastClick.attach(document.body)

  // Variable definitions
  var instamentaryData = {}
  var $banner = $('#banner')
  var $inputForm = $('#input-form')
  var $subscribeForm = $('#subscribe-form')
  var $inputUrl = $('#input-url')
  var $email = $('#email')
  var $instamentaryControls = $('#instamentary-controls')
  var $controls = $('#controls')
  var $playButton = $('#play')
  var $pauseButton = $('#pause')
  var $playerForeground = $('#player-foreground')
  var $playerBackground = $('#player-background')
  var $snippets = $('#snippets')
  var $modalClose = $('#modal-close')
  var $subscribe = $('#subscribe')
  var $subscribeOutputDone = $('#subscribe-output-done')
  var currentSnippetIndex = 0
  var audio
  var audioID
  var audioPaused = false
  var audioSeek

  // Event listeners
  $inputForm.on('submit', inputFormSubmitted)
  $inputUrl.on('paste', urlPaste)
  $inputUrl.on('focus', selectURL)
  $playButton.on('click', play)
  $pauseButton.on('click', pause)
  $('.instamentary__snippet').on('click', jumpTo)
  $(window).on('scroll', scrolling)
  $modalClose.on('click', hideModal)
  $subscribeOutputDone.on('click', hideModal)

  // Init
  loadData('/data/instamentaries/gesture-talks.json')

  // Functions
  function loadData(url) {
    var request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        instamentaryData = JSON.parse(this.response)
        $controls.removeClass('--loading')
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
      $controls.addClass('--loading')
    } else {
      // Play audio
      console.log('current snippet index is ' + currentSnippetIndex)
      if (audio && audio.playing) {
        audio.stop()
      }
      audio = new Howl({
        src: [instamentaryData.snippets[currentSnippetIndex].audioURL]
      })
      audio.on('end', end)
      audioID = audio.play()
      $controls.removeClass('--loading')
      $controls.addClass('--playing')
      // Highlight active paragraph snippet
      var currentSnippet = $snippets.querySelector('.instamentary__snippet.--active')
      if (currentSnippet) {
        currentSnippet.removeClass('--active')
      }
      console.log($snippets.querySelector('.instamentary__snippet:nth-of-type(' + parseInt(currentSnippetIndex)+1 + ')'))
      $snippets.querySelector('.instamentary__snippet:nth-of-type(' + parseInt(currentSnippetIndex+1) + ')').addClass('--active')
      // Create new playerForeground
      var newPlayerForeground = playerForeground.cloneNode([true])
      newPlayerForeground.addClass('--foreground')
      playerForeground.parentNode.appendChild(newPlayerForeground)
      console.log('image url is ' + instamentaryData.snippets[currentSnippetIndex].image.url)
      newPlayerForeground.querySelector('.player__image__foreground').setAttribute('src', instamentaryData.snippets[currentSnippetIndex].image.url)
      newPlayerForeground.querySelector('.player__image__background').setAttribute('src', instamentaryData.snippets[currentSnippetIndex].image.url)
      newPlayerForeground.removeClass('--style-cover')
      newPlayerForeground.removeClass('--style-contain')
      // Remove old $playerBackground
      $playerBackground.parentNode.removeChild($playerBackground)
      // Set old playerForeground to new $playerBackground
      playerForeground.removeClass('--foreground')
      playerForeground.setAttribute('id', 'player__background')
      // Update references to players
      $playerBackground = playerForeground
      playerForeground = newPlayerForeground
      // Animate in playerForeground
      // https://css-tricks.com/restart-css-animation/
      void playerForeground.offsetWidth
      playerForeground.addClass('--style-' + instamentaryData.snippets[currentSnippetIndex].image.style)
    }
  }

  function pause(e) {
    audio.pause()
    $controls.removeClass('--playing')
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
    Array.prototype.forEach.call($snippets.querySelectorAll('.instamentary__snippet'), function(instamentarySnippet, i) {
      if (instamentarySnippet === el) {
        currentSnippetIndex = i
      }
    })
    play(null)
  }

  function scrolling(e) {
    if (window.pageYOffset < $instamentaryControls.offset().top) {
      $controls.removeClass('--sticky')
      console.log('normal')
    } else {
      $controls.addClass('--sticky')
      console.log('sticky')
    }
  }

  function urlPaste(e) {
    $inputUrl[0].value = e.originalEvent.clipboardData.getData('text')
    console.log($inputUrl)
    $inputForm.submit()
  }

  function selectURL() {
    $(this).select()
  }

  function inputFormSubmitted(e) {
    e.preventDefault()
    $('body').addClass('js-loading-item')
    $inputUrl.blur()
    $.ajax({
      url: $inputForm.attr('action'),
      type: "post",
      data: $inputForm.serializeArray(),
      success: function (response) {
        console.log(response.text['*'])
        $('body').html(response.text['*'])
        $('body').removeClass('js-loading-item')
        $('body').addClass('js-loaded-item')
      },
      error: function(error) {
         console.log('Error fetching data.')
         $('body').removeClass('js-loading-item')
         if (error.responseText) {
           showBanner(error.responseText)
         } else {
           showBanner('Connection failed')
         }
      }
    })
  }

  function showBanner(message, isPermanent = false) {
    $('body').addClass('js-banner-visible')
    $banner.text(message)
    window.setTimeout(function() {
      $('body').removeClass('js-banner-visible')
    }, 5000)
  }

  function showModal(e) {
    $('body').removeClass('--modal-hide')
    $('body').addClass('--modal-show')
  }

  function hideModal(e) {
    $('body').removeClass('--modal-show')
    $('body').addClass('--modal-hide')
  }
});
