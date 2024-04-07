import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import { loader as eventsLoader } from "./components/event-card-list/event-card-list";
import EventCardList from "./components/event-card-list/event-card-list";
import LoginPage from "./pages/login/login";
import EventPage from "./pages/event/event-page";
import { RegisterPage } from "./pages/register/register";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import ForgotPasswordPage from "./pages/forgot-password/forgot-password";
import ResetPassword from "./components/reset-password/reset-password";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,

    children: [
      { path: "/", element: <EventCardList />, loader: eventsLoader },
      {
        path: "/event/:id",
        element: <EventPage />,
        loader: async ({ params }) => {
          const response = await fetch(
            "http://localhost:3000/event/get-by-id?id=" + params.id,
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("accessToken"),
                "Content-Type": "application/json",
              },
            }
          );
          const resData = await response.json();
          return resData;
        },
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/forgotPassword",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/resetPassword/:token",
    element: <ResetPassword />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
