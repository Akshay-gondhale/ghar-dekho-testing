
import { useHistory, useParams } from "react-router-dom"
import PrimaryButton from "../../components/Buttons/PrimaryButton"
import style from "./ChatScreen.module.css"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { io } from "socket.io-client";
import { ImageUrl, SocketUrl } from "../../utils/BaseApi";
import { firstMsgInit, initChatRoom, insertNewMsg } from "../../redux/actions/ChatDataAction"
import ScrollableFeed from 'react-scrollable-feed'
import { toast } from "react-toastify"
import imageCompression from "browser-image-compression"
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
        socket.emit("user-join-room", { id, userId }, (res) => {
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
            socket.emit("user-seen", { id: data.chatRoomId }, (res) => {
                console.log(res)
            })
        })
    }, [history, id, userId, dispatch])

    const sendMsg = () => {
        if (messageText.trim() !== "") {
            setSendMsgLoading(true)
            if (chatData.data._id === null && chatData.messages.length === 0) {
                console.log("initiating room...")
                socketInstance.emit("user-init-room", {
                    message: messageText.trim(),
                    fileUrl: null,
                    userId: chatData.data.userId,
                    propertyId: chatData.data.propertyId._id,
                    brokerId: chatData.data.brokerId,
                    msgType: "text"
                }, (res) => {
                    if (res.status === "ok") {
                        setSendMsgLoading(false)
                        console.log(res)
                        dispatch(firstMsgInit(res, setIsChatLoading))
                    }
                    else {
                        console.log(res)
                        setSendMsgLoading(false)
                        toast.error("Something went wrong..!")
                    }
                })
                setMessageText("")
            }
            else {

                socketInstance.emit("user-newMsg", {
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
    }

    const closeImgPreview = () => {
        setImage(null)
        setImgCaption("")
        setIsImgPreviewOpen(false)
    }

    const imageSelector = async (e) => {
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
        padding: ".8rem 1rem",
        whiteSpace: "pre-line"
    };

    const sendFileMsg = () => {
        setSendMsgLoading(true)
        console.log("send file msg clicked")
        socketInstance.emit("user-newMsg-file", {
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
                closeImgPreview()
            }
            else {
                setSendMsgLoading(false)
                toast.error("some thing went wrong.! can't send message")
            }
        })
    }
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
                                            chatData.messages.slice(0).reverse().map((data, index) => {
                                                const isUser = data.userId === data.senderId;
                                                return (
                                                    <div key={index}>
                                                        {
                                                            data.msgType === "text"
                                                                ?
                                                                <div key={index} className={!isUser ? style.leftMsgContainer : style.rightMsgContainer}>
                                                                    <p className={!isUser ? style.leftMsg : style.rightMsg}>{data.message}</p>
                                                                </div>
                                                                :

                                                                <a target="_blank" rel="noreferrer" href={`${ImageUrl}${data.fileUrl}`} key={index} className={style.rightMsgContainer}>
                                                                    <div className={style.right_chatImgWrapper}>
                                                                        <img className={style.chatImg} src={`${ImageUrl}${data.fileUrl}`} alt="/images/modiji.jpg" />
                                                                        {data.message !== "" && <p className={style.right_chatImgCaption}>{data.message}</p>}
                                                                    </div>
                                                                </a>
                                                        }
                                                    </div>
                                                )

                                            })
                                        }
                                    </ScrollableFeed>

                            }
                            <div className={style.inputSection}>
                                {chatData.data._id !== null && chatData.messages.length !== 0 &&
                                    <div className={style.selectFileStyle}>
                                        <i className="fas fa-paperclip"></i>
                                        <input onChange={(e) => imageSelector(e)} accept=".jpeg, .jpg, .png" className={style.hiddenInputSelect} type="file" />

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
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default ChatScreen;