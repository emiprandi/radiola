import React from 'react';
import styles from './_artwork.css';
import imgDefault from '../img/artwork-default.png';
import img404 from '../img/artwork-404.png';

class Artwork extends React.Component {
  constructor(props) {
    super(props);

    this.state = { image: imgDefault }
    this._errorHandler = this._errorHandler.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.img) {
      this.setState({ image: nextProps.img });
    }
  }

  _errorHandler() {
    this.setState({ image: img404 });
  }

  render() {
    return (
      <img
        className={styles.image}
        onError={this._errorHandler}
        src={this.state.image}
      />
    )
  }
};

export default Artwork;
