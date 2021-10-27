import { useDispatch, useSelector } from "react-redux";
import style from "./Conversation.module.css"
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { setChatRooms } from "../../redux/actions/ConversationDataAction";
import { SocketUrl } from "../../utils/BaseApi";
import { Link } from "react-router-dom";
const Conversation = () => {


    const conversationStateData = useSelector(state => state.ConversationDataReducer)


    const [isChatLoading, setIsChatLoading] = useState(true)
    const [chatRoomType, setChatRoomType] = useState("newMessage")

    const userId = useSelector(state => state.AuthReducer.user._id)
    console.log(userId)
    const dispatch = useDispatch();
    useEffect(() => {
        setIsChatLoading(true)
        const socket = io.connect(`${SocketUrl}/chat-rooms`);
        socket.emit("get-broker-chatrooms", { brokerId:userId }, (res) => {
            console.log(res)
            dispatch(setChatRooms(res, setIsChatLoading))
        })

        socket.on("broker-chatrooms-updates", (data, callback) => {
            setIsChatLoading(true)
            console.log("chatroom update called from server")
            dispatch(setChatRooms(data, setIsChatLoading))
            callback({
                status: "ok",
                message: "Latest chat rooms updates received to client side..!"
            })
        })
        return () => {
            socket.disconnect();
        }

    }, [userId, dispatch])



    return (
        <>
            <div className={style.mainDiv}>
                <div className={style.topSection}>
                    <li onClick={() => setChatRoomType("newMessage")} className={chatRoomType === "newMessage" ? style.activeTopSectionElement : style.topSectionElement}><p>New Messages</p> <i className="fas fa-comments"></i></li>
                    <li onClick={() => setChatRoomType("oldMessage")} className={chatRoomType === "oldMessage" ? style.activeTopSectionElement : style.topSectionElement}><p>Old Conversation</p> <i className="fas fa-clock"></i></li>
                </div>
                <div className={chatRoomType === "newMessage" ? style.visible : style.hidden}>
                    {
                        isChatLoading
                            ?

                            <div className={style.spinnerWrapper}>
                                <div className="spinner-border text-success" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                            :
                            !isChatLoading && conversationStateData.newMessage.data.length > 0
                                ?
                                <div className={style.chatRoomsWrapper}>
                                    {conversationStateData.newMessage.data.map((data, index) => {
                                        return (

                                            <Link to={`/chats/${data._id}`} key={index} className={style.chatRoom}>

                                                <div className={style.userIconWrapper}>
                                                    <i className="fas fa-user-circle"></i>
                                                </div>
                                                <div className={style.dataDiv}>
                                                    <p className={style.heading}>{data.userId.name}-{data.propertyId.title}</p>
                                                    <p className={style.lastMsg}>{data.lastMsg.userId === data.lastMsg.senderId ? "User: " : "You: "}{data.lastMsg.msgType !== "text" ? "Photo" : ""}{data.lastMsg.msgType !== "text" && data.lastMsg.message !== "" ? "(" + data.lastMsg.message + ")" : data.lastMsg.message}</p>
                                                </div>
                                            </Link>
                                        )

                                    })}
                                </div>
                                :
                                !isChatLoading && conversationStateData.newMessage.data.length === 0 &&
                                <div className={style.noChatRoom}>
                                    <img src="/images/chat-bg.svg" alt="..." />
                                    <p>No new messages yet.!</p>
                                </div>
                    }
                </div>
                <div className={chatRoomType === "oldMessage" ? style.visible : style.hidden}>
                    {
                        isChatLoading
                            ?

                            <div className={style.spinnerWrapper}>
                                <div className="spinner-border text-success" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                            :
                            !isChatLoading && conversationStateData.oldMessage.data.length > 0
                                ?
                                <div className={style.chatRoomsWrapper}>
                                    {conversationStateData.oldMessage.data.map((data, index) => {
                                        return (

                                            <Link to={`/chats/${data._id}`} key={index} className={style.chatRoom}>
                                                <div className={style.userIconWrapper}>
                                                    <i className="fas fa-user-circle"></i>
                                                </div>
                                                <div className={style.dataDiv}>
                                                    <p className={style.heading}>{data.userId.name}-{data.propertyId.title}</p>
                                                    <p className={style.lastMsg}>{data.lastMsg.userId === data.lastMsg.senderId ? "User: " : "You: "}{data.lastMsg.msgType !== "text" ? "Photo" : ""}{data.lastMsg.msgType !== "text" && data.lastMsg.message !== "" ? "(" + data.lastMsg.message + ")" : data.lastMsg.message}</p>

                                                </div>
                                            </Link>
                                        )

                                    })}
                                </div>
                                :
                                !isChatLoading && conversationStateData.oldMessage.data.length === 0 &&
                                <div className={style.noChatRoom}>
                                    <img src="/images/chat-bg.svg" alt="..." />
                                    <p>No old conversation room found here.!</p>
                                </div>
                    }
                </div>

            </div>
        </>
    )
}

export default Conversation;