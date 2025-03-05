import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "./pages/_layouts/app";
import { AuthLayout } from "./pages/_layouts/auth";
import { NotFound } from "./pages/404";

import { Dashboard } from "./pages/app/pages/home";
import { Orders } from "./pages/app/pages/orders";
import { Overview } from "./pages/app/overview";

import { SignIn } from "./pages/auth/sign-in";
import { SignUp } from "./pages/auth/sign-up";

import { Error } from "./pages/error";
import Products from "./pages/app/products";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      { path: "/overview", element: <Overview /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/orders", element: <Orders /> },
      { path: "/products", element: <Products /> },
      // { path: "/custommers", element: <Customers /> },
      // { path: "/users", element: <User /> },
      // { path: "/support", element: <Support /> },
      // { path: "/settings", element: <Settings /> },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "/sign-in", element: <SignIn /> },
      { path: "/sign-up", element: <SignUp /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
