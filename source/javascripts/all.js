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
  var $inputURL = $('#input-url')
  var $randomUrl = $('#random-url')
  var $email = $('#email')
  var $wikiflixControls = $('#wikiflix-controls')
  var $controls = $('#controls')
  var $playButton = $('#play')
  var $pauseButton = $('#pause')
  var $randomiseButton = $('#randomise')
  var $logoLink = $('#logo-link')
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

  // Wikiflix content variable definitions
  var $wikiflixTitle = $('#wikiflix-title')
  var $wikiflixTeaser = $('#wikiflix-teaser')
  var $wikipediaURL = $('#wikipedia-url')
  var $playerImageForeground = $('#player-image-foreground')
  var $playerImageBackground = $('#player-image-background')
  var $jumpToTop = $('#jump_to_top')

  // Event listeners
  $inputForm.on('submit', inputFormSubmitted)
  $inputURL.on('paste', urlPaste)
  $inputURL.on('focus', selectURL)
  $playButton.on('click', play)
  $pauseButton.on('click', pause)
  $logoLink.on('click', randomise)
  $randomiseButton.on('click', randomise)
  $('.wikiflixSnippet').on('click', jumpTo)
  $(window).on('scroll', scrolling)
  $modalClose.on('click', hideModal)
  $subscribeOutputDone.on('click', hideModal)
  $jumpToTop.on('click', jumpToTop)
  $(window).on('hashchange', hashChanged)

  // Init
  $inputURL.val('https://en.wikipedia.org/wiki/' + window.location.hash.substr(1))
  getWikiflix()

  // Functions
  function getWikiflix() {
    $('body').addClass('-js-loading-item')
    $inputURL.blur()
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
         $('body').removeClass('-js-loading-item')
         if (error.responseText) {
           showBanner(error.responseText)
         } else {
           showBanner('Connection failed')
         }
      }
    })
  }

  function populateData(jsonData) {
    $('body').removeClass('-js-loading-item')
    $('body').addClass('-js-loaded-item')
    console.log(jsonData)
    var pageID = Object.keys(jsonData.query.pages)[0]
    // Print data
    var url = jsonData.query.pages[pageID].canonicalurl
    var urlPath = url.substring(url.lastIndexOf('/wiki/') + 6)
		var hash = urlPath.replace(/\/$/, '')
    window.location.hash = hash
    $wikiflixTitle.text(jsonData.query.pages[pageID].title)
    var description = jsonData.query.pages[pageID].description
    if (description) {
      $wikiflixTeaser.text(description)
    } else {
      $wikiflixTeaser.text('')
    }
    if (jsonData.query.pages[pageID].thumbnail) {
      $playerImageForeground.attr('src', '')
      $playerImageForeground.attr('src', jsonData.query.pages[pageID].thumbnail.source)
    } else {
      $playerImageForeground.attr('src', '')
    }
    $snippets.html(jsonData.query.pages[pageID].extract)
    if (jsonData.query.pages[pageID].fullurl) {
      $wikipediaURL.attr('href', jsonData.query.pages[pageID].fullurl)
    }
  }

  function randomise(e) {
    e.preventDefault()
    $inputURL.val('https://en.wikipedia.org/wiki/')
    getWikiflix()
  }

  function play(e) {
    e = e || null
    if (isEmpty(wikiflixData)) {
      $controls.addClass('-loading')
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
      $controls.removeClass('-loading')
      $controls.addClass('-playing')
      // Highlight active paragraph snippet
      var currentSnippet = $snippets.querySelector('.wikiflixSnippet.-active')
      if (currentSnippet) {
        currentSnippet.removeClass('-active')
      }
      console.log($snippets.querySelector('.wikiflixSnippet:nth-of-type(' + parseInt(currentSnippetIndex)+1 + ')'))
      $snippets.querySelector('.wikiflixSnippet:nth-of-type(' + parseInt(currentSnippetIndex+1) + ')').addClass('-active')
      // Create new playerForeground
      var newPlayerForeground = playerForeground.cloneNode([true])
      newPlayerForeground.addClass('-foreground')
      playerForeground.parentNode.appendChild(newPlayerForeground)
      console.log('image url is ' + wikiflixData.snippets[currentSnippetIndex].image.url)
      newPlayerForeground.querySelector('.playerImageForeground').setAttribute('src', wikiflixData.snippets[currentSnippetIndex].image.url)
      newPlayerForeground.querySelector('.playerImageBackground').setAttribute('src', wikiflixData.snippets[currentSnippetIndex].image.url)
      newPlayerForeground.removeClass('-style-cover')
      newPlayerForeground.removeClass('-style-contain')
      // Remove old $playerBackground
      $playerBackground.parentNode.removeChild($playerBackground)
      // Set old playerForeground to new $playerBackground
      playerForeground.removeClass('-foreground')
      playerForeground.setAttribute('id', 'playerBackground')
      // Update references to players
      $playerBackground = playerForeground
      playerForeground = newPlayerForeground
      // Animate in playerForeground
      // https://css-tricks.com/restart-css-animation/
      void playerForeground.offsetWidth
      playerForeground.addClass('-style-' + wikiflixData.snippets[currentSnippetIndex].image.style)
    }
  }

  function pause(e) {
    audio.pause()
    $controls.removeClass('-playing')
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
    Array.prototype.forEach.call($snippets.querySelectorAll('.wikiflixSnippet'), function(wikiflixSnippet, i) {
      if (wikiflixSnippet === el) {
        currentSnippetIndex = i
      }
    })
    play(null)
  }

  function scrolling(e) {
    if (window.pageYOffset < $wikiflixControls.offset().top) {
      $controls.removeClass('-sticky')
      console.log('normal')
    } else {
      $controls.addClass('-sticky')
      console.log('sticky')
    }
  }

  function urlPaste(e) {
    $inputURL[0].value = e.originalEvent.clipboardData.getData('text')
    console.log($inputURL)
    $inputForm.submit()
  }

  function selectURL() {
    $(this).select()
  }

  function inputFormSubmitted(e) {
    e.preventDefault()
    getWikiflix()
  }

  function showBanner(message, isPermanent) {
    isPermanent = isPermanent || false
    $('body').addClass('-js-banner-visible')
    $banner.text(message)
    window.setTimeout(function() {
      $('body').removeClass('-js-banner-visible')
    }, 5000)
  }

  function showModal(e) {
    $('body').removeClass('-modal-hide')
    $('body').addClass('-modal-show')
  }

  function hideModal(e) {
    $('body').removeClass('-modal-show')
    $('body').addClass('-modal-hide')
  }

  function hashChanged(e) {
    $inputURL.val('https://en.wikipedia.org/wiki/' + window.location.hash.substr(1))
    $inputForm.submit()
  }

  function jumpToTop(e) {
    e.preventDefault()
    $('html, body').scrollTop(600)
    $('html, body').animate({ scrollTop: 0 }, 200)
  }
});
