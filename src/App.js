import React from 'react';
import ReactDOM from 'react-dom';
import SC from 'soundcloud';
import SCconfig from './SCconfig.js';

import Artwork from './components/Artwork';
import Login from './components/Login';
import Player from './components/Player';

let SCPlayer;

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      connected: false,
      playlist: [],
      currentSong: {},
      playingTime: 0,
      playing: false
    };
    this._connectHandler = this._connectHandler.bind(this);
    this._playerOnPlay = this._playerOnPlay.bind(this);
    this._playerOnPause = this._playerOnPause.bind(this);
    this._playerOnNext = this._playerOnNext.bind(this);
  }

  componentDidMount() {
    SC.initialize({
      client_id: SCconfig.clientId,
      redirect_uri: SCconfig.redirectURI,
      oauth_token: sessionStorage.getItem('token') || null
    });

    this._initializePlayer();
  }

  /*
   * Helpers
   */
  _initializePlayer() {
    if (SC.isConnected()) {
      SC.get('/me/favorites').then(function(tracks) {
        let currentSong = this._mapTrack(tracks.shift());

        this.setState({
          connected: true,
          playlist: tracks,
          currentSong: currentSong
        });

        this._loadCurrentSong();
      }.bind(this));
    }
  }

  _loadCurrentSong() {
    return SC.stream('/tracks/' + this.state.currentSong.id).then(function(player) {
      SCPlayer = player;

      SCPlayer.on('finish', function() {
        this.setState({
          playing: false
        });
      }.bind(this));

      SCPlayer.on('time', function() {
        this.setState({
          playingTime: SCPlayer.currentTime()
        });
      }.bind(this));

    }.bind(this));
  }

  _getNextTrack() {
    return this._mapTrack(this.state.playlist.shift());
  }

  _mapTrack(track) {
    let artwork = track.artwork_url ? track.artwork_url.replace('large.jpg', 't500x500.jpg') : '-';
    return {
      id: track.id,
      kind: track.kind,
      title: track.title,
      duration: track.duration,
      artwork_url: artwork,
      permalink_url: track.permalink_url,
      stream_url: track.stream_url,
      user_id: track.user.id || track.user_id,
      user_name: track.user.username,
      user_favorite: track.user_favorite
    };
  }


  /*
   * Handlers
   */
  _connectHandler(e) {
    e.preventDefault();

    SC.connect().then(function(data) {
      sessionStorage.setItem('token', data.oauth_token);
      this._initializePlayer();
    }.bind(this));
  }

  _playerOnPlay(e) {
    e.preventDefault();

    if (SCPlayer) {
      SCPlayer.play();

      this.setState({
        playing: true
      });
    }
  }

  _playerOnPause(e) {
    e.preventDefault();

    if (SCPlayer) {
      SCPlayer.pause();
    }

    this.setState({
      playing: false
    });
  }

  _playerOnNext(e) {
    e.preventDefault();

    if (this.state.playlist.length > 0) {
      if (SCPlayer && this.state.playing) {
        SCPlayer.pause();
      }

      let currentSong = this._mapTrack(this.state.playlist.shift());
      this.setState({
        currentSong: currentSong
      }, function() {
        this._loadCurrentSong().then(function() {
          this.setState({
            playingTime: 0,
            playing: true
          });

          SCPlayer.play();
        }.bind(this));
      }.bind(this));
    }
  }

  /*
   * Render
   */
  render() {
    let componentToRender = <Login onConnect={this._connectHandler} />;

    if (this.state.connected) {
      componentToRender = <Player
        onPlay={this._playerOnPlay}
        onPause={this._playerOnPause}
        onNext={this._playerOnNext}
        playing={this.state.playing}
        currentSong={this.state.currentSong}
        playingTime={this.state.playingTime}
      />;
    }

    return (
      <div className="appContainer">
        <Artwork img={this.state.currentSong.artwork_url}></Artwork>
        {componentToRender}
      </div>
    );
  }
};

ReactDOM.render(<App />, document.getElementById('root'));
