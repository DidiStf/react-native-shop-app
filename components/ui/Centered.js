import React from 'react';
import { StyleSheet, View } from 'react-native';

const Centered = ({ children }) => {
  return <View style={styles.centered}>{children}</View>;
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5b59f',
    height: '100%',
  },
});

export default Centered;
