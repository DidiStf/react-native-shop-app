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
  },
});

export default Centered;
