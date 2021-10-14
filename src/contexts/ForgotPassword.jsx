import { createStyles, makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { useReducer } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
} from "@material-ui/core";
import { useAuth } from "../contexts/AuthProvider";
import { useForm } from "react-hook-form";

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap",
      width: 400,
      magin: "10px auto",
    },
    signupBtn: {
      marginTop: "20px",
      flexGrow: 1,
    },
    header: {
      textAlign: "center",
      background: "#212121",
      color: "#fff",
    },
    card: {
      marginTop: "20px",
    },
  })
);

const initState = {
  email: "",
  isButtonDisabled: true,
  helperText: "",
  isError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setEmail":
      return {
        ...state,
        email: action.payload,
      };
    case "setIsButtonDisabled":
      return {
        ...state,
        isButtonDisabled: action.payload,
      };
    case "signupSuccess":
      return {
        ...state,
        helperText: action.payload,
      };
    case "signupFailed":
      return {
        ...state,
        helperText: action.payload,
      };
    case "setIsError":
      return {
        ...state,
        isError: action.payload,
      };
    default:
      return state;
  }
};

export const ForgotPassword = () => {
  const classes = useStyles();
  const { resetPassword } = useAuth();
  const {
    handleSubmit,
  } = useForm();
  const [state, dispatch] = useReducer(reducer, initState);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (state.email.trim()) {
      dispatch({
        type: "setIsButtonDisabled",
        payload: false,
      });
    } else {
      dispatch({
        type: "setIsButtonDisabled",
        payload: true,
      });
    }
  }, [state.email]);

  const handleForgotPassword = async (data) => {
    try {
      setError("");
      setSuccessMessage("");
      dispatch({
        type: "setIsButtonDisabled",
        payload: true,
      });
      await resetPassword(state.email);
      dispatch({
        type: "signupSuccess",
        payload: "ForgotPassword Successfully",
      });
      dispatch({
        type: "setIsButtonDisabled",
        payload: false,
      });
      setSuccessMessage("パスワード初期化しました");
    } catch (e) {
      console.log(e);
      switch (e.code) {
        case "auth/network-request-failed":
          setError(
            "通信がエラーになったのか、またはタイムアウトになりました。通信環境がいい所で再度やり直してください。"
          );
          break;
        case "auth/weak-password": //バリデーションでいかないようにする
          setError("パスワードが短すぎます。6文字以上を入力してください。");
          break;
        case "auth/invalid-email": //バリデーションでいかないようにする
          setError("メールアドレスが正しくありません");
          break;
        case "auth/email-already-in-use":
          setError(
            "メールアドレスがすでに使用されています。ログインするか別のメールアドレスで作成してください"
          );
          break;
        case "auth/user-disabled":
          setError("入力されたメールアドレスは無効（BAN）になっています。");
          break;
        default:
          //想定外
          setError(
            "アカウントの作成に失敗しました。通信環境がいい所で再度やり直してください。"
          );
      }
      dispatch({
        type: "setIsButtonDisabled",
        payload: false,
      });
    }
  };

  const handleKeyPress = (e) => {
    console.log(e.keyCode, e.which);
    if (e.keyCode === 13 || e.which === 13) {
      state.isButtonDisabled || handleForgotPassword();
    }
  };

  const handleEmailChange = (e) => {
    dispatch({
      type: "setEmail",
      payload: e.target.value,
    });
  };

  return (
    <>
      <form className={classes.container}>
        <Card className={classes.card}>
          <CardHeader className={classes.header} title="ForgotPassword" />
          <CardContent>
            <div>
              {error && <div>{error}</div>}
              {successMessage && <div>{successMessage}</div>}
              <TextField
                error={state.isError}
                fullWidth
                id="email"
                type="email"
                label="email"
                placeholder="Email"
                margin="normal"
                onChange={handleEmailChange}
                onKeyPress={handleKeyPress}
              />
            </div>
          </CardContent>
          パスワードを初期化する
          <CardActions>
            <Button
              onClick={handleSubmit(handleForgotPassword)}
              variant="contained"
              size="large"
              color="secondary"
              className={classes.signupBtn}
              disabled={state.isButtonDisabled}
            >
              ChangePassword
            </Button>
          </CardActions>
        </Card>
      </form>
    </>
  );
};
