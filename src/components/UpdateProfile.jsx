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

let initState = {
  displayName: "",
  isButtonDisabled: true,
  helperText: "",
  isError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setDisplayName":
      return {
        ...state,
        displayName: action.payload,
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

export const UpdateProfile = () => {
  const classes = useStyles();
  const { currentUser, updateDisplayName } = useAuth();
  const { handleSubmit } = useForm();
  const [state, dispatch] = useReducer(reducer, initState);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  currentUser.displayName
    ? (initState = { ...initState, displayName: currentUser.displayName })
    : (initState = { ...initState, displayName: "" });

  const handleUpdateProfile = async (data) => {
    try {
      setError("");
      setSuccessMessage("");
      dispatch({
        type: "setIsButtonDisabled",
        payload: true,
      });

      if (state.displayName !== currentUser.displayName) {
        const profileData = {
          displayName: state.displayName,
        };
        await updateDisplayName(profileData);
      }
      dispatch({
        type: "signupSuccess",
        payload: "Update Successfully",
      });
      dispatch({
        type: "setIsButtonDisabled",
        payload: false,
      });
      setSuccessMessage("プロフィールが更新できました");
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

  useEffect(() => {
    if (state.displayName) {
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
  }, [state.displayName]);

  const handleDisplayNameChange = (e) => {
    dispatch({
      type: "setDisplayName",
      payload: e.target.value,
    });
  };

  return (
    <div>
      <form className={classes.container}>
        <Card className={classes.card}>
          <CardHeader className={classes.header} title="Update" />
          <CardContent>
          {successMessage && <div>{successMessage}</div>}
            <div>
              <TextField
                error={state.isError}
                fullWidth
                type="text"
                label="現在の名前"
                disabled={true}
                value={
                  currentUser.displayName
                    ? currentUser.displayName
                    : "名前を決めていません"
                }
                margin="normal"
              />
              <TextField
                error={state.isError}
                fullWidth
                id="displayName"
                name="displayName"
                type="text"
                label="表示名"
                placeholder="ハンドル名を入力してください"
                margin="normal"
                value={state.displayName}
                onChange={handleDisplayNameChange}
              />
            </div>
          </CardContent>
          プロフィール更新
          <CardActions>
            <Button
              onClick={handleSubmit(handleUpdateProfile)}
              variant="contained"
              size="large"
              color="secondary"
              className={classes.signupBtn}
              disabled={state.isButtonDisabled}
            >
              Update
            </Button>
          </CardActions>
        </Card>
      </form>
    </div>
  );
};
