setInterval(function(){
fetch('https://api.spotify.com/v1/me/player/currently-playing?market=GB',{ method: 'get', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getParameterByName('access_token'), 'Retry-After': 0 }})
    .then(response => {
      window.wait=response.status
  if (window.wait == 401) {
          window.location.href= `/?error=true&status=Access Token expired&code=${window.wait}`
        }
      return response.json()
    })
    .catch(function(error) {
        window.location.href = `/?error=true&status=${error}&code=${window.wait}`
    });
}, 1000)

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
          $('.card').tilt({disableAxis: 'y', scale: 1.2})
          $('results').append(`<hehe><div class="card"><a style="color:white;" onclick="plays('${all2}')"><div class="card-content row"><div class="col s9"><h5>${all}</h5><br><p class="by">by: ${window.all}</p>${duration}<br><br><br><audio controls><source src="${all4}"></audio></div><div class="col s3"><img src="${all3}" width="100%"></div></a></div></hehe>`)
          $('.card').tilt({disableAxis: 'y', scale: 1.2})
          window.all ="";
          $('.card').tilt({disableAxis: 'y', scale: 1.2})
          $('.card').tilt({disableAxis: 'y', scale: 1.2})
        }
      })
    $('.card').tilt({scale: 1.2})
   } catch (e) {
    
   }
}

setInterval(function(){
  $('.card').tilt({disableAxis: 'y', scale: 1.2})
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
            } else if (data2.device.type == "Computer") {
              document.querySelector(".material-icons.devicer").innerHTML = "computer"
            } else if (data2.device.type == "SpotiPlayer") {
              document.querySelector("#spotiplayer").innerHTML = `<img src="https://i.imgur.com/XmrTgBt.png" width="20em">`
            } else if (data2.device.type == "TV") {
              document.querySelector(".material-icons.devicer").innerHTML = "tv"
            } else if (data2.device.type == "Phone") {
              document.querySelector(".material-icons.devicer").innerHTML = "phone"
            }
          })
        if (data.currently_playing_type === "ad") {
          document.querySelector('.song-name').innerText = "Advertisment"
          toDataUrl('https://friconix.com/png/fi-snsuxl-question-mark.png', function(data) {
            document.querySelector('.album').setAttribute('src', data)
          })
          document.querySelector('.song-artists').innerHTML = "";
          $('.progresser').text("0:00")
          

          if(data.is_playing != true) {
            $('.icons').text('play_arrow')
            document.querySelector('.icons').setAttribute('onclick', 'play()')
          } else {
            $('.icons').text('pause')
            document.querySelector('.icons').setAttribute('onclick', 'pause()')
          }
        } else {
          toDataUrl(data.item.album.images[0].url, function(data2) {
            document.body.setAttribute("style", `background:url(${data2})`)
            document.querySelector('.album').setAttribute('src', data2)
          })
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

function searcher() {
  if (document.querySelector('#overlay').style.display == 'block') {
    document.querySelector('#overlay').style.display = 'none'
  } else {
    document.querySelector('#overlay').style.display = 'block'
  }
}

setInterval(function() {
  $('.card').tilt({disableAxis: 'y', scale: 1.2})
}, 10)

setInterval(function() {
  var rgb = getAverageRGB(document.querySelector('.album'));
  document.querySelector('.card').style.setProperty("--lightgreen", pSBC(0.3, 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')'));
  document.querySelector('.card').style.setProperty("--darkgreen", 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')');
  for(i=0;i<document.querySelectorAll('.primary').length;i++) {
    document.querySelectorAll('.primary')[i].setAttribute('style', 'background:rgb('+rgb.r+','+rgb.g+','+rgb.b+')!important')
  }
  for(i=0;i<document.querySelectorAll('.card').length;i++) {
    document.querySelectorAll('.card')[i].style.setProperty("--lightgreen", pSBC(0.3, 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')'));
    document.querySelectorAll('.card')[i].style.setProperty("--darkgreen", 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')');
  }
})

function toDataUrl(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}

function getAverageRGB(imgEl) {
    
    var blockSize = 5, // only visit every 5 pixels
        defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
        count = 0;
        
    if (!context) {
        return defaultRGB;
    }
    
    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
    
    context.drawImage(imgEl, 0, 0);
    
    try {
        data = context.getImageData(0, 0, width, height);
    } catch(e) {
        return defaultRGB;
    }
    
    length = data.data.length;
    
    while ( (i += blockSize * 4) < length ) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
    }
    
    // ~~ used to floor values
    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);
    
    return rgb;
    
}

const pSBC=(p,c0,c1,l)=>{
	let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
	if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
	if(!this.pSBCr)this.pSBCr=(d)=>{
		let n=d.length,x={};
		if(n>9){
			[r,g,b,a]=d=d.split(","),n=d.length;
			if(n<3||n>4)return null;
			x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
		}else{
			if(n==8||n==6||n<4)return null;
			if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
			d=i(d.slice(1),16);
			if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
			else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
		}return x};
	h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=pSBCr(c0),P=p<0,t=c1&&c1!="c"?pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
	if(!f||!t)return null;
	if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
	else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
	a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
	if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
	else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)

}