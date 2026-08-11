import {
  LAND_REDIRECT_FAILED,
  LAND_REDIRECT_SUCCESS,
} from "../states/loginState";

const defaultValue = {
  isLocation: false,
  location: "",
};

const landingRedirectReducers = (state = defaultValue, action) => {
  switch (action.type) {
    case LAND_REDIRECT_SUCCESS:
      return {
        ...state,
        location: action.payload,
        isLocation: true,
      };
    case LAND_REDIRECT_FAILED:
      return {
        ...state,
        location: "",
        isLocation: false,
      };

    default:
      return state;
  }
};
export default landingRedirectReducers;
