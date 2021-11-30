function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
  results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

if (navigator.userAgent.includes('Chrome') == false) {
  $('chrome').text("Chrome is recommended.")
}

(function() {

  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  var params = getHashParams();

  var access_token = params.access_token,
      refresh_token = params.refresh_token,
      error = params.error;

  if (error) {
    alert('There was an error during the authentication');
  } else {
    if (access_token) {

      window.location.href='/player?access_token='+access_token
    } else {
        // render initial screen
        $('#login').show();
        $('#loggedin').hide();
    }
  }
})();

if(getParameterByName('error') == "true") {
    setTimeout(function(){
      alertify.alert('There was an error. Try again later.<br><code>' + getParameterByName('status') + " [Error Code: " + getParameterByName('code') + "]</code><br>")
      document.querySelector('.ajs-header').innerText = "SpotiPlayer Alert";
      if (getParameterByName('status') == "SyntaxError: Unexpected token T in JSON at position 0") {
        $('.ajs-content').append("<br>Process may take up to 24hrs to resolve.")
      }
      document.querySelector('.ajs-ok').setAttribute('class', document.querySelector('.ajs-ok').getAttribute('class') + ' waves-effect waves-dark')
    }, 600)
}
