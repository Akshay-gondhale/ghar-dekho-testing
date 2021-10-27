
import { useHistory, useParams } from "react-router-dom"
import PrimaryButton from "../../components/Buttons/PrimaryButton"
import style from "./ChatScreen.module.css"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { io } from "socket.io-client";
import { ImageUrl, SocketUrl } from "../../utils/BaseApi";
import { initChatRoom, insertNewMsg } from "../../redux/actions/ChatDataAction"
import ScrollableFeed from 'react-scrollable-feed'
import { toast } from "react-toastify"
import imageCompression from "browser-image-compression"
import { motion } from "framer-motion"
const ChatScreen = () => {

    const { id } = useParams();
    const history = useHistory()


    const chatData = useSelector(state => state.ChatDataReducer)
    const [isChatLoading, setIsChatLoading] = useState(false)
    const userId = useSelector(state => state.AuthReducer.user._id)

    const [socketInstance, setSocketInstance] = useState(null)
    const [messageText, setMessageText] = useState("")

    const [isImgPreview, setIsImgPreviewOpen] = useState(false);
    const [image, setImage] = useState(null);
    const [imgCaption, setImgCaption] = useState("")

    //loading

    const [sendMsgLoading, setSendMsgLoading] = useState(false)
    const [imageProcessLoading, setImageProcessLoading] = useState(false)


    const dispatch = useDispatch();
    useEffect(() => {
        setIsChatLoading(true)
        const socket = io.connect(`${SocketUrl}/chat`);
        setSocketInstance(socket)
        socket.emit("broker-join-room", { id, brokerId: userId }, (res) => {
            console.log(res)
            if (res.status === "404") {
                history.push("/conversation")
            }
            else {
                dispatch(initChatRoom(res, setIsChatLoading))
            }
            // dispatch(setChatRooms(res, setIsChatLoading))
        })

        socket.on("newMessage", (data) => {
            dispatch(insertNewMsg(data))
            socket.emit("broker-seen", { id: data.chatRoomId }, (res) => {
                console.log(res)
            })
        })

        return () => {
            socket.disconnect();
        }
    }, [history, id, userId, dispatch])

    const sendMsg = () => {
        if (messageText.trim() !== "") {
            setSendMsgLoading(true)
            socketInstance.emit("broker-newMsg", {
                message: messageText.trim(),
                fileUrl: null,
                userId: chatData.data.userId,
                chatRoomId: chatData.data._id,
                brokerId: chatData.data.brokerId,
                msgType: "text"
            }, (res) => {
                if (res.status === "ok") {
                    setSendMsgLoading(false)
                }
                else {
                    console.log(res)
                    setSendMsgLoading(false)
                    toast.error("Something went wrong..!")
                }
            })
            setMessageText("")

        }
    }

    const closeImgPreview = () => {
        setImage(null)
        setImgCaption("")
        setIsImgPreviewOpen(false)
    }

    const imageSelector = async (e) => {
        e.preventDefault()
        if (e.target.files.length > 0 && (e.target.files[0].type === "image/jpeg" || e.target.files[0].type === "image/png")) {
            setIsImgPreviewOpen(true)
            setImageProcessLoading(true)
            const options = {
                maxSizeMB: 1,
                useWebWorker: true
            }
            var ImageBlob = await imageCompression(e.target.files[0], options)
            console.log(ImageBlob)
            setImage(ImageBlob)
            setImageProcessLoading(false)
        }
        else if (image === null && e.target.files.length === 0) {
            toast.error("Please select a image!😔")
        }
        else if (e.target.files.length > 0 && (e.target.files[0].type !== "image/jpeg" || e.target.files[0].type !== "image/png")) {
            toast.error("Please select a image!😔")
        }
    }

    const textAreaStyle = {
        maxHeight: "2.6rem",
        minHeight: "2.6rem",
        resize: "none",
        width: "95%",
        border: "none",
        outline: "none",
        borderRadius: ".2rem",
        boxSizing: "border-box",
        fontSize: "15px",
        lineHeight: "1rem",
        padding: ".8rem 0rem",
        whiteSpace: "pre-line"
    };

    const sendFileMsg = () => {
        setSendMsgLoading(true)
        console.log("send file msg clicked")
        socketInstance.emit("broker-newMsg-file", {
            message: imgCaption.trim(),
            blobData: image,
            fileName: image.name,
            userId: chatData.data.userId,
            chatRoomId: chatData.data._id,
            brokerId: chatData.data.brokerId,
            msgType: "file"
        }, (res) => {
            if (res.status === "ok") {
                setSendMsgLoading(false)
                setImage(null)
                setImgCaption("")
                setIsImgPreviewOpen(false)

            }
            else {
                setSendMsgLoading(false)
                toast.error("some thing went wrong.! can't send message")
            }
        })
    }

    const months = [
        "Jan", "Feb",
        "Mar", "Apr", "May",
        "Jun", "Jul", "Aug",
        "Sept", "Oct",
        "Nov", "Dec"
    ];
    return (
        <>

            <div className={style.mainDiv}>
                {isChatLoading ?

                    <div className={style.spinnerWrapper}>
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    :
                    <div className={style.mainChatContainer}>
                        {isImgPreview &&

                            <div className={style.imagePreview}>
                                {imageProcessLoading
                                    ?
                                    <div className={style.imagePreviewMainDiv}>
                                        <div className="spinner-border text-success" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>

                                    </div>
                                    :
                                    <>
                                        <i onClick={() => closeImgPreview()} className={"fas fa-times-circle " + style.imgPreviewClose}></i>
                                        <div className={style.imagePreviewMainDiv}>
                                            {image !== null ? <img src={URL.createObjectURL(image)} alt="..." /> : ""}
                                            <div className={style.captionAndSendWrapper}>
                                                <input className={style.imgCaptionInput} placeholder="Caption" value={imgCaption} onChange={(e) => { setImgCaption(e.target.value) }} type="text" />
                                                {
                                                    sendMsgLoading
                                                        ?
                                                        <div className="spinner-border text-success" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                        :
                                                        <div onClick={() => sendFileMsg()}>
                                                            <PrimaryButton heading='<i class="fas fa-paper-plane"></i>' />
                                                        </div>
                                                }
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>
                        }
                        <div className={style.infoDiv}>
                            {chatData.data.propertyId !== null &&
                                <>
                                    <span className={style.headingTitle}>Title</span>
                                    <p className={style.propertyTitle}>{chatData.data.propertyId.title}</p>
                                    <span className={style.headingTitle}>Description</span>
                                    <p className={style.propertyDesc}>{chatData.data.propertyId.description}</p>
                                    <span className={style.headingTitle}>Ammount</span>
                                    <p className={style.sellOrRent}>{chatData.data.propertyId.sellOrRent}: {chatData.data.propertyId.ammount}</p>
                                    <span className={style.headingTitle}>Home Id</span>
                                    <p>{chatData.data.propertyId.shortId}</p>
                                </>
                            }
                        </div>
                        <div className={style.chatScreen}>
                            {
                                chatData.messages.length === 0
                                    ?

                                    <div className={style.NoMessages}>
                                        <img src="/images/no_messages.svg" alt="..." />
                                        <p>Say "Hii 👋🏻" to {chatData.data.propertyId !== null && chatData.data.propertyId.title}'s broker. We will respond you as soon as possible!</p>
                                    </div>
                                    :
                                    <ScrollableFeed className={style.messagesWrapper}>
                                        {
                                            chatData.messages.slice(0).reverse().map((data, index, arrayData) => {
                                                const isUser = !(data.userId === data.senderId);
                                                const isFirstMessage = index > 0 ? data.senderId !== arrayData[index - 1].senderId : true;

                                                // time stamp
                                                var utcDate = new Date(data.createdAt);
                                                var hour = utcDate.getHours() === 0 ? 12 : (utcDate.getHours() > 12 ? utcDate.getHours() - 12 : utcDate.getHours());
                                                var min = utcDate.getMinutes() < 10 ? '0' + utcDate.getMinutes() : utcDate.getMinutes();
                                                var ampm = utcDate.getHours() < 12 ? 'AM' : 'PM';
                                                var time = hour + ':' + min + ' ' + ampm;


                                                var isSameDate = index > 0 ? new Date(data.createdAt).getDate() !== new Date(arrayData[index - 1].createdAt).getDate() : true;

                                                return (
                                                    <div key={index}>
                                                        {
                                                            isSameDate &&
                                                            <div className={style.centerDivWrapper}>
                                                                <p className={style.dateStyle}>{`${new Date(data.createdAt).getDate()} ${months[new Date(data.createdAt).getMonth()]} ${new Date(data.createdAt).getFullYear()}`}</p>
                                                            </div>
                                                        }
                                                        {
                                                            data.msgType === "text"
                                                                ?
                                                                <motion.div
                                                                    // framer motion animation
                                                                    animate={{ x: 0, y: 0, opacity: 1 }} initial={isUser ? { x: 20, y: 5, opacity: 0 } : { x: -20, y: 5, opacity: 0 }} transition={{ duration: .2 }}
                                                                    key={index}
                                                                    // class as per sender id 
                                                                    className={!isUser ? style.leftMsgContainer : style.rightMsgContainer}>
                                                                    <p className={!isUser ? (isFirstMessage ? style.leftMsg + " " + style.firstLeftMsg : style.leftMsg) : (isFirstMessage ? style.rightMsg + " " + style.firstRightMsg : style.rightMsg)}>
                                                                        {data.message}
                                                                        <span className={style.msgTime}>{time}</span>
                                                                    </p>
                                                                </motion.div>
                                                                :

                                                                <a target="_blank" rel="noreferrer" href={`${ImageUrl}${data.fileUrl}`} key={index}>
                                                                    <motion.div

                                                                        // framer motion animation
                                                                        animate={{ x: 0, y: 0, opacity: 1 }} initial={isUser ? { x: 20, y: 5, opacity: 0 } : { x: -20, y: 5, opacity: 0 }} transition={{ duration: .2 }}

                                                                        className={!isUser ? (isFirstMessage ? style.left_chatImgWrapper + " " + style.firstLeftMsg : style.left_chatImgWrapper) : (isFirstMessage ? style.right_chatImgWrapper + " " + style.firstRightMsg : style.right_chatImgWrapper)}>
                                                                        <img className={style.chatImg} src={`${ImageUrl}${data.fileUrl}`} alt={"/images/modiji.jpg"} />
                                                                        {data.message !== "" && <p className={style.right_chatImgCaption}>{data.message}</p>}
                                                                        <span className={style.msgTime}>{time}</span>
                                                                    </motion.div>
                                                                </a>
                                                        }
                                                    </div>
                                                )

                                            })
                                        }
                                    </ScrollableFeed>

                            }
                            <form className={style.inputSection}>
                                {chatData.data._id !== null && chatData.messages.length !== 0 &&
                                    <div className={style.selectFileStyle}>
                                        <i className="fas fa-paperclip"></i>
                                        <input value="" onChange={(e) => imageSelector(e)} accept=".jpeg, .jpg, .png" className={style.hiddenInputSelect} type="file" />

                                    </div>}
                                <div className={style.textareaWrapper}>
                                    <textarea
                                        style={textAreaStyle}
                                        placeholder="Type a message"
                                        rows={1}
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                    />
                                </div>
                                <div className={style.sendBtn}>
                                    {sendMsgLoading
                                        ?
                                        <div className="spinner-border text-success" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        :
                                        <div onClick={() => sendMsg()} >
                                            <PrimaryButton heading='<i class="fas fa-paper-plane"></i>' />
                                        </div>
                                    }
                                </div>
                            </form>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default ChatScreen;