import React from 'react';
import TagImage from './TagImage';
import PropTypes from 'prop-types';

function FundTitle(props) {
  const { fund } = props;
  return <h1><TagImage tag={fund.tag} /> {fund.name}</h1>;
}

FundTitle.propTypes = {
  fund: PropTypes.object
};

export default FundTitle;
