
import PrimaryButton from "../components/Buttons/PrimaryButton"
import style from "./Temp.module.css"
// import { io } from "socket.io-client";
// import { useSelector } from "react-redux";
const Temp = () => {

    // const userId = useSelector(state=>state.AuthReducer.user._id)

    // const socket = io.connect("http://localhost:4000/chat-rooms", {query:`userId=${userId}`});

    // socket.on("latest-chat", (data, callback)=>{
    //     console.log(data)
    //     callback({
    //         status:"ok",
    //         msg:"latest chat received to client side..!"
    //     })
    // })





    return (
        <>
            <div className={style.mainDiv}>
                <div className={style.mainChatContainer}>
                    <div className={style.infoDiv}>

                    </div>
                    <div className={style.chatScreen}>
                        <div className={style.messagesWrapper}>
                            <div className={style.leftMsgContainer}>
                                <p className={style.leftMsg}>Left Message Left Message Left Message Left Message Left Message Left Message Left Message Left Message Left Message Left Message Left Message Left Message Left Message </p>
                            </div>
                            <div className={style.rightMsgContainer}>
                                <p className={style.rightMsg}>Left Message Left Message Left Message Left Message Left Message Left Message Left Message Left Message Left Message Left Message Left Message Left Message Left Message Left Message Left Message Left Message Left Message Left Message Left Message </p>
                            </div>
                            <div className={style.leftMsgContainer}>
                                <p className={style.leftMsg}>Left Message</p>
                            </div>
                            <div className={style.rightMsgContainer}>
                                <p className={style.rightMsg}>Right Message</p>

                            </div>
                            <div className={style.rightMsgContainer}>
                                <p className={style.rightMsg}>Right Message</p>

                            </div>
                            <div className={style.leftMsgContainer}>
                                <p className={style.leftMsg}>Left Message</p>
                            </div>
                            <div className={style.leftMsgContainer}>
                                <p className={style.leftMsg}>Left Message</p>
                            </div>
                            <div className={style.leftMsgContainer}>
                                <p className={style.leftMsg}>Left Message</p>
                            </div>
                            <div className={style.rightMsgContainer}>
                                <p className={style.rightMsg}>Right Message</p>

                            </div>
                            <div className={style.leftMsgContainer}>
                                <p className={style.leftMsg}>Left Message</p>
                            </div>
                            <div className={style.rightMsgContainer}>
                                <p className={style.rightMsg}>Right Message</p>

                            </div>
                            <div className={style.leftMsgContainer}>
                                <p className={style.leftMsg}>Left Message</p>
                            </div>
                            <div className={style.rightMsgContainer}>
                                <p className={style.rightMsg}>Right Message</p>

                            </div>
                            <div className={style.leftMsgContainer}>
                                <p className={style.leftMsg}>Left Message</p>
                            </div>
                            <div className={style.rightMsgContainer}>
                                <p className={style.rightMsg}>Right Message</p>

                            </div>
                            <div className={style.leftMsgContainer}>
                                <p className={style.leftMsg}>Left Message</p>
                            </div>
                            <div className={style.rightMsgContainer}>
                                <p className={style.rightMsg}>Right Message</p>

                            </div>
                            <div className={style.leftMsgContainer}>
                                <p className={style.leftMsg}>Left Message</p>
                            </div>
                            <div className={style.rightMsgContainer}>
                                <p className={style.rightMsg}>Right Message</p>

                            </div>
                            <div className={style.leftMsgContainer}>
                                <p className={style.leftMsg}>Left Message</p>
                            </div>
                            <div className={style.rightMsgContainer}>
                                <p className={style.rightMsg}>Right Message</p>

                            </div>
                            <div className={style.leftMsgContainer}>
                                <p className={style.leftMsg}>Left Message</p>
                            </div>
                            <div className={style.rightMsgContainer}>
                                <p className={style.rightMsg}>Right Message</p>

                            </div>
                            <div className={style.leftMsgContainer}>
                                <p className={style.leftMsg}>Left Message</p>
                            </div>
                            <div className={style.rightMsgContainer}>
                                <p className={style.rightMsg}>Right Message</p>

                            </div>
                            <div className={style.rightMsgContainer}>
                                <div className={style.right_chatImgWrapper}>
                                    <img className={style.chatImg} src="/images/modiji.jpg" alt="..." />
                                    <p className={style.right_chatImgCaption}>Hello World</p>
                                </div>
                            </div>
                            <div className={style.leftMsgContainer}>
                                <div className={style.left_chatImgWrapper}>
                                    <img className={style.chatImg} src="/images/modiji.jpg" alt="..." />
                                    <p className={style.left_chatImgCaption}>Hello World</p>
                                </div>
                            </div>

                        </div>
                        <div className={style.inputSection}>
                            <div className={style.selectFileStyle}>
                                <i className="fas fa-paperclip"></i>
                                <input className={style.hiddenInputSelect} type="file" />

                            </div>
                            <input className={style.msgInput} placeholder="Enter message" />
                            <div className={style.sendBtn}>
                                <PrimaryButton heading='Send <i class="fas fa-paper-plane"></i>' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Temp;