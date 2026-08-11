import axios from "axios";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
} from "../states/loginState";
import { apiUrl } from "../../../environment";

const UserLoginWithWallet = (accountId) => {
  return async (dispatch) => {
    dispatch({
      type: LOGIN_REQUEST,
    });
    try {
      const res = await axios({
        method: "POST",
        url: `${apiUrl}/users/dwoodUserWallet-signIn`,
        data: { accountId: accountId },
      });
      if (res.data.is_registered) {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data,
        });
      } else {
        dispatch({
          type: LOGIN_FAILED,
          payload: res.data,
        });
      }
    } catch (error) {
      dispatch({
        type: LOGIN_FAILED,
        payload: error,
      });
    }
  };
};
export { UserLoginWithWallet };
