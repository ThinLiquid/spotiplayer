/*
------------------------------------------------
ERROR HANDLING
------------------------------------------------
*/

const start = document.querySelector(".start");
const end = document.querySelector(".end");
const progressBar = document.querySelector(".progress-bar");
const now = document.querySelector(".now");

setInterval(function() {
  fetch("https://api.spotify.com/v1/me/player/currently-playing?market=GB", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getParameterByName("access_token"),
      "Retry-After": 0
    }
  })
    .then(response => {
      window.wait = response.status;
      if (window.wait == 401) {
        fetch("https://api.spotify.com/v1/swap", { method: "POST", headers: { Authorization: getParameterByName() }, body: { access_token: getParameterByName(), expires_in: 3600, refresh_token: getParamsByName()}})
          .then(res => { if (res.status == 401) {
            window.location.href = `/?error=true&status=Access Token expired&code=${window.wait}`;
          }})
      }
      return response.json();
    })
    .catch(function(error) {
      if (!window.wait == 204) {
        window.location.href = `/?error=true&status=${error}&code=${window.wait}&ln=${error.lineNumber}`;
      }
    });
}, 1000);

if (getParameterByName("access_token") == null) {
  window.loaction.href = `/?error=true&status=Invalid Access Token&code=401`;
}

/*
------------------------------------------------
DETECT ICON
------------------------------------------------
*/

/*
------------------------------------------------
PLAYER
------------------------------------------------
*/

setInterval(function() {
  fetch("https://api.spotify.com/v1/me/player/currently-playing?market=GB", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getParameterByName("access_token")
    }
  })
    .then(response => response.json())
    .then(data => {
      try {
        fetch("https://api.spotify.com/v1/me/player", {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getParameterByName("access_token"),
            "Retry-After": 0
          }
        })
          .then(response => response.json())
          .then(data2 => {
            document.querySelector(".device-name").innerText = data2.device.name;
          });
        if (data.currently_playing_type === "ad") {
          document.querySelector(".song-name").innerText = "Advertisment";
          toDataUrl(
            "https://friconix.com/png/fi-snsuxl-question-mark.png",
            function(data) {
              document.querySelector(".album").setAttribute("src", data);
            }
          );
          document.querySelector(".song-artists").innerHTML = "";
          $(".progresser").text("0:00");
          

          if (data.is_playing != true) {
            $(".pause").text("play_arrow");
            document.querySelector(".pause").setAttribute("onclick", "play()");
          } else {
            $(".pause").text("pause");
            document.querySelector(".pause").setAttribute("onclick", "pause()");
          }
        } else {
          var rgb = getAverageRGB(document.querySelector(".album"));
            for (i = 0; i < document.querySelectorAll(".primary").length; i++) {
              document
                .querySelectorAll(".primary")
                [i].setAttribute(
                  "style",
                  "background:rgb(" +
                    rgb.r +
                    "," +
                    rgb.g +
                    "," +
                    rgb.b +
                    ")!important"
                );
            }
              for (i = 0; i < document.querySelectorAll("*").length; i++) {
                document
                  .querySelectorAll("*")
                  [i].style.setProperty(
                    "--lightgreen",
                    pSBC(0.3, "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")")
                  );
                document
                  .querySelectorAll("*")
                  [i].style.setProperty(
                    "--darkgreen",
                    "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")"
                  );
              }
          toDataUrl(data.item.album.images[0].url, function(data2) {
            document.body.setAttribute(
              "style",
              `background:url(${data2}) no-repeat center center fixed; background-size: cover;`
            );
            document.querySelector(".album").setAttribute("src", data2);
          });
          document.querySelector(".song-name").innerText = data.item.name;

          if (data.item.artists.length == 1) {
            fetch(
              "https://api.spotify.com/v1/artists/" +
                data.item.artists[data.item.artists.length - 1].id,
              {
                method: "get",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + getParameterByName("access_token")
                }
              }
            )
              .then(response => response.json())
              .then(data2 => {
                $(".artists-name").html(
                  `${data.item.artists[data.item.artists.length - 1].name}`
                );
                document.title = `Now Playing: ${data.item.name} by ${data.item.artists[0].name} | SpotiPlayer`;
              });
          } else {
            for (i = 0; i < data.item.artists.length; i++) {
              var all = all + ", " + data.item.artists[i].name;
              $(".artists-name").html(all.replace("undefined,", ""));
              document.title = `Now Playing: ${data.item.name} by ${all.replace(
                "undefined,",
                ""
              )} | SpotiPlayer`;
            }
          }

          $(".progresser").text(millis(data.progress_ms));
          $(".progresser-alt").text(millis(data.item.duration_ms));

          //alert(data.progress_ms / data.item.duration_ms.toFixed(3) * 100)

          document.querySelector(".now").style.width =
            (data.progress_ms / data.item.duration_ms.toFixed(3)) * 100 + "%";

          progressBar.addEventListener("click", function(event) {
            let coordStart = this.getBoundingClientRect().left;
            let coordEnd = event.pageX;
            let p = (coordEnd - coordStart) / this.offsetWidth;
            now.style.width = p.toFixed(3) * 100 + "%";

            fetch(
              "https://api.spotify.com/v1/me/player/seek?position_ms=" +
                p * data.progress_ms,
              { headers: { Authorization: getParameterByName("access_token") } }
            );
          });

          if (data.is_playing != true) {
            $(".icons").text("play_arrow");
            document.querySelector(".icons").setAttribute("onclick", "play()");
          } else {
            $(".icons").text("pause");
            document.querySelector(".icons").setAttribute("onclick", "pause()");
          }
        }
      } catch (e) {}
    });
}, 1000);

