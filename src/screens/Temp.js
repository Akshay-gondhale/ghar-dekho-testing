
import style from "./Temp.module.css"
import imageCompression from 'browser-image-compression';
import { useState } from "react";
// import axios from "axios";
const Temp = () => {

    const [imageFile, setImageFile] = useState(null)
    const options = {
        maxWidthOrHeight: 500,
    }
    const compressFileData = async () => {
        if(imageFile !== null){

            const compressedFile = await imageCompression(imageFile, options);
            console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
            console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
            const subData = new FormData();
            subData.append("temp", compressedFile,compressedFile.name)
            console.log(compressedFile.name)
            
        }
    }
    compressFileData();
    return (
        <>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <h1 className={style.mainDiv}>Hii im temp</h1>
            <input type="file" onChange={(e)=>setImageFile(e.target.files[0])} />
        </>
    )
}

export default Temp;