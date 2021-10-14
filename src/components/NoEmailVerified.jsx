import React, { useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../contexts/AuthProvider";

export const NoEmailVerified = () => {
  const { currentUser, logout, emailVerification } = useAuth();
  const history = useHistory();
  const [error, setError] = useState("");

  if (!currentUser) {
    history.push("/");
  }

  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.push("/");
    } catch {
      setError("Failed to log out");
    }
  }

  async function handlesendEmailVerification() {
    setError("");
    try {
      await emailVerification();
      setError("メールをおくりました。メール有効化をお願いします");
    } catch (e) {
      console.log(e);
      setError("有効化メールの送信に失敗しました");
    }
  }

  return (
    <>
      {currentUser && (
        <>
          {!currentUser.emailVerified && (
            <div>
              メールアドレスが有効化されていません <br />
              <button color="primary" onClick={handlesendEmailVerification}>
                メールアドレス有効化
              </button>
            </div>
          )}
        </>
      )}
      <button onClick={handleLogout}>Logout</button>
    </>
  );
};
