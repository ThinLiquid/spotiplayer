

# <img src="https://i.imgur.com/XmrTgBt.png" width="25em">&nbsp;&nbsp;SpotiPlayer
A simple express project, that plays and controls your Spotify. See it in action [here](https://spotiplayer-v2.glitch.me)!

![Version][version-shield]
![License][license-shield]
![Dependencies][depend-shield]

## Table of Contents
  - [Requirements](#requirements)
  - [Getting Started](#getting-started)
  - [Contributing](#contributing)
  - [License](#license)

## Requirements
SpotiPlayer requires the following to run (properly)
  - [Node.js](https://nodejs.org) v10+
  - [npm](https://npm.org) (included with Node.js)

## Getting Started
Create a Spotify application

<img src="https://cdn.glitch.com/362ef2ab-55b7-48f2-a211-2949d088ad46%2FScreenshot%202021-06-17%20at%2020.55.37.png?v=1623959756069" width="50%">

Add your callback

<img src="https://cdn.glitch.com/362ef2ab-55b7-48f2-a211-2949d088ad46%2FScreenshot%202021-06-17%20at%2020.56.45.png?v=1623959829442" width="50%">

Add the data to `.env`
```dosini
client_id=[your-client-id]
client_secret=[your-client-secret]
redirect_uri=[your-redirect-uri]
port=8888
```

Run the following in your terminal to get started!<br>
```bash
npm i && node index.js
```

## Contributing
To contribute to SpotiPlayer, clone this repo locally and commit your code on a seperate branch.
```bash
git clone https://github.com/JuiciiYT/spotiplayer.git
```

## License
SpotiPlayer is licensed under the [Apache License 2.0](/LICENSE)

[version-shield]: https://img.shields.io/github/package-json/v/JuiciiYT/spotiplayer?style=for-the-badge
[license-shield]: https://img.shields.io/github/license/JuiciiYT/spotiplayer?style=for-the-badge
[depend-shield]: https://img.shields.io/librariesio/github/JuiciiYT/spotiplayer?style=for-the-badge
