import React, { useContext } from 'react';
import TilitintinContext from '../context/TilitintinContext';
import PropTypes from 'prop-types';
import { Avatar } from '@material-ui/core';

function TagImage(props) {
  const { tag, avatar } = props;
  const tilitintin = useContext(TilitintinContext);
  const url = tilitintin.tags[tag] || '/pics/white.png';
  // TODO: Use style.
  if (avatar) {
    if (!tilitintin.tags[tag]) {
      return <Avatar>{tag.substr(0, 3)}</Avatar>;
    }
    return <Avatar src={url} alt={tag} />;
  }
  return <img style={{ height: '100px' }} src={url} alt={tag} />;
}

TagImage.propTypes = {
  tag: PropTypes.string,
  avatar: PropTypes.bool
};

export default TagImage;
