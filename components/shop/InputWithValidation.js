import PropTypes from 'prop-types';
import React, { useEffect, useReducer } from 'react';

import CustomInput from '../ui/Input';

const INPUT_BLUR = 'INPUT_BLUR';
const INPUT_CHANGE = 'INPUT_CHANGE';

const inputReducer = (state, action) => {
  const { isValid, value } = action;
  switch (action.type) {
    case INPUT_CHANGE: {
      return {
        ...state,
        value,
        isValid,
      };
    }
    case INPUT_BLUR: {
      return {
        ...state,
        touched: true,
      };
    }
    default:
      return state;
  }
};

const InputWithValidation = ({
  email,
  id,
  initialValue,
  initiallyValid,
  max,
  min,
  maxLength,
  minLength,
  onInputChange,
  required,
  ...props
}) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: initialValue,
    isValid: initiallyValid,
    touched: false,
  });

  const handleOnChange = (value) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (required && value.trim().length === 0) {
      isValid = false;
    }
    if (email && !emailRegex.test(value.toLowerCase())) {
      isValid = false;
    }
    if (min != null && parseFloat(value, 10) < min) {
      isValid = false;
    }
    if (max != null && parseFloat(value, 10) > max) {
      isValid = false;
    }
    if (minLength != null && value.length < minLength) {
      isValid = false;
    }
    if (maxLength != null && value.length > maxLength) {
      isValid = false;
    }
    dispatch({
      type: INPUT_CHANGE,
      value,
      isValid,
    });
  };

  const handleLostFocus = () => {
    dispatch({ type: INPUT_BLUR });
  };

  useEffect(() => {
    const { isValid, touched, value } = inputState;
    if (touched) onInputChange(id, value, isValid);
  }, [inputState, onInputChange]);

  return (
    <CustomInput
      onBlur={handleLostFocus}
      onChangeText={handleOnChange}
      value={inputState.value}
      isTouched={inputState.touched}
      isValid={inputState.isValid}
      required={required}
      {...props}
    />
  );
};

InputWithValidation.propTypes = {
  required: PropTypes.bool,
};

InputWithValidation.defaultProps = {
  required: false,
};

export default InputWithValidation;
