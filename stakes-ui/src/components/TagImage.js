import React, { useContext } from 'react';
import TilitintinContext from '../context/TilitintinContext';
import PropTypes from 'prop-types';

function TagImage(props) {
  const { tag } = props;
  const tilitintin = useContext(TilitintinContext);
  const url = tilitintin.tags[tag] || '/pics/white.png';
  // TODO: Use style.
  return <span><img style={{ height: '100px' }} src={url} alt={`Tag ${tag}`} />[{tag}]</span>;
}

TagImage.propTypes = {
  tag: PropTypes.string
};

export default TagImage;
