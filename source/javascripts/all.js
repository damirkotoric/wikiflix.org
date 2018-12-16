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
  var initialLinks = [
    '%27Pataphysics',
    '1883_eruption_of_Krakatoa',
    'Aboriginal_Australians',
    'Accessory_breast',
    'Adolf_Hitler_and_vegetarianism',
    'Age_of_Discovery',
    'Akita_(dog)',
    'Amateur_radio',
    'Amelia_Earhart',
    'American_Revolution',
    'Ampelmännchen',
    'Amsterdam',
    'Ancient_Greece',
    'Andrée%27s_Arctic_balloon_expedition',
    'Andromeda–Milky_Way_collision',
    'Animal_trial',
    'Animals_in_space',
    'Anthropomorphism',
    'Anti-tank_dog',
    'Antikythera_mechanism',
    'April_Fools%27_Day',
    'Area_51',
    'Artist%27s_Shit',
    'As_Slow_as_Possible',
    'Atari_video_game_burial',
    'Atmosphere_of_Jupiter',
    'Automaton',
    'AVE_Mizar',
    'Babylon',
    'Bacteria',
    'Ball%27s_Pyramid',
    'Banana_production_in_Iceland',
    'Bat_bomb',
    'Battle_of_Tanga',
    'Bicycle_infantry',
    'Big_Hole',
    'Black_hole',
    'Blackbeard',
    'Blinkenlights',
    'Blood_sport',
    'Bog_snorkelling',
    'Book_of_the_Dead',
    'Bowling_Green_massacre',
    'Brainwashing',
    'Brazen_bull',
    'Bright_spots_on_Ceres',
    'Briscola',
    'British_Rail_sandwich',
    'Cadaver_Synod',
    'Calcio_Fiorentino',
    'Cargo_cult',
    'Carnivorous_plant',
    'Cartography',
    'Case_White',
    'Catholic_Church',
    'Che_Guevara_in_popular_culture',
    'Chemtrail_conspiracy_theory',
    'Chess_boxing',
    'Chicken_or_the_egg',
    'Christmas_in_Nazi_Germany',
    'Committee_to_End_Pay_Toilets_in_America',
    'Conspiracy_theory',
    'Containerization',
    'Cornfield_Bomber',
    'Cow_tipping',
    'Curse_of_Billy_Penn',
    'Curse_of_the_Bambino',
    'Cycloped',
    'Cydonia_(region_of_Mars)',
    'Dagen_H',
    'Dancing_plague_of_1518',
    'Dark_Night_of_the_Soul',
    'Dazzle_camouflage',
    'Death_by_coconut',
    'Deep-fried_Mars_bar',
    'Delphi',
    'Democritus',
    'Demon_core',
    'Dervish',
    'Diving_horse',
    'Dogfight',
    'Dr._Young%27s_Ideal_Rectal_Dilators',
    'Dreamachine',
    'Dreamtime',
    'Drunkard%27s_cloak',
    'Dutch_Revolt',
    'Dwarf_planet',
    'Dyatlov_Pass_incident',
    'Early_flying_machines',
    'Economic_sanctions',
    'Egg_tapping',
    'Embryo_space_colonization',
    'Electroencephalophone',
    'Electronic_voice_phenomenon',
    'Emu_War',
    'Engrish',
    'Entheogenic_use_of_cannabis',
    'Existential_crisis',
    'Experiment_(horse-powered_boat)',
    'Extraterrestrial_life',
    'Facial_expression',
    'Faith_healing',
    'Fallen_Astronaut',
    'Faraday_cage',
    'Fart_Proudly',
    'Feng_shui',
    'Ferret-legging',
    'Fire_photography',
    'Five-second_rule',
    'Flying_ace',
    'Flying_Spaghetti_Monster',
    'Folklore',
    'Folly',
    'For_sale:_baby_shoes,_never_worn',
    'Ford_Model_T',
    'Fox_tossing',
    'Franz_Reichelt',
    'Fucking,_Austria',
    'Garden_hermit',
    'Geodesic_dome',
    'Geology',
    'George_P._Burdell',
    'Gerbilling',
    'Ghost_bike',
    'Godwin%27s_law',
    'Golden_Age',
    'Goose_pulling',
    'Grapefruit–drug_interactions',
    'Graffiti',
    'Great_Pyramid_of_Giza',
    'Great_Wall_of_China',
    'Guy_Fawkes_mask',
    'Haka',
    'Hell_money',
    'Henley-on-Todd_Regatta',
    'Hierarchy_of_the_Catholic_Church',
    'High five',
    'Hip_hop',
    'History_of_geography',
    'History_of_photography',
    'Hoist_with_his_own_petard',
    'Homosexual_behavior_in_animals',
    'Hoax',
    'Hotel_toilet_paper_folding',
    'Human_radiation_experiments',
    'Human_sacrifice',
    'Hyper_Text_Coffee_Pot_Control_Protocol',
    'Hypertrichosis',
    'Hypnosis',
    'Hypothesis',
    'If_a_tree_falls_in_a_forest',
    'Igloo',
    'Immunization',
    'Impressionism',
    'Inappropriateness',
    'Incident_at_Petrich',
    'Intentionally_blank_page',
    'International_Space_Station',
    'IP_over_Avian_Carriers',
    'Ithaa',
    'Jamaica_national_bobsleigh_team',
    'Jerusalem_syndrome',
    'Jesus_nut',
    'Jonathan_(tortoise)',
    'Kanamara_Matsuri',
    'Katharina_Paulus',
    'Kawaii',
    'Ketchup_as_a_vegetable',
    'Kindness',
    'Knitta_Please',
    'Kopi_Luwak',
    'Korean_axe_murder_incident',
    'Latin',
    'Lawn_mower_racing',
    'Legend',
    'Leonardo_da_Vinci',
    'Lesbian_vampire',
    'Ley_line',
    'Library_of_Alexandria',
    'Life',
    'Line-crossing_ceremony',
    'List_of_animals_displaying_homosexual_behavior',
    'Lithopedion',
    'Lloyds_Bank_coprolite',
    'Lolcat',
    'London_Beer_Flood',
    'Love_dart',
    'Love_lock',
    'LZ_129_Hindenburg',
    'Lunar_effect',
    'Machu_Picchu',
    'Mall_walking',
    'Mariko_Aoki_phenomenon',
    'Mars_rover',
    'Max_Headroom_broadcast_signal_intrusion',
    'Meaning_of_life',
    'Milky_Way',
    'Modern_flat_Earth_societies',
    'Modern_Toilet_Restaurant',
    'Monkey_selfie_copyright_dispute',
    'Monolith',
    'Moon',
    'Moon_landing_conspiracy_theories',
    'Mornington_Crescent_(game)',
    'Motion_blur',
    'Muhammad',
    'Nature_therapy',
    'Nazi_eugenics',
    'Neopalpa_donaldtrumpi',
    'Netflix_and_chill',
    'New_Age',
    'New_World',
    'Nikola_Tesla',
    'Nintendo_Entertainment_System',
    'Number_of_the_Beast',
    'Odd-eyed_cat',
    'Omphalos_hypothesis',
    'OpenCola_(drink)',
    'Operation_Nifty_Package',
    'Oracle',
    'Paintings_by_Adolf_Hitler',
    'Pale_Blue_Dot',
    'Palmistry',
    'Panda_pornography',
    'Panjandrum',
    'Papyrus',
    'Parachute',
    'Paris',
    'Paris_syndrome',
    'Pastry_War',
    'Peace_Village_(North_Korea)',
    'Penis_fencing',
    'Philadelphia_Experiment',
    'Physician',
    'Polybius_(urban_legend)',
    'Poole_versus_HAL_9000',
    'Prince_Philip_Movement',
    'Psychic_staring_effect',
    'Pieing',
    'Pillow_Fight_League',
    'Piracy',
    'Piri_Reis_map',
    'Prostitution',
    'Psychedelic_art',
    'PZL_M-15_Belphegor',
    'Pyongyang_(restaurant_chain)',
    'Qing_dynasty',
    'Quidditch_(sport)',
    'Rai_stones',
    'Rainbow_Gathering',
    'Rare_Earth_hypothesis',
    'Ravens_of_the_Tower_of_London',
    'Religion_and_sexuality',
    'Reply_of_the_Zaporozhian_Cossacks',
    'Revolution',
    'Robot_jockey',
    'Rod_(optics)',
    'Romance_(love)',
    'Rosenhan_experiment',
    'RP_FLIP',
    'Ruin_value',
    'Rule_of_three_(writing)',
    'Rajneeshpuram',
    'Republic_of_Venice',
    'Revolutionary_Catalonia',
    'Rosa_Parks',
    'Rothschild_family',
    'Russian_floating_nuclear_power_station',
    'Saint_Guinefort',
    'Scold%27s_bridle',
    'Shaken,_not_stirred',
    'Shipping_container_architecture',
    'Shoe_tossing',
    'Schizophrenia',
    'Schrödinger%27s_cat',
    'Schutzstaffel',
    'Schwerer_Gustav',
    'Science_and_inventions_of_Leonardo_da_Vinci',
    'Shamanism',
    'Shapeshifting',
    'Shinkansen',
    'Shitterton',
    'Skunk_Works',
    'Sky_burial',
    'Slum_tourism',
    'Smallest_House_in_Great_Britain',
    'Snail_racing',
    'Sniper',
    'South-pointing_chariot',
    'South-up_map_orientation',
    'Space_advertising',
    'Spirobranchus_giganteus',
    'Spite_house',
    'Spork',
    'Sufi_whirling',
    'Tabula_Rogeriana',
    'Taboo',
    'Tamworth_Two',
    'TempleOS',
    'Tentacle_erotica',
    'Tepui',
    'Tetris_effect',
    'The_Blue_Marble',
    'The_dog_ate_my_homework',
    'The_Great_Wave_off_Kanagawa',
    'The_School_of_Athens',
    'There_are_known_knowns',
    'Timothy_(tortoise)',
    'Tiny_Kox',
    'Toilets_in_Japan',
    'Traditional_Chinese_medicine',
    'Train_surfing',
    'Tree_That_Owns_Itself',
    'Transatlantic_telegraph_cable',
    'Trepanning',
    'Tropical_nations_at_the_Winter_Olympics',
    'Trust_(emotion)',
    'Tsar_Tank',
    'Tuskegee_syphilis_experiment',
    'Twenty_Thousand_Leagues_Under_the_Sea',
    'Ubud_Monkey_Forest',
    'United_States_Declaration_of_Independence',
    'United_States_military_chocolate',
    'Utah_teapot',
    'Utopia',
    'Vagina_dentata',
    'Vastu_shastra',
    'Vellum',
    'Vespa_150_TAP',
    'Virtual_reality',
    'Virtue',
    'Vitalism',
    'Voynich_manuscript',
    'Wabi-sabi',
    'War_of_Jenkins%27_Ear',
    'Water',
    'Why_did_the_chicken_cross_the_road%3F',
    'Witch_window',
    'Wojtek_(bear)',
    'World%27s_fair',
    'Women%27s_rights',
    'Wow!_signal',
    'Writing_in_space',
    'X-Seed_4000',
    'Yukigassen',
  ]

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
