//= require fastclick
//= require modernizr
//= require howler.min

'use strict'

$(document).ready(function() {
  // Initiate Fastclick.js
  FastClick.attach(document.body)

  // Variable definitions
  var wikiflixData = {}
  var $banner = $('#banner')
  var $inputForm = $('#input-form')
  var $subscribeForm = $('#subscribe-form')
  var $inputUrl = $('#input-url')
  var $randomUrl = $('#random-url')
  var $email = $('#email')
  var $wikiflixControls = $('#wikiflix-controls')
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
  var initialLinks = ['Amsterdam', 'Moon', 'Piracy', 'Leonardo_da_Vinci', 'Babylon', 'Nikola_Tesla', 'Rule_of_three_(writing)', '1883_eruption_of_Krakatoa', 'Great_Pyramid_of_Giza']

  // Wikiflix content variable definitions
  var $wikiflixTitle = $('#wikiflix-title')
  var $wikiflixTeaser = $('#wikiflix-teaser')
  var $wikipediaURL = $('#wikipedia-url')
  var $playerImageForeground = $('#player-image-foreground')
  var $playerImageBackground = $('#player-image-background')

  // Event listeners
  $inputForm.on('submit', inputFormSubmitted)
  $inputUrl.on('paste', urlPaste)
  $inputUrl.on('focus', selectURL)
  $randomUrl.on('click', getRandomArticle)
  $playButton.on('click', play)
  $pauseButton.on('click', pause)
  $('.wikiflix__snippet').on('click', jumpTo)
  $(window).on('scroll', scrolling)
  $modalClose.on('click', hideModal)
  $subscribeOutputDone.on('click', hideModal)
  $(window).on('hashchange', hashChanged)

  // Init
  $inputUrl.val('https://en.wikipedia.org/wiki/' + window.location.hash.substr(1))
  if (window.location.hash === '') {
    getRandomArticle()
  } else {
    $inputForm.submit()
  }

  // Functions
  function getRandomArticle() {
    var randomIndex = Math.floor(Math.random() * initialLinks.length)
    if (window.location.hash.substr(1) === initialLinks[randomIndex]) {
      // Try again
      getRandomArticle()
    } else {
      $inputUrl.val('https://en.wikipedia.org/wiki/' + initialLinks[randomIndex])
      $inputForm.submit()
    }
  }

  function loadData(url) {
    var request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        wikiflixData = JSON.parse(this.response)
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
    e = e || null
    if (isEmpty(wikiflixData)) {
      $controls.addClass('--loading')
    } else {
      // Play audio
      console.log('current snippet index is ' + currentSnippetIndex)
      if (audio && audio.playing) {
        audio.stop()
      }
      audio = new Howl({
        src: [wikiflixData.snippets[currentSnippetIndex].audioURL]
      })
      audio.on('end', end)
      audioID = audio.play()
      $controls.removeClass('--loading')
      $controls.addClass('--playing')
      // Highlight active paragraph snippet
      var currentSnippet = $snippets.querySelector('.wikiflix__snippet.--active')
      if (currentSnippet) {
        currentSnippet.removeClass('--active')
      }
      console.log($snippets.querySelector('.wikiflix__snippet:nth-of-type(' + parseInt(currentSnippetIndex)+1 + ')'))
      $snippets.querySelector('.wikiflix__snippet:nth-of-type(' + parseInt(currentSnippetIndex+1) + ')').addClass('--active')
      // Create new playerForeground
      var newPlayerForeground = playerForeground.cloneNode([true])
      newPlayerForeground.addClass('--foreground')
      playerForeground.parentNode.appendChild(newPlayerForeground)
      console.log('image url is ' + wikiflixData.snippets[currentSnippetIndex].image.url)
      newPlayerForeground.querySelector('.player__image__foreground').setAttribute('src', wikiflixData.snippets[currentSnippetIndex].image.url)
      newPlayerForeground.querySelector('.player__image__background').setAttribute('src', wikiflixData.snippets[currentSnippetIndex].image.url)
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
      playerForeground.addClass('--style-' + wikiflixData.snippets[currentSnippetIndex].image.style)
    }
  }

  function pause(e) {
    audio.pause()
    $controls.removeClass('--playing')
  }

  function end(e) {
    if (currentSnippetIndex < wikiflixData.snippets.length - 1) {
      // There's a next snippet. Play it.
      currentSnippetIndex++
      play(null)
    }
  }

  function jumpTo(e) {
    var el = e.currentTarget
    var childIndex = parseInt(Array.from(el.parentNode.children).indexOf(el))
    Array.prototype.forEach.call($snippets.querySelectorAll('.wikiflix__snippet'), function(wikiflixSnippet, i) {
      if (wikiflixSnippet === el) {
        currentSnippetIndex = i
      }
    })
    play(null)
  }

  function scrolling(e) {
    if (window.pageYOffset < $wikiflixControls.offset().top) {
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
    // Set hash on URL
    var url = $inputUrl.val()
    if (url[url.length - 1] === '/') {
      url = url.slice(0, -1)
    }
    var hash = url.substring(url.lastIndexOf('/') + 1)
    window.location.hash = hash
    // Load data
    $.ajax({
      url: $inputForm.attr('action'),
      type: "post",
      data: $inputForm.serializeArray(),
      success: function (response) {
        populateData(response)
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

  function showBanner(message, isPermanent) {
    isPermanent = isPermanent || false
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

  function populateData(jsonData) {
    $('body').removeClass('js-loading-item')
    $('body').addClass('js-loaded-item')
    console.log(jsonData)
    var pageID = Object.keys(jsonData.query.pages)[0]
    // Print data
    $wikiflixTitle.text(jsonData.query.pages[pageID].title)
    var description = jsonData.query.pages[pageID].description
    if (description) {
      $wikiflixTeaser.text(description)
    } else {
      $wikiflixTeaser.text('')
    }
    if (jsonData.query.pages[pageID].thumbnail) {
      $playerImageForeground.attr('src', jsonData.query.pages[pageID].thumbnail.source)
    } else {
      $playerImageForeground.attr('src', '')
    }
    $snippets.html(jsonData.query.pages[pageID].extract)
    if (jsonData.query.pages[pageID].fullurl) {
      $wikipediaURL.attr('href', jsonData.query.pages[pageID].fullurl)
    }
  }

  function hashChanged(e) {
    $inputUrl.val('https://en.wikipedia.org/wiki/' + window.location.hash.substr(1))
    $inputForm.submit()
  }
});
