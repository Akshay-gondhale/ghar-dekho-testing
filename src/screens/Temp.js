import { useState } from "react";
import style from "./Temp.module.css"
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
const Temp = () => {
    const [files, setFiles] = useState(null)
    console.log(files)
    var myData = [];
    if (files !== null) {
        myData = Object.keys(files).map(key => {
            return files[key];
        })
    }
    console.log(myData)

    const arrowStyles = {
        position: 'absolute',
        zIndex: 2,
        top: 'calc(50% - 15px)',
        width: "3rem",
        height: "3rem",
        cursor: 'pointer',
        backgroundColor: "rgba(0,0,0,0.1)",
        border: "none",
        borderRadius: "50%",
        fontSize: "1.5rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#283747",
        outline: "none"
    };
    return (
        <>
            <div className={style.mainDiv}>
                <input type="file" onChange={(e) => setFiles(e.target.files)} multiple />
                <Carousel
                    infiniteLoop={true}
                    autoPlay={true}
                    interval={3000}
                    showStatus={false}
                    showThumbs={false}
                    renderArrowPrev={(onClickHandler, hasPrev, label) =>
                        hasPrev && (
                            <button type="button" onClick={onClickHandler} title={label} style={{ ...arrowStyles, left: 15 }}>
                                <i className="fas fa-caret-left"></i>
                            </button>
                        )
                    }
                    renderArrowNext={(onClickHandler, hasNext, label) =>
                        hasNext && (
                            <button type="button" onClick={onClickHandler} title={label} style={{ ...arrowStyles, right: 15 }}>
                                <i className="fas fa-caret-right"></i>
                            </button>
                        )
                    }
                >
                    {myData.length > 0 && myData.map((data, index) => {
                        return (
                            <div key={index} className={style.temp}>
                                <img src={URL.createObjectURL(data)} alt="..." />
                            </div>
                        )
                    })}
                    {/* <div className={style.temp}>
                            <img className={style.temp2} src="/images/modiji.jpg" alt="..."/>
                        </div>
                        <div className={style.temp}>
                            <img src="/images/modiji.jpg" alt="..."/>
                        </div>
                        <div className={style.temp}>
                            <img src="/images/temp.jpg" alt="..."/>
                        </div>
                        <div className={style.temp}>
                            <img src="/images/modiji.jpg" alt="..."/>
                        </div>
                        <div className={style.temp}>
                            <img src="/images/modiji.jpg" alt="..."/>
                        </div>
                        <div className={style.temp}>
                            <img src="/images/temp.jpg" alt="..."/>
                        </div> */}
                </Carousel>
            </div>
        </>
    )
}

export default Temp;