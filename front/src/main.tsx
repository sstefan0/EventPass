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
import Profile from "./pages/profile/profile";
import { loader as purchasesLoader } from "./pages/profile/profile";
import { loader as userLoader } from "./components/user-info/user-info";
import Dashboard from "./pages/dashboard/dashboard";
import { loader as eventTableLoader } from "./components/events-table/events-table";
import ManageEvent from "./pages/manage-event/manage-event";
import callApi from "./api/api";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,

    children: [
      { path: "/", element: <EventCardList />, loader: eventsLoader },
      {
        path: "/category/:id",
        element: <EventCardList />,
        loader: async ({ params }) => {
          const response = await callApi.Event.getAllCategory(params.id!);
          return response;
        },
      },
      {
        path: "/event/:id",
        element: <EventPage />,
        loader: async ({ params }) => {
          const response = await callApi.Event.getOne(params.id!);
          return response;
        },
      },
      {
        path: "/profile",
        element: <Profile />,
        loader: async () => {
          const [userData, purchases] = await Promise.all([
            userLoader(),
            purchasesLoader(),
          ]);

          return { userData, purchases };
        },
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
        loader: async () => {
          const [userData, events] = await Promise.all([
            userLoader(),
            eventTableLoader(),
          ]);
          return { userData, events };
        },
      },
      {
        path: "/manageEvent",
        element: <ManageEvent />,
      },
      {
        path: "/manageEvent/:id",
        element: <ManageEvent />,
        loader: async ({ params }) => {
          const response = await callApi.Event.getOne(params.id!);
          return response;
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
