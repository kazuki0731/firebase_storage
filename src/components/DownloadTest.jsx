import { LinearProgress, Typography } from "@material-ui/core";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const DownloadTest = () => {
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const handleDownload = () => {
    getDownloadURL(
      ref(
        storage,
        "gs://learn-firebase-masalib-16cb9.appspot.com/images/image.jpg"
      )
    ).then((url) => {
      setImageUrl(url);
    });
  };

  return (
    <>
      <button onClick={handleDownload}>ダウンロード</button>
      upload
      {error && <div>{error}</div>}
      {imageUrl && (
        <>
          <img width="400px" src={imageUrl} alt="uploaded" />
        </>
      )}
    </>
  );
};
