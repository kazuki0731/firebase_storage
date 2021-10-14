import { LinearProgress, Typography } from "@material-ui/core";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const UpLoadTest = () => {
  const [image, setImage] = useState("");
  // submit関数内のアップロード実装の引数に渡すためにstateで管理する
  const [imageUrl, setImageUrl] = useState("");
  //ダウンロードURL
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(100);
  // アップロードの進行状態を管理する

  // ファイルを選択したときの処理
  const handleImage = (e) => {
    const image = e.target.files[0];
    setImage(image);
    setError("");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (image === "") {
      setError("ファイルが選択されていません");
      return;
    }
    // ファイルが選択されていなければ終了

    const storageRef = ref(storage, "images/image.jpg");
    // アップする時にfirebase側でどういうファイル名/画像名で保存するかを書く
    const uploadTask = uploadBytesResumable(storageRef, image);
    // 選択したファイルデータをstateで管理したimageに格納しているので、それを引数として渡す

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // snapshotにはアップロードの進行状況データが格納されており、進行具合を%で表示させる
        const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(percent);
      },
      (error) => {
        console.log("err", error);
        setError("アップに失敗しました" + error);
        setProgress(100);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
        });
      }
    );
  };

  return (
    <>
      upload
      {error && <div>{error}</div>}
      <Link to="/dashboard" />
      <form onSubmit={onSubmit}>
        <input type="file" onChange={handleImage} />
        <button onClick={onSubmit}>Upload</button>
      </form>
      {progress !== 100 && <LinearProgressWithLabel value={progress} />}
      {imageUrl && (
        <>
          <img width="400px" src={imageUrl} alt="uploaded" />
        </>
      )}
    </>
  );
};

const LinearProgressWithLabel = (props) => {
  console.log(props, {...props});
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
        {/*{value: 0} を受け取っている ??なぜ props ではなく {...props}なのかは不明 */}
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
};
