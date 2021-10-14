import React from "react";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <>
      <h1>Home</h1>
      <Link to="/login">Login</Link>
      <br />
      <Link to="/signup">Signup</Link>
    </>
  );
};
