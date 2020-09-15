import React from 'react';
import { HeaderButton } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';

import colors from '../../constants/colors';
import { isAndroid } from '../../helpers/platform';

const CustomHeaderButton = (props) => {
  const color = isAndroid ? 'white' : colors.primary;
  return (
    <HeaderButton
      {...props}
      IconComponent={Ionicons}
      iconSize={23}
      color={color}></HeaderButton>
  );
};

export default CustomHeaderButton;
