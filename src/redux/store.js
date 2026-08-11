import { createStore, applyMiddleware, legacy_createStore } from "redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

import logger from "redux-logger";
import {thunk} from "redux-thunk";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import loginReducer from "./reducers/loginReducer";
import marketPageReducer from "./reducers/marketPageReducer";
import landingRedirectReducers from "./reducers/landingRedirectReducers";
// const middleware = applyMiddleware(logger.default);

const middleware = () => {
  return applyMiddleware(thunk, logger);
};
const rootReducer = combineReducers({
  loginReducer: loginReducer,
  marketPageReducer: marketPageReducer,
  landingRedirectReducers: landingRedirectReducers,
});

const initialState = {};

const persistConfig = {
  key: "root",
  storage,
  //blblacklist: ['user']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).prepend(logger),
});
export const persistor = persistStore(store);
