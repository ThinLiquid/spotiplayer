fetch('https://api.spotify.com/v1/me/player/currently-playing?market=GB',{ method: 'get', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getParameterByName('access_token') }})
    .then(response => response.json())
    .catch(function(error) {
        window.location.href = `/?error=true&status=${error}`
    });
setInterval(function(){
  fetch('https://api.spotify.com/v1/me/player/currently-playing?market=GB',{ method: 'get', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getParameterByName('access_token') }})
    .then(response => response.json())
    .then(data => {
            if (data.error.status != undefined) {
              window.location.href="/?code=" + data.error.status + "&error" + data.error.message
            }

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
          for (i = 0;i < data.item.artists.length - 1;i++) {
            $('.song-artists').text(data.item.artists[i].name + ', ')
          }

          if (data.item.artists.length - 1 == 0) {
            $('.song-artists').text(data.item.artists[data.item.artists.length - 1].name)
          }

          if (data.item.artists.length - 1 != 0) {
            $('.song-artists').append(data.item.artists[data.item.artists.length - 1].name)
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
}, 100);

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

//https://three-cloudy-allium.glitch.me/player?access_token=BQD99LkOAAwFjYGwzcROWtleS-RN54iZHU-a1gwibdvs2a5gRPYCFUS-wewRgrr1OLUW7k4rpN6efxcgw05OOZamsucLac4Ylat4gqT8QQICqB3WaBnknXsYVCXmkNXqA7B4ncn3zytaFH_4N40PygJ32GMInoUmEV-g8wQHyM5YdmxVogFNgTBXhqMemT2m6nj-LQk7iT0-1i4joHQPpRt5I6kMK2k6GZzXaPgAa3SuXitVFs712eb1n9R0DxEjVxWbpqsrQTQINJoAtT552KmM4ZHflcwxwOytm6Ua

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