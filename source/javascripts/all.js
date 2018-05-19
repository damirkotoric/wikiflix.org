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

  var uploadButton = document.getElementById('upload__button')
  var uploadFile = document.getElementById('upload__file')

  if (uploadButton) {
    uploadButton.addEventListener('click', function(e) {
      ga('send', 'event', 'Buttons', 'click', 'Uplod your photo')
    })
  }

  if (uploadFile) {
    uploadFile.addEventListener('change', function(e) {
    	console.log(e.currentTarget.files)
      console.log('starting AJAXSubmit')
    })
  }

  if(window.location.href.indexOf('ready') > -1) {
    var settings = URLToArray(window.location.href)
    console.log(settings)
    document.getElementById('botcraft_image_hero').setAttribute('src', settings.botcraft_image_output)
    document.getElementById('botcraft_image_output').setAttribute('src', settings.botcraft_image_output)
    document.getElementById('botcraft_image_input').setAttribute('src', settings.botcraft_image_input)
    document.getElementById('botcraft_image_style').setAttribute('src', settings.botcraft_image_style)
    document.getElementById('botcraft_twitter_share').setAttribute('href', 'https://twitter.com/share?url=' + settings.botcraft_image_output + "&amp;text=This photo was painted by a bot with @botcraft_io")
    document.getElementById('botcraft_facebook_share').setAttribute('href', 'http://www.facebook.com/sharer.php?u=' + settings.botcraft_image_output)
    document.body.classList.add('js-ready-loaded')
  }

  // Functions
  // https://stackoverflow.com/questions/4297765/make-a-javascript-array-from-url
  function URLToArray(url) {
    var request = {};
    var pairs = url.substring(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < pairs.length; i++) {
        if(!pairs[i])
            continue;
        var pair = pairs[i].split('=');
        request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
     }
     return request;
   }
}
