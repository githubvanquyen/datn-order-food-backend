import {configureStore} from "@reduxjs/toolkit"
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
  import storage from "redux-persist/lib/storage";
import loginReducer from "./slide/loginSlide"

const persistConfig = {
    key: "root",
    version: 1,
    storage,
  };

  const rootReducer = persistReducer(persistConfig, loginReducer);

const store = configureStore({
    reducer:{
        login: rootReducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export let persistor = persistStore(store);
export default store;