fetch('https://api.spotify.com/v1/me/player/currently-playing?market=GB',{ method: 'get', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getParameterByName('access_token'), 'Retry-After': 0 }})
    .then(response => {
      window.wait=response.status
      return response.json()
    })
    .catch(function(error) {
        //window.location.href = `/?error=true&status=${error}&code=${window.wait}`
    });
setInterval(function(){
  fetch('https://api.spotify.com/v1/me/player/currently-playing?market=GB',{ method: 'get', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getParameterByName('access_token') }})
    .then(response => response.json())
    .then(data => {
        if (data.currently_playing_type === "ad") {
          document.querySelector('.song-name').innerText = "Advertisment"
          document.querySelector('.determinate.green').setAttribute('style', `width:${parseInt(data.progress_ms)/1500}%;`)
          $('.progresser').text(millisToMinutesAndSeconds(data.progress_ms))

          if(data.is_playing != true) {
            $('.icons').text('play_arrow')
            document.querySelector('.icons').setAttribute('onclick', 'play()')
          } else {
            $('.icons').text('pause')
            document.querySelector('.icons').setAttribute('onclick', 'pause()')
          }
        } else {
          document.querySelector('.album').setAttribute('src', data.item.album.images[0].url)
          document.querySelector('.song-name').innerText = data.item.name
          
          if (data.item.artists.length == 1) {
            fetch('https://api.spotify.com/v1/artists/' + data.item.artists[data.item.artists.length - 1].id, { method: 'get', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getParameterByName('access_token') }})
              .then(response => response.json())
              .then(data2 => {
                $('.artists-name').html(`<div class="chip"><img src="${data2.images[0].url}">${data.item.artists[data.item.artists.length - 1].name}</div>`)
              })
          } else {
            for (i = 0;i < data.item.artists.length;i++) {
              fetch('https://api.spotify.com/v1/artists/' + data.item.artists[data.item.artists.length - 1].id, { method: 'get', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getParameterByName('access_token') }})
                .then(response => response.json())
                .then(data2 => {
                $('.album').one('DOMSubtreeModified', function(){
                document.querySelectorAll('span')[3].innerHTML = "";
                document.querySelectorAll('span')[3].setAttribute('class', 'artists-name')
              });
              $('.song-name').one('DOMSubtreeModified', function(){
                document.querySelectorAll('span')[3].innerHTML = "";
                document.querySelectorAll('span')[3].setAttribute('class', 'artists-name')
              });
                  $('.artists-name').append(`<div class="chip"><img src="${data2.images[i].url}">${data.item.artists[i].name}</div>`)
                  if (i == data.item.artists.length - 1) {
                    try {
                      document.querySelector('.artists-name').setAttribute('class', '')
                    } catch (e) {
                  
                    }
                  }
                })
            }
          } 

          document.querySelector('.determinate.green').setAttribute('style', `width:${data.progress_ms / 500}px;`)
          document.querySelector('.progress').setAttribute('style', `width:${data.item.duration_ms / 500}px;`)
          $('.progresser').text(millisToMinutesAndSeconds(data.progress_ms))

          if(data.is_playing != true) {
            $('.icons').text('play_arrow')
            document.querySelector('.icons').setAttribute('onclick', 'play()')
          } else {
            $('.icons').text('pause')
            document.querySelector('.icons').setAttribute('onclick', 'pause()')
          }
        }
    });
}, 1000);

function play() {
  fetch('https://api.spotify.com/v1/me/player/play', {method: 'put', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getParameterByName('access_token') }})
}

function pause() {
  fetch('https://api.spotify.com/v1/me/player/pause', {method: 'put', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getParameterByName('access_token') }})
}

function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'), results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

$('.album').tilt({
  glare: true,
  maxGlare: .5,
  minGlare:.5
})

  window.onSpotifyWebPlaybackSDKReady = () => {
  const token = getParameterByName('access_token');
  const player = new Spotify.Player({
    name: 'SpotiPlayer',
    getOAuthToken: cb => { cb(token); }
  });

  player.addListener('initialization_error', ({ message }) => { console.error(message); });
  player.addListener('authentication_error', ({ message }) => { console.error(message); });
  player.addListener('account_error', ({ message }) => { console.error(message); });
  player.addListener('playback_error', ({ message }) => { console.error(message); });

  player.addListener('player_state_changed', state => { console.log(state); });

  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
  });

  player.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id);
  });


  player.connect();
};

function lcm(a,b) {
    var max = Math.max(a,b),
        min = Math.min(a,b);
    if(Math.abs(max + min) <= Math.abs(max)) { 
        return 0;
    }
    var abs_min = (Math.abs(a) < Math.abs(b)) ? a : b;
    var ret = abs_min;
    while(1) {
        ret += abs_min; 
        if(!(ret % a || ret % b)) {
            return ret;
        }
    }
}

const onChangeElement = (qSelector, cb)=>{
 const targetNode = document.querySelector(qSelector);
 if(targetNode){
    const config = { attributes: true, childList: false, subtree: false };
    const callback = function(mutationsList, observer) {
        cb($(qSelector))
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
 }else {
    console.error("onChangeElement: Invalid Selector")
 }
}