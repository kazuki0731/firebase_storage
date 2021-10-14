import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

export const Dashboard = () => {
  const { currentUser, logout, emailVerification } = useAuth();
  console.log(currentUser);
  const [error, setError] = useState("");
  const history = useHistory();
  const handleLogout = async () => {
    try {
      await logout();
      history.push("/");
    } catch (e) {
      console.log(e);
    }
  };

  const handlesendEmailVerification = async () => {
    setError("");
    try {
      await emailVerification();
      setError("メールをおくりました。メール有効化をお願いします");
    } catch (e) {
      console.log(e);
      setError("有効化メールの送信に失敗しました");
    }
  };

  return (
    <>
      <div>名前: {currentUser.name}</div>
      <div>Email: {currentUser.email}</div>
      <h1>Dashborad</h1>
      <Link to="/login">Login</Link>
      <br />
      <Link to="/signup">Signup</Link>
      <br />
      <button onClick={handleLogout}>Logout</button>
      {!currentUser.emailVerified && (
        <div>
          有効化されていません
          <button onClick={handlesendEmailVerification}>有効化</button>
        </div>
      )}
    </>
  );
};
