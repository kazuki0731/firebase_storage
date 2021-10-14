import React from "react";
import { Redirect, Route } from "react-router";
import { useAuth } from "../contexts/AuthProvider";

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) =>
        currentUser ? <Component /> : <Redirect to="/login" />
      }
    />
  );
};
