import React, { useContext } from 'react';
import TilitintinContext from '../context/TilitintinContext';
import PropTypes from 'prop-types';
import { Avatar } from '@material-ui/core';

function TagImage(props) {
  const { tag, avatar, small, medium, className } = props;
  const tilitintin = useContext(TilitintinContext);
  const url = tilitintin.tags[tag] || '/pics/white.png';
  if (avatar) {
    if (!tilitintin.tags[tag]) {
      return <Avatar className={className}>{tag.substr(0, 3)}</Avatar>;
    }
    return <Avatar className={className} src={url} alt={tag} />;
  }
  const size = (small ? '24px' : (medium ? '64px' : '100px'));
  return <img className={className} style={{ width: size }} src={url} alt={tag} />;
}

TagImage.propTypes = {
  avatar: PropTypes.bool,
  className: PropTypes.string,
  small: PropTypes.bool,
  medium: PropTypes.bool,
  tag: PropTypes.string
};

export default TagImage;
