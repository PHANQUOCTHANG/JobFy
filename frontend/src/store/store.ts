import { configureStore, combineReducers, AnyAction } from "@reduxjs/toolkit";
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

// Reducers
import authReducer from "@/features/auth/types/authSlice";

import { injectStore, setGlobalAccessToken } from "@/lib/axios";

const persistConfig = {
  key: "root", // Tiền tố tên key lưu dưới LocalStorage (sẽ là persist:root)
  storage, // Ép dùng LocalStorage của trình duyệt
  whitelist: ["auth"], // Chỉ cho phép khôi phục và lưu dữ liệu của slice 'auth'
};
export const LOGOUT_ACTION = "auth/logout";
// 2. Root Reducer

const appReducer = combineReducers({
  auth: authReducer,
});

// 2. Định nghĩa Root Reducer với Type chuẩn
const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: AnyAction,
) => {
  if (action.type === LOGOUT_ACTION) {
    // 1. Xóa sạch các key trong LocalStorage của Redux Persist
    // Thay vì dùng storage.removeItem thủ công, ta để Persistor tự lo hoặc xóa hết key có tiền tố persist:
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("persist:")) {
        localStorage.removeItem(key);
      }
    });
    // Xóa thủ công các rác khác của App
    localStorage.removeItem("recentSearches");
    // Lưu ý: Theme (vite-ui-theme) thường người dùng muốn giữ lại kể cả khi logout,
    // nên cân nhắc có nên xóa không. Nếu muốn xóa sạch thì:
    // localStorage.removeItem("vite-ui-theme");
    // 2. Ép state về undefined để các reducer con (auth, player, interaction)
    // quay về initialState ban đầu của chúng
    state = undefined;
  }

  return appReducer(state, action);
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
// 3. Store Initialization
export const store = configureStore({
  reducer: persistedReducer, // 🎯 THAY ĐỔI: Truyền reducer đã được bọc bảo vệ vào đây
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: import.meta.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 4. Side Effects
injectStore(store);

let currentToken = store.getState().auth.token;
if (currentToken) setGlobalAccessToken(currentToken);

store.subscribe(() => {
  const newState = store.getState();
  const newToken = newState.auth.token;
  if (newToken !== currentToken) {
    currentToken = newToken;
    setGlobalAccessToken(currentToken);
  }
});
