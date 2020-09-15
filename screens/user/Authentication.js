import React, { useCallback, useEffect, useReducer, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';

import Card from '../../components/ui/Card';
import InputWithValidation from '../../components/shop/InputWithValidation';

import { signupUserAction, loginUserAction } from '../../store/actions/user';
import colors from '../../constants/colors';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  const { input, isFieldValid, value } = action;
  const { inputValidation, inputValues } = state;
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...inputValues,
      [input]: value,
    };
    const updatedValidation = {
      ...inputValidation,
      [input]: isFieldValid,
    };
    const updatedIsFormValid = !Object.values(updatedValidation).some(
      (value) => value === false
    );
    return {
      ...state,
      inputValidation: updatedValidation,
      inputValues: updatedValues,
      isFormValid: updatedIsFormValid,
    };
  }
  return state;
};

const AuthenticationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [error, setError] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
    },
    inputValidation: {
      email: false,
      password: false,
    },
    isFormValid: false,
  });

  const handleOnChange = useCallback(
    (input, value, isFieldValid) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value,
        input,
        isFieldValid,
      });
    },
    [dispatchFormState]
  );

  const handleAuthentication = async () => {
    const { email, password } = formState.inputValues;
    setError(null);
    setIsLoading(true);
    if (isSignup) {
      try {
        await dispatch(signupUserAction(email, password));
        setIsSignup(false);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    } else {
      try {
        await dispatch(loginUserAction(email, password));
        navigation.navigate('Shop');
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert('An Error Occured!', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  return (
    <KeyboardAvoidingView style={styles.view}>
      <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
        <Card style={styles.loginContainer}>
          <ScrollView>
            <InputWithValidation
              id='email'
              label='Email'
              keyboardType='email-address'
              required
              email
              autoCapitalize='none'
              errorMessage='Please enter a valid email address.'
              onInputChange={handleOnChange}
            />
            <InputWithValidation
              id='password'
              label='Password'
              keyboardType='default'
              secureTextEntry
              required
              minLength={5}
              errorMessage='Please enter a valid password.'
              onInputChange={handleOnChange}
            />
            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size='small' color={colors.primary} />
              ) : (
                <Button
                  title={isSignup ? 'Signup' : 'Login'}
                  color={colors.primary}
                  onPress={handleAuthentication}
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={`Switch to ${isSignup ? 'Login' : 'Sign Up'}`}
                color={colors.accent}
                onPress={() => setIsSignup((prevState) => !prevState)}
              />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

AuthenticationScreen.navigationOptions = {
  headerTitle: 'Login',
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 10,
  },
  gradient: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  view: {
    flex: 1,
  },
});

export default AuthenticationScreen;
