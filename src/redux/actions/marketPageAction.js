import axios from "axios";
import {
  ADD_TO_CART_FAILED,
  ADD_TO_CART_REQ,
  ADD_TO_CART_SUCCESS,
  GET_TO_CART_FAILED,
  GET_TO_CART_REQ,
  GET_TO_CART_SUCCESS,
  REMOVE_TO_CART_FAILED,
  REMOVE_TO_CART_REQ,
  REMOVE_TO_CART_SUCCESS,
} from "../states/loginState";
import { apiUrl } from "../../../environment";

export const marketPageAction = (data) => {
  debugger;
  return async (dispatch) => {
    await dispatch({
      type: ADD_TO_CART_REQ,
    });
    const address = localStorage.getItem("address");
    const api = `${apiUrl}/cart/add-to-cart`;
    const body = {
      accountId: address,
      cartItems: data,
    };
    axios
      .post(api, body)
      .then(async (res) => {
        if (res.status === 200) {
          await dispatch({
            type: ADD_TO_CART_SUCCESS,
            payload: res?.data,
          });
        } else {
          dispatch({
            type: ADD_TO_CART_FAILED,
            payload: {},
          });
        }
      })
      .catch((err) => {
        dispatch({
          type: ADD_TO_CART_FAILED,
          payload: err,
        });
      });
  };
};

export const getCardData = () => {
  return async (dispatch) => {
    const api = `${apiUrl}/cart/get-cart-assets`;
    await dispatch({
      type: GET_TO_CART_REQ,
    });
    axios
      .get(api)
      .then(async (res) => {
        if (res.status === 200) {
          await dispatch({
            type: GET_TO_CART_SUCCESS,
            payload: res?.data,
          });
        } else {
          dispatch({
            type: GET_TO_CART_FAILED,
          });
        }
      })
      .catch((err) => {
        dispatch({
          type: GET_TO_CART_FAILED,
          payload: err,
        });
      });
  };
};

export const removeToCartAction = (id) => {
  debugger;
  return async (dispatch) => {
    const address = localStorage.getItem("address");
    const api = `${apiUrl}/cart/delete-cart-items/${address}`;
    const body = {
      assetId: id,
    };
    await dispatch({
      type: REMOVE_TO_CART_REQ,
    });
    axios
      .delete({
        url: api,
        data: body,
      })
      .then(async (res) => {
        console.log("res", res);
        if (res.status === 200) {
          await dispatch({
            type: REMOVE_TO_CART_SUCCESS,
            payload: res?.data,
          });
        } else {
          dispatch({
            type: REMOVE_TO_CART_FAILED,
          });
        }
      })
      .catch((err) => {
        dispatch({
          type: REMOVE_TO_CART_FAILED,
          payload: err,
        });
      });
  };
};
