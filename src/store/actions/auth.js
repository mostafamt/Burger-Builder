import * as actionTypes from "./actionTypes";
import axios from "axios";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    userId: userId,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationTime");
  localStorage.removeItem("userId");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const auth = (email, password, isSignup) => {
  return (dispatch) => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true,
    };
    // Sign Up
    let url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyATwfVDLZNaH4ecT0Nid2V3QcTYTN4fSwE";
    if (!isSignup) {
      // Sign In
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyATwfVDLZNaH4ecT0Nid2V3QcTYTN4fSwE";
    }

    axios
      .post(url, authData)
      .then((res) => {
        console.log(res.data);
        const expirationTime = Date.now() + res.data.expiresIn * 1000;
        localStorage.setItem("token", res.data.idToken);
        localStorage.setItem("expirationTime", expirationTime);
        localStorage.setItem("userId", res.data.localId);
        dispatch(authSuccess(res.data.idToken, res.data.localId));
        dispatch(checkAuthTimeout(res.data.expiresIn));
      })
      .catch((err) => {
        console.log(err);
        dispatch(authFail(err.response.data.error));
      });
  };
};

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path,
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
    } else {
      const expirationTime = Number.parseInt(
        localStorage.getItem("expirationTime")
      );
      if (Date.now() > expirationTime) {
        dispatch(logout());
      } else {
        dispatch(authSuccess(token, localStorage.getItem("userId")));
        console.log("time ", (expirationTime - Date.now()) / 1000);
        dispatch(checkAuthTimeout((expirationTime - Date.now()) / 1000));
      }
    }
  };
};
