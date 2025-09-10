import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from 'jwt-decode';

// Initial state
const initialState = {
  name: "",
  email: "",
  avatar: null,
  token: "",
  isLoggedIn: false
};

// Slice definition
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
      state.token = action.payload.token;
      state.isLoggedIn = action.payload.isLoggedIn;
    },
    removeUser: () => ({
      name: "",
      email: "",
      avatar: null,
      token: "",
      isLoggedIn: false
    })
  }
});

// Actions
export const { setUser, removeUser } = userSlice.actions;

// Selectors
export const getUserAvatar = (state) => state.user.avatar;
export const getName = (state) => state.user.name;
export const getToken = (state) => state.user.token;
export const getRole = (state) => {
  if (state.user.token) {
    const userData = jwtDecode(state.user.token);
    return userData.role;
  }
  return "";
};

export const getIsLoggedIn = (state) => state.user.isLoggedIn;

export default userSlice.reducer;