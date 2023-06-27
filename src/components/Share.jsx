import {useContext, useRef, useState} from "react";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import {MdPermMedia} from "react-icons/md";
import Intercept from "../Tools/refrech";
import axios from "axios";
import {AuthContext} from "../contexts/AuthContext/AuthContext";
import {NotificationManager} from "react-notifications";
import {JPEGImageFormatStrategy} from "./Patterns/ImageFormatStrategy"
import {PNGImageFormatStrategy} from "./Patterns/ImageFormatStrategy"
import {ImageFormatStrategy} from "./Patterns/ImageFormatStrategy"


function Share(props) {
  const navigate = useNavigate();
  const desc = useRef();
  const hash = useRef();
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState("");
  const axiosJWT = axios.create();
  Intercept(axiosJWT);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleOptionChange = (event) => {
    setFormat(event.target.value);
  };

  const submitHandler = async (e) => {


    e.preventDefault();
    e.currentTarget.disabled = true;
    let formDataInfo = {};
    formDataInfo.description = desc.current.value;
    formDataInfo.hashtags = hash.current.value;
    try {
      if (file) {



        let formatStrategy;

        if (format==="JPEG") {
          formatStrategy = new JPEGImageFormatStrategy();
        } else if (format==="PNG") {
          formatStrategy = new PNGImageFormatStrategy();
        }else {
          formatStrategy = new ImageFormatStrategy();
        }

        const img = await uploadImageWithFormat(file, formatStrategy);
        console.log('File uploaded successfully!');
        console.log(img)



        formDataInfo.url = img;
        formDataInfo.authorId =user.userId;
        formDataInfo.authorUsername =user.username;
        formDataInfo.format = "jpg";

        console.log(formDataInfo)

        await axiosJWT.post("http://localhost:5000/api/Photo", formDataInfo, {
          headers: { Authorization: "Bearer " + user.accessToken },
        });
        NotificationManager.success("Success", "Post has been created", 3000);
        props.hideAddPostHandler();
        navigate(`/home`);
      } else {
        e.currentTarget.disabled = false;
        throw new Error("No file !!");
      }
    } catch (e) {
      console.log(e)
      NotificationManager.warning("Warning", "Photo is required", 3000);
    }
  };

  async function uploadImageWithFormat(file, formatStrategy) {
    const formattedImage =await formatStrategy.execute(file);
    const containerUrl = 'https://algebrastorage.blob.core.windows.net/images';
    const sasToken = 'sp=racwdli&st=2023-06-01T09:12:28Z&se=2023-07-01T17:12:28Z&sv=2022-11-02&sr=c&sig=M8CxwCqX%2FoyM5w5CVn7QCe6rRN2tO2j2f44%2FrfBbQ9M%3D';

    const fileName = file.name.split('.').slice(0, -1).join('.');
    console.log(formattedImage)
    const uploadUrl = `${containerUrl}/${fileName}?${sasToken}`;


    const img = await axios.put(uploadUrl, formattedImage, {
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': formattedImage.type,
      },
    });
    console.log(img.request.responseURL)
    return img.request.responseURL
  }


    return (
    <ShareContainer>
      <div className="shareWrapper">
        <div className="shareTop">
          <input
            placeholder={"Description"}
            className="shareInput"
            ref={desc}
            required
          />
        </div>
        <hr className="shareHr" />
        <div className="shareTop">
          <input
              placeholder={"Hashtags"}
              className="shareInput"
              ref={hash}
              required
          />
        </div>
        <hr className="shareHr" />
        <form className="shareBottom">
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <MdPermMedia className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                /*onChange={(e) => setFile(e.target.files[0])}*/
                onChange={handleFileUpload}
              />
            </label>
          </div>
          <div style={{display: "flex"}}>
          Format:
            <label className="formatLabel">
              <input
                  className="formatRadio"
                  type="radio"
                  value="PNG"
                  checked={format === "PNG"}
                  onChange={handleOptionChange}
              />
              PNG
            </label>
            <label className="formatLabel">
              <input
                  className="formatRadio"
                  type="radio"
                  value="JPEG"
                  checked={format === "JPEG"}
                  onChange={handleOptionChange}
              />
              JPEG
            </label>

          </div>
          <button className="shareButton" onClick={submitHandler} type="submit">
            Share
          </button>
        </form>
      </div>
    </ShareContainer>
  );
}

const ShareContainer = styled.div`
  width: 100%;
  border-radius: 10px;
  -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  .shareWrapper {
    padding: 10px;
    /* border: solid #5b6dcd 1px; */
    margin: 10px;
  }
  .shareTop {
    display: flex;
    align-items: center;
  }
  .shareInput {
    border: none;
    width: 100%;
  }
  .shareInput:focus {
    outline: none;
  }
  .shareHr {
    margin: 20px;
  }
  .shareBottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .shareOptions {
    display: flex;
    margin-left: 20px;
  }
  .shareOption {
    display: flex;
    align-items: center;
    margin-right: 15px;
    cursor: pointer;
  }
  .shareIcon {
    font-size: 18px;
    margin-right: 3px;
  }
  .shareOptionText {
    font-size: 14px;
    font-weight: 500;
  }
  .shareButton {
    border: none;
    padding: 7px;
    border-radius: 5px;
    background-color: #1872f2;
    font-weight: 500;
    margin-right: 20px;
    cursor: pointer;
    color: white;
  }
  /* Style the radio buttons */
  .formatRadio {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 16px;
    height: 16px;
    border: 2px solid #ccc;
    border-radius: 50%;
    outline: none;
    margin-right: 5px;
    vertical-align: middle;
    position: relative;
    top: -1px;
  }

  /* Style the radio buttons when checked */
  .formatRadio:checked {
    background-color: #2196f3;
    border-color: #2196f3;
  }

  /* Style the labels */
  .formatLabel {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    margin-left: 15px;
    cursor: pointer;
  }

  /* Style the text next to the radio buttons */
  .formatLabel span {
    font-size: 16px;
  }

`;

export default Share;

