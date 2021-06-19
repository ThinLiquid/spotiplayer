fetch('https://api.spotify.com/v1/me/player/currently-playing?market=GB',{ method: 'get', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getParameterByName('access_token'), 'Retry-After': 0 }})
    .then(response => {
      window.wait=response.status
      return response.json()
    })
    .catch(function(error) {
        window.location.href = `/?error=true&status=${error}&code=${window.wait}`
    });

function search() {
  $('results').html("")
  var searchfor = document.querySelector('input').value
  //try {
    fetch('https://api.spotify.com/v1/search?q=' + searchfor + '&type=track&market=GB&limit=10',{ method: 'get', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getParameterByName('access_token') }})
      .then(response => response.json())
      .then(data => {
        for(i=0;i<data.tracks.items.length - 1;i++) {
          var all = data.tracks.items[i].name
          for(a=0;a<data.tracks.items[i].artists.length;a++) {
            if (data.tracks.items[i].artists.length == 1) {
              window.all = data.tracks.items[i].artists[a].name
            } else {
              window.all = window.all + ', ' + data.tracks.items[i].artists[a].name
              if(window.all.includes(' , ') == true) {
                window.all = window.all.replace(' , ', '')
                alert('changes')
              }
            }
          }
          $('results').append(`<div class="card"><a><div class="card-content"><h5>${all}</h5><br><p class="by">by: ${window.all}</p></div></a></div><br>`)
          window.all ="";
        }
      })
 // } catch (e) {
    
 // }
}

setInterval(function(){
  fetch('https://api.spotify.com/v1/me/player/currently-playing?market=GB',{ method: 'get', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getParameterByName('access_token') }})
    .then(response => response.json())
    .then(data => {
      try {
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
                document.title = `Now Playing: ${data.item.name} by ${data.item.artists[data.item.artists.length - 1].name} | SpotiPlayer`
              })
          } else {
            
            for (i = 0;i < data.item.artists.length;i++) {
              $('.album').one('DOMSubtreeModified', function(){
                document.querySelectorAll('span')[4].innerHTML = "";
                document.querySelectorAll('span')[4].setAttribute('class', 'artists-name')
              });
              $('.song-name').one('DOMSubtreeModified', function(){
                document.querySelectorAll('span')[4].innerHTML = "";
                document.querySelectorAll('span')[4].setAttribute('class', 'artists-name')
              });
              $('.artists-name').append(`<div class="chip">${data.item.artists[i].name}</div>&nbsp;`)
              var all = all + ', ' + data.item.artists[i].name
              document.title = `Now Playing: ${data.item.name} by ${all.replace('undefined,', '')} | SpotiPlayer`
              if (i == data.item.artists.length - 1) {
                try {
                  document.querySelector('.artists-name').setAttribute('class', '')
                } catch (e) {
                  
                }
              }
            }
          } 
          
          document.querySelector('.progress').setAttribute('style', `width:${millis2(data.progress_ms) * millis2(data.item.duration_ms) / 3000}%;`)
          $('.progresser').text(millisToMinutesAndSeconds(data.progress_ms))
          $('.progresser-alt').text(millisToMinutesAndSeconds(data.item.duration_ms))

          if(data.is_playing != true) {
            $('.icons').text('play_arrow')
            document.querySelector('.icons').setAttribute('onclick', 'play()')
          } else {
            $('.icons').text('pause')
            document.querySelector('.icons').setAttribute('onclick', 'pause()')
          }
        }
      } catch (e) {
      
    }
    });
}, 1000);

function play() {
  fetch('https://api.spotify.com/v1/me/player/play', {method: 'put', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getParameterByName('access_token') }})
}

function pause() {
  fetch('https://api.spotify.com/v1/me/player/pause', {method: 'put', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getParameterByName('access_token') }})
}

function next() {
  fetch('https://api.spotify.com/v1/me/player/next', {method: 'post', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getParameterByName('access_token') }})
}

function prev() {
  fetch('https://api.spotify.com/v1/me/player/previous', {method: 'post', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getParameterByName('access_token') }})
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

function millis2(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + "" + (seconds < 10 ? '0' : '') + seconds;
}

function millis3(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + "." + (seconds < 10 ? '0' : '') + seconds;
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

  player.addListener('initialization_error', ({ message }) => { console.error("[ERROR] " + message); });
  player.addListener('authentication_error', ({ message }) => { console.error("[ERROR] " + message); });
  player.addListener('account_error', ({ message }) => { console.error("[ERROR] " + message); });
  player.addListener('playback_error', ({ message }) => { console.error("[ERROR] " + message); });

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