import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

interface UserState {
  isLoggedIn: boolean;
  role: string;
}
const accessToken = localStorage.getItem("accessToken");

const initialState: UserState = {
  isLoggedIn: accessToken ? true : false,
  role: accessToken ? (jwtDecode(accessToken) as any).role : "",
};

const userSlice = createSlice({
  name: "loggedIn",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.role = (jwtDecode(action.payload.accessToken) as any).role;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.role = "";
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
