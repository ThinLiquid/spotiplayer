fetch('https://api.spotify.com/v1/me/player/currently-playing?market=GB',{ method: 'get', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getParameterByName('access_token'), 'Retry-After': 0 }})
    .then(response => {
      window.wait=response.status
      return response.json()
    })
    .catch(function(error) {
        if (window.wait == 401) {
          window.loaction.href= `/?error=true&status=Access Token expired&code=${window.wait}`
        }
        window.location.href = `/?error=true&status=${error}&code=${window.wait}`
    });

if (getParameterByName('access_token') == null) {
  window.loaction.href= `/?error=true&status=Invalid Access Token&code=401`
}

function search() {
  $('results').html("")
  var searchfor = document.querySelector('input').value
  try {
    fetch('https://api.spotify.com/v1/search?q=' + searchfor + '&type=track&market=GB&limit=50',{ method: 'get', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getParameterByName('access_token') }})
      .then(response => response.json())
      .then(data => {
        for(i=0;i<data.tracks.items.length - 1;i++) {
          var all = data.tracks.items[i].name
          var all2 = data.tracks.items[i].id
          var all3 = data.tracks.items[i].album.images[0].url
          var duration = millis(data.tracks.items[i].duration_ms)
          var all4 = data.tracks.items[i].preview_url
          for(a=0;a<data.tracks.items[i].artists.length;a++) {
            if (data.tracks.items[i].artists.length == 1) {
              window.all = data.tracks.items[i].artists[a].name
            } else {
              window.all = ' ' + window.all + ' • ' + data.tracks.items[i].artists[a].name
              if(window.all.includes('  ') == true) {
                window.all = window.all.replace('  • ', '')
              }
            }
          }
          $('.card').tilt({axis: 'y', scale: 1.2})
          $('results').append(`<hehe><div class="card"><a style="color:white;" onclick="plays('${all2}')"><div class="card-content row"><div class="col s9"><h5>${all}</h5><br><p class="by">by: ${window.all}</p>${duration}<br>Preview:<br><audio controls><source src="${all4}"></audio></div><div class="col s3"><img src="${all3}" width="100%"></div></a></div></hehe>`)
          $('.card').tilt({axis: 'y', scale: 1.2})
          window.all ="";
        }
      })
    $('.card').tilt({axis: 'y', scale: 1.2})
   } catch (e) {
    
   }
}

setInterval(function(){
  $('.card').tilt({axis: 'y', scale: 1.2})
  fetch('https://api.spotify.com/v1/me/player/currently-playing?market=GB',{ method: 'get', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getParameterByName('access_token') }})
    .then(response => response.json())
    .then(data => {
      try {
            fetch('https://api.spotify.com/v1/me/player',{ method: 'get', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getParameterByName('access_token'), 'Retry-After': 0 }})
          .then(response => response.json())
          .then(data2 => {
            document.querySelector("#device").innerText = data2.device.name
            if (data2.device.type == "Tablet") {
              document.querySelector(".devicer").innerHTML = "tablet"
            } 
            
            if (data2.device.type == "Computer") {
              document.querySelector(".material-icons.devicer").innerHTML = "computer"
            }
      
            if (data2.device.type == "SpotiPlayer") {
              document.querySelector("#spotiplayer").innerHTML = `<img src="https://i.imgur.com/XmrTgBt.png" width="20em">`
            }
          })
        if (data.currently_playing_type === "ad") {
          document.querySelector('.song-name').innerText = "Advertisment"
          document.querySelector('.progress').setAttribute('style', `width:${millis2(data.progress_ms) * millis2(data.item.duration_ms) / 3000}%;`)
          document.querySelector('img.album').setAttribute('src', 'https://friconix.com/png/fi-snsuxl-question-mark.png')
          document.querySelector('.song-artists').innerHTML = "";
          $('.progresser').text(millis(data.progress_ms))
          

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
          $('.progresser').text(millis(data.progress_ms))
          $('.progresser-alt').text(millis(data.item.duration_ms))

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

function millis(millis) {
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

function plays(id) {
  alertify.alert('This feature is comming soon...<br>Song ID: ' + id)
  document.querySelector('.ajs-header').innerText = "SpotiPlayer Alert";
  document.querySelector('.ajs-ok').setAttribute('class', document.querySelector('.ajs-ok').getAttribute('class') + ' waves-effect waves-dark')
}

function enter() {
    search()
}

document.addEventListener('keyup', function(e) {
  if (e.code == "Escape") {
    document.querySelector('#overlay').style.display = "none";
  }
});