/*
------------------------------------------------
CONTROLS
------------------------------------------------
*/

function play() {
  fetch("https://api.spotify.com/v1/me/player/play", {
    method: "put",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getParameterByName("access_token")
    }
  });
}

function pause() {
  fetch("https://api.spotify.com/v1/me/player/pause", {
    method: "put",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getParameterByName("access_token")
    }
  });
}

function next() {
  fetch("https://api.spotify.com/v1/me/player/next", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getParameterByName("access_token")
    }
  });
}

function prev() {
  fetch("https://api.spotify.com/v1/me/player/previous", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getParameterByName("access_token")
    }
  });
}

/*
------------------------------------------------
MISC
------------------------------------------------
*/

function getParameterByName() {
  return window.localStorage.getItem("access_token")
}

function getParamsByName() {
  return window.localStorage.getItem("refresh_token")
}

function millis(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

/*
------------------------------------------------
PLAY IN BROWSER
------------------------------------------------
*/

window.onSpotifyWebPlaybackSDKReady = () => {
  const token = getParameterByName("access_token");
  const player = new Spotify.Player({
    name: "SpotiPlayer",
    getOAuthToken: cb => {
      cb(token);
    }
  });

  player.addListener("initialization_error", ({ message }) => {
    console.error("[ERROR] " + message);
  });
  player.addListener("authentication_error", ({ message }) => {
    console.error("[ERROR] " + message);
  });
  player.addListener("account_error", ({ message }) => {
    console.error("[ERROR] " + message);
  });
  player.addListener("playback_error", ({ message }) => {
    console.error("[ERROR] " + message);
  });

  player.addListener("player_state_changed", state => {
    console.log(state);
  });

  player.addListener("ready", ({ device_id }) => {
    console.log("Ready with Device ID", device_id);
  });

  player.addListener("not_ready", ({ device_id }) => {
    console.log("Device ID has gone offline", device_id);
  });

  player.connect();
};

/*
------------------------------------------------
MATCH
------------------------------------------------
*/

function lcm(a, b) {
  var max = Math.max(a, b),
    min = Math.min(a, b);
  if (Math.abs(max + min) <= Math.abs(max)) {
    return 0;
  }
  var abs_min = Math.abs(a) < Math.abs(b) ? a : b;
  var ret = abs_min;
  while (1) {
    ret += abs_min;
    if (!(ret % a || ret % b)) {
      return ret;
    }
  }
}

/*
------------------------------------------------
IDK
------------------------------------------------
*/

function toDataUrl(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.open("GET", url);
  xhr.responseType = "blob";
  xhr.send();
}

function getAverageRGB(imgEl) {
  var blockSize = 5, // only visit every 5 pixels
    defaultRGB = { r: 0, g: 0, b: 0 }, // for non-supporting envs
    canvas = document.createElement("canvas"),
    context = canvas.getContext && canvas.getContext("2d"),
    data,
    width,
    height,
    i = -4,
    length,
    rgb = { r: 0, g: 0, b: 0 },
    count = 0;

  if (!context) {
    return defaultRGB;
  }

  height = canvas.height =
    imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
  width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

  context.drawImage(imgEl, 0, 0);

  try {
    data = context.getImageData(0, 0, width, height);
  } catch (e) {
    return defaultRGB;
  }

  length = data.data.length;

  while ((i += blockSize * 4) < length) {
    ++count;
    rgb.r += data.data[i];
    rgb.g += data.data[i + 1];
    rgb.b += data.data[i + 2];
  }

  // ~~ used to floor values
  rgb.r = ~~(rgb.r / count);
  rgb.g = ~~(rgb.g / count);
  rgb.b = ~~(rgb.b / count);

  return rgb;
}

const pSBC = (p, c0, c1, l) => {
  let r,
    g,
    b,
    P,
    f,
    t,
    h,
    i = parseInt,
    m = Math.round,
    a = typeof c1 == "string";
  if (
    typeof p != "number" ||
    p < -1 ||
    p > 1 ||
    typeof c0 != "string" ||
    (c0[0] != "r" && c0[0] != "#") ||
    (c1 && !a)
  )
    return null;
  if (!this.pSBCr)
    this.pSBCr = d => {
      let n = d.length,
        x = {};
      if (n > 9) {
        ([r, g, b, a] = d = d.split(",")), (n = d.length);
        if (n < 3 || n > 4) return null;
        (x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4))),
          (x.g = i(g)),
          (x.b = i(b)),
          (x.a = a ? parseFloat(a) : -1);
      } else {
        if (n == 8 || n == 6 || n < 4) return null;
        if (n < 6)
          d =
            "#" +
            d[1] +
            d[1] +
            d[2] +
            d[2] +
            d[3] +
            d[3] +
            (n > 4 ? d[4] + d[4] : "");
        d = i(d.slice(1), 16);
        if (n == 9 || n == 5)
          (x.r = (d >> 24) & 255),
            (x.g = (d >> 16) & 255),
            (x.b = (d >> 8) & 255),
            (x.a = m((d & 255) / 0.255) / 1000);
        else
          (x.r = d >> 16), (x.g = (d >> 8) & 255), (x.b = d & 255), (x.a = -1);
      }
      return x;
    };
  (h = c0.length > 9),
    (h = a ? (c1.length > 9 ? true : c1 == "c" ? !h : false) : h),
    (f = pSBCr(c0)),
    (P = p < 0),
    (t =
      c1 && c1 != "c"
        ? pSBCr(c1)
        : P
        ? { r: 0, g: 0, b: 0, a: -1 }
        : { r: 255, g: 255, b: 255, a: -1 }),
    (p = P ? p * -1 : p),
    (P = 1 - p);
  if (!f || !t) return null;
  if (l)
    (r = m(P * f.r + p * t.r)),
      (g = m(P * f.g + p * t.g)),
      (b = m(P * f.b + p * t.b));
  else
    (r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5)),
      (g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5)),
      (b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5));
  (a = f.a),
    (t = t.a),
    (f = a >= 0 || t >= 0),
    (a = f ? (a < 0 ? t : t < 0 ? a : a * P + t * p) : 0);
  if (h)
    return (
      "rgb" +
      (f ? "a(" : "(") +
      r +
      "," +
      g +
      "," +
      b +
      (f ? "," + m(a * 1000) / 1000 : "") +
      ")"
    );
  else
    return (
      "#" +
      (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0))
        .toString(16)
        .slice(1, f ? undefined : -2)
    );
};