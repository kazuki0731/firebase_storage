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
  password: "",
  passwordConfirm: "",
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
    case "setPassword":
      return {
        ...state,
        password: action.payload,
      };
    case "setPasswordConfirm":
      return {
        ...state,
        passwordConfirm: action.payload,
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

export const Login = () => {
  const classes = useStyles();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [state, dispatch] = useReducer(reducer, initState);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (state.email.trim() && state.password.trim()) {
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
  }, [state.email, state.password]);

  const handleSignup = async (data) => {
    try {
      setError("");
      setSuccessMessage("");
      dispatch({
        type: "setIsButtonDisabled",
        payload: true,
      });
      await login(state.email, state.password);
      dispatch({
        type: "signupSuccess",
        payload: "Login Successfully",
      });
      dispatch({
        type: "setIsButtonDisabled",
        payload: false,
      });
      setSuccessMessage("ログインに成功しました");
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
      state.isButtonDisabled || handleSignup();
    }
  };

  const handleEmailChange = (e) => {
    dispatch({
      type: "setEmail",
      payload: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    dispatch({
      type: "setPassword",
      payload: e.target.value,
    });
  };

  const handlePasswordConfirmChange = (e) => {
    dispatch({
      type: "setPasswordConfirm",
      payload: e.target.value,
    });
  };

  return (
    <div>
      <form className={classes.container}>
        <Card className={classes.card}>
          <CardHeader className={classes.header} title="Login" />
          <CardContent>
            <div>
              {error && <div>{error}</div>}
              {successMessage && <div>{successMessage}</div>}
              <TextField
                error={state.isError}
                fullWidth
                {...register("email", {
                  maxLength: {
                    value: 12,
                    message: "12文字以内にしてください",
                  },
                })}
                id="email"
                type="email"
                label="email"
                placeholder="Email"
                margin="normal"
                onChange={handleEmailChange}
                onKeyPress={handleKeyPress}
              />
              {errors.email && errors.email.message}
              <TextField
                error={state.isError}
                fullWidth
                name="password"
                id="password"
                type="password"
                label="Password"
                placeholder="Password"
                margin="normal"
                helperText={state.helperText}
                onChange={handlePasswordChange}
                onKeyPress={handleKeyPress}
              />
            </div>
          </CardContent>
          <CardActions>
            <Button
              onClick={handleSubmit(handleSignup)}
              variant="contained"
              size="large"
              color="secondary"
              className={classes.signupBtn}
              disabled={state.isButtonDisabled}
            >
              Login
            </Button>
          </CardActions>
        </Card>
      </form>
    </div>
  );
};
