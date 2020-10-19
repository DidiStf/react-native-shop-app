import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const CustomInput = ({
  editable,
  errorMessage,
  isTouched,
  isValid,
  label,
  required,
  ...props
}) => {
  return (
    <View style={styles.formControl}>
      <Text style={styles.label}>
        {label}
        {required && '*'}
        {!editable && <Text>(cannot be modified)</Text>}
      </Text>
      <TextInput {...props} style={styles.input} />
      {isTouched && !isValid && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    marginVertical: 5,
  },
  errorMessage: {
    fontFamily: 'open-sans',
    color: 'red',
    fontSize: 13,
  },
  formControl: {
    width: '100%',
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  label: {
    fontFamily: 'open-sans-bold',
    marginVertical: 8,
  },
});

CustomInput.propTypes = {
  editable: PropTypes.bool,
  required: PropTypes.bool,
};

CustomInput.defaultProps = {
  editable: true,
  required: false,
};

export default CustomInput;
