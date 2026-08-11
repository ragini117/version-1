import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT_REQUEST,
  LOGOUT_FAILED,
  LOGOUT_SUCCESS,
  LOGIN_RESET,
  REFRESH_REQUEST,
  REFRESH_SUCCESS,
  REFRESH_FAILED,
} from "../states/loginState";

const initialState = {
  isLogin: false,
  userDetail: {
    is_registered: null,
  },
  error: null,
  isLoading: false,
};
const LoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isLogin: false,
        userDetail: { is_registered: null },
        error: null,
        isLoading: true,
      };
    case LOGIN_FAILED:
      return {
        ...state,
        isLogin: false,
        userDetail: action.payload,
        error: null,
        isLoading: false,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLogin: true,
        userDetail: action?.payload,
        error: null,
        isLoading: false,
      };

    case LOGOUT_REQUEST:
      return {
        ...state,
        isLogin: false,
        userDetail: { is_registered: null },
        isLoading: true,
        error: null,
      };
    case LOGOUT_FAILED:
      return {
        ...state,
        isLogin: false,
        error: action.payload,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isLogin: false,
        userDetail: { is_registered: null },
        isLoading: false,
        error: null,
      };

    case LOGIN_RESET:
      return {
        ...state,
        isLogin: false,
        userDetail: { is_registered: null },
        isLoading: true,
        error: null,
      };
    case REFRESH_SUCCESS:
      return {
        ...state,
        isLogin: true,
        userDetail: {
          ...state.userDetail,
          token: action.payload.token,
          refreshToken: action.payload.refreshToken,
        },
        error: null,
        isLoading: false,
      };
    case REFRESH_FAILED:
      return {
        ...state,
        isLogin: false,
        userDetail: {
          is_registered: null,
        },
        error: null,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default LoginReducer;
