import {
  ADD_TO_CART_FAILED,
  ADD_TO_CART_REQ,
  ADD_TO_CART_SUCCESS,
  GET_TO_CART_FAILED,
  GET_TO_CART_REQ,
  GET_TO_CART_SUCCESS,
  REMOVE_TO_CART_FAILED,
  REMOVE_TO_CART_SUCCESS,
} from "../states/loginState";

const initialData = {
  cartData: [],
  data: {},
  success: false,
  isData: false,
  addCardisloading: false,
  getCardisloading: false,
  error: false,
  get_card_error: false,
  message: "",
  checkRemove: false,
};

const marketPageReducer = (state = initialData, action) => {
  switch (action.type) {
    case ADD_TO_CART_REQ:
      return {
        ...state,
        cartData: [],
        data: {},
        success: false,
        isData: false,
        addCardisloading: true,
        getCardisloading: false,
        error: false,
        message: "",
        get_card_error: false,
        checkRemove: false,
      };
    case ADD_TO_CART_SUCCESS:
      return {
        ...state,
        cartData: [],
        data: {},
        success: true,
        isData: false,
        addCardisloading: false,
        getCardisloading: false,
        error: false,
        message: action.payload,
        get_card_error: false,
        checkRemove: false,
      };

    case ADD_TO_CART_FAILED:
      return {
        ...state,
        cartData: [],
        data: {},
        success: false,
        isData: false,
        addCardisloading: false,
        getCardisloading: false,
        error: true,
        message: "",
        get_card_error: false,
        checkRemove: false,
      };

    case GET_TO_CART_REQ:
      return {
        ...state,
        cartData: [],
        data: {},
        success: false,
        isData: false,
        addCardisloading: false,
        getCardisloading: true,
        error: false,
        message: "",
        get_card_error: false,
        checkRemove: false,
      };

    case GET_TO_CART_SUCCESS:
      return {
        ...state,
        cartData: action.payload,
        data: {},
        success: true,
        isData: true,
        addCardisloading: false,
        getCardisloading: false,
        error: false,
        message: "",
        get_card_error: false,
        checkRemove: false,
      };

    case GET_TO_CART_FAILED:
      return {
        ...state,
        data: {},
        success: false,
        isData: false,
        addCardisloading: false,
        getCardisloading: false,
        error: false,
        message: "",
        get_card_error: true,
        checkRemove: false,
      };

    case REMOVE_TO_CART_SUCCESS:
      return {
        ...state,
        data: {},
        success: false,
        isData: false,
        addCardisloading: false,
        getCardisloading: false,
        error: false,
        message: action.payload,
        get_card_error: false,
        checkRemove: true,
      };

    case REMOVE_TO_CART_FAILED:
      return {
        ...state,
        data: {},
        success: false,
        isData: false,
        addCardisloading: false,
        getCardisloading: false,
        error: false,
        message: "",
        get_card_error: false,
        checkRemove: false,
      };

    default:
      return state;
  }
};

export default marketPageReducer;
