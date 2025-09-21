import React, { useRef, useState, useEffect } from "react";

import Button from "./Button";
import "./ImageUpload.css";
import { preinit } from "react-dom";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const fileRef = useRef();

  useEffect(() => {
    if(!file){
        return ;
    }
    const fileReader = new FileReader(); // Baked into browser and browser side JS
    fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
    }; // Run whenever fileReader reads a new file, run this instead of a callback
    fileReader.readAsDataURL(file);

  }, [file]);

  const pickImageHandler = () => {
    fileRef.current.click();
  };

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      fileIsValid = true;
      setIsValid(true); // Schedules state update, doesn't update state immediately hence we need fileIsValid
    } else {
      fileIsValid = false;
      setIsValid(false);
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  return (
    <div className="form-control">
      <input
        ref={fileRef}
        id={props.id}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          Pick Image
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
