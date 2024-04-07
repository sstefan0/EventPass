import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  isLoggedIn: boolean;
}

const initialState: UserState = {
  isLoggedIn: localStorage.getItem("accessToken") ? true : false,
};

const userSlice = createSlice({
  name: "loggedIn",
  initialState,
  reducers: {
    login: (state) => {
      state.isLoggedIn = true;
    },
    logout: (state) => {
      console.log("dispeciraaaaj");
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
