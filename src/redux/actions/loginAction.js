import axios from "axios";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT_REQUEST,
  LOGOUT_FAILED,
  LOGOUT_SUCCESS,
  REFRESH_REQUEST,
  REFRESH_SUCCESS,
  REFRESH_FAILED,
} from "../states/loginState";
import { apiUrl } from "../../../environment";

const UserLogin = (formData) => {
  return async (dispatch) => {
    dispatch({
      type: LOGIN_REQUEST,
    });
    try {
      const res = await axios({
        method: "POST",
        url: `${apiUrl}/users/dwoodUserEmail-signIn`,
        data: formData,
      });
      console.log("res", res);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: LOGIN_FAILED,
        payload: error,
      });
    }
  };
};

const UserLogout = () => {
  return async (dispatch) => {
    dispatch({ type: LOGOUT_REQUEST });
    try {
      const data = await axios({
        method: "POST",
        url: `${apiUrl}/users/logout`,
      });
      if (data?.status === 200) {
        if (data?.data?.status == "Ok") {
          dispatch({
            type: LOGOUT_SUCCESS,
          });
        }
      }
    } catch (error) {
      dispatch({
        type: LOGOUT_FAILED,
        payload: error.response,
      });
    }
  };
};

const RefreshUser = (refreshId) => {
  return async (dispatch) => {
    var token = localStorage.getItem("_auth_token");
    var refreshToken = localStorage.getItem("_auth_refreshToken");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    dispatch({
      type: REFRESH_REQUEST,
    });
    const Data = {
      refreshToken: `${refreshToken}`,
    };
    try {
      const res = await axios({
        method: "POST",
        url: `/users/refreshToken`,
        data: Data,
      });
      var result = res.data.data;
      var token = localStorage.setItem("_auth_token", result.token);
      var refreshToken = localStorage.setItem(
        "_auth_refreshToken",
        result.refreshToken
      );
      dispatch({
        type: REFRESH_SUCCESS,
        payload: result,
      });
    } catch (error) {
      dispatch({
        type: REFRESH_FAILED,
        payload: error,
      });
    }
  };
};

export { UserLogin, UserLogout, RefreshUser };
