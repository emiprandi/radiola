import React from 'react';
import styles from './_player.css';
import imgFavourite from '../img/player-favourite.png';
import imgNotFavourite from '../img/player-not-favourite.png';
import imgPlay from '../img/player-play.png';
import imgPause from '../img/player-pause.png';
import imgNext from '../img/player-next.png';

const Player = (props) => {

  const _mapDuration = (ms) => {
    let minutes = Math.floor(ms / 60000);
    let seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  };

  let mainControl = <img className={styles.mainControl} src={imgPlay} onClick={props.onPlay} />;
  if (props.playing) {
    mainControl = <img className={styles.mainControl} src={imgPause} onClick={props.onPause} />
  }

  let progress = props.playingTime * 100 / props.currentSong.duration;

  return (
    <div className={styles.container}>
      <div className={styles.artist}>{props.currentSong.user_name}</div>
      <div className={styles.song}>
        <img className={styles.heart} src={imgFavourite} />
        <span className={styles.label}>{props.currentSong.title}</span>
      </div>
      <div className={styles.progressBar}>
        <span className={styles.currentTimeBar} style={{ width: progress + '%' }}></span>
      </div>
      <div className={styles.times}>
        <span className={styles.currentTimeNum}>{_mapDuration(props.playingTime)}</span>
        <span className={styles.trackDuration}>{_mapDuration(props.currentSong.duration)}</span>
      </div>
      <div className={styles.controls}>
        <div className={styles.slot}>&nbsp;</div>
        <div className={styles.slot}>&nbsp;</div>
        <div className={styles.slot}>{mainControl}</div>
        <div className={styles.slot}>
          <img className={styles.secondaryControl} src={imgNext} onClick={props.onNext} />
        </div>
        <div className={styles.slot}>&nbsp;</div>
      </div>
    </div>
  );
}

export default Player;
