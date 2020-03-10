import React, { useContext } from 'react';
import TilitintinContext from '../context/TilitintinContext';
import { TilitintinContextType } from '../types';
import { Avatar } from '@material-ui/core';

interface TagImageProps {
  tag: string;
  avatar?: boolean;
  small?: boolean;
  medium?: boolean;
  className?: string;
}

function TagImage(props: TagImageProps): JSX.Element {
  const { tag, avatar, small, medium, className } = props;
  const tilitintin = useContext(TilitintinContext) as TilitintinContextType;
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

export default TagImage;
