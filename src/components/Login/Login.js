import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
} from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

import AuthContext from '../../store/auth-context';

const emailReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.includes('@') };
  }
  if (action.type === 'INPUT_BLUR') {
    // Last state snapshot
    return { value: state.value, isValid: state.value.includes('@') };
  }
  return { value: '', isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return {
      value: action.val,
      isValid: action.val.trim().length > 6,
    };
  }
  if (action.type === 'INPUT_BLUR') {
    return {
      value: state.value,
      isValid: state.value.trim().length > 6,
    };
  }
  return { value: '', isValid: false };
};

const Login = (props) => {
  /*   const [enteredEmail, setEnteredEmail] = useState('');
  const [emailIsValid, setEmailIsValid] = useState();
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordIsValid, setPasswordIsValid] = useState(); */
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(
    passwordReducer,
    {
      value: '',
      isValid: null,
    }
  );

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    console.log('EFFECT RUNNING');

    return () => {
      console.log('EFFECT CLEANUP');
    };
  }, []);

  // Object Destructuring - to optimize useEffect

  // Whenever just the value is changed, and validity is the same
  // (e.g password was 7 char - valid, then it is 9 char - valid)
  // Effect will not re-run, when using emailIsValid and passwordIsValid in dependencies

  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(
    () => {
      const identifier = setTimeout(() => {
        console.log('Checking form validity');
        /* setFormIsValid(
        enteredEmail.includes('@') &&
          enteredPassword.trim().length > 6
      ); */
        setFormIsValid(emailIsValid && passwordIsValid);
      }, 500);

      return () => {
        console.log('CLEANUP');
        clearTimeout(identifier);
      };
    },
    /* [enteredEmail, enteredPassword] */ [
      emailIsValid,
      passwordIsValid,
    ]
  );

  const emailChangeHandler = (event) => {
    /* setEnteredEmail(event.target.value); */
    dispatchEmail({ type: 'USER_INPUT', val: event.target.value });

    // useEffect is more accurate than
    // setFormIsValid(emailState.isValid, passwordState.isValid)

    // This might not have the latest state
    // And function form is not used, but it depends on prev state

    /* setFormIsValid(
      event.target.value.includes('@') &&
        enteredPassword.trim().length > 6
    ); */
  };

  const passwordChangeHandler = (event) => {
    /* setEnteredPassword(event.target.value); */
    dispatchPassword({ type: 'USER_INPUT', val: event.target.value });

    /* setFormIsValid(
      emailState.isValid && event.target.value.trim().length > 6
    ); */
  };

  const validateEmailHandler = () => {
    /* setEmailIsValid(enteredEmail.includes('@')); */
    dispatchEmail({ type: 'INPUT_BLUR' });
  };

  const validatePasswordHandler = () => {
    /* setPasswordIsValid(enteredPassword.trim().length > 6); */
    dispatchPassword({ type: 'INPUT_BLUR' });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    /* props.onLogin(enteredEmail, enteredPassword); */
    /* props.onLogin(emailState.value, passwordState.value); */
    authCtx.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          /* className={`${classes.control} ${
            emailIsValid === false ? classes.invalid : ''
          }`} */
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            /* value={enteredEmail} */
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          /* className={`${classes.control} ${
            passwordIsValid === false ? classes.invalid : ''
          }`} */
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            /* value={enteredPassword} */
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button
            type="submit"
            className={classes.btn}
            disabled={!formIsValid}
          >
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
