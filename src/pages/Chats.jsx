import { ChatContext } from "@/context/ChatContext";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBackOutline, IoSend } from "react-icons/io5";
import { AuthContext } from "@/context/AuthContext";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { supabase } from "@/lib/helper/supabaseCient";

function Chats() {
  const { currentUser } = useContext(AuthContext);
  const { deleteGroup } = useContext(ChatContext);
  const [isOwner, setIsOwner] = useState(false);
  const [chat, setChat] = useState(null);
  const { getChat } = useContext(ChatContext);
  const { id } = useParams();
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const [textMessage, setTextMessage] = useState("");
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchChat = async () => {
      const result = await getChat(id);
      setChat(result);
      if (currentUser?.id === result?.user_id) {
        setIsOwner(true);
      }
    };

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("message")
        .select("*,users(avatar,display_name)")
        .eq("groupchat_id", id)
        .order("created_at", { ascending: true });

      if (error) {
        console.log(error);
      } else {
        setMessages(data);
      }
    };

    const handleInserts = (payload) => {
      fetchMessages();
      scrollToBottom();
    };

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "message" },
        handleInserts
      )
      .subscribe();

    fetchChat();
    fetchMessages();

    return () => {
      channel.unsubscribe();
    };
  }, [id, currentUser, getChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDelete = async () => {
    await deleteGroup(id);
    setShow(false);
    handleBack();
  };

  const handleInputChange = (event) => {
    setTextMessage(event.target.value);
  };

  const handleSentMessage = async () => {
    const newMessage = {
      user_id: currentUser?.id,
      groupchat_id: id,
      text: textMessage,
    };
    const { error } = await supabase.from("message").insert([newMessage]);

    if (error) {
      console.log(error);
    } else {
      setTextMessage("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSentMessage();
    }
  };

  return (
    <>
      <div className="max-w-[700px] w-full gap-1 items-center p-2 h-screen flex flex-col">
        <div className="header h-[60px] max-w-[650px] w-full flex items-center justify-between chat-header pr-5">
          <div className="flex gap-2 items-center fadeIn">
            <IoArrowBackOutline
              size={"25px"}
              className="cursor-pointer"
              onClick={handleBack}
            />
            {chat?.avatar && (
              <img src={chat.avatar} className="h-[35px] rounded-full fadeIn" />
            )}
            <div className="flex flex-col fadeIn">
              <h1 className="fadeIn">{chat?.title}</h1>
              <span className="text-[10px] text-green-500 fadeIn">
                {chat?.user}
              </span>
            </div>
          </div>
          {isOwner === true ? (
            <Button variant="danger" onClick={handleShow}>
              Delete
            </Button>
          ) : (
            <></>
          )}
        </div>
        <div className="h-full flex flex-col overflow-auto gap-2 chat-content max-w-[600px] flex-1 w-full text-slate-500 p-3">
          <div className="flex-1"></div>
          {messages &&
            messages.map((message, index) => {
              return (
                <div className="flex gap-2 fadeIn" key={index}>
                  <div className="">
                    <img
                      src={message?.users?.avatar}
                      className="bg-green-500 h-9 w-9 rounded-full"
                    ></img>
                  </div>
                  <div className="rounded-lg flex flex-col cursor-pointer">
                    <div className="flex gap-1 text-green-500 text-sm">
                      <span className="text-[10px]">
                        {message?.users?.display_name}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-300 w-fit">
                      {message?.text}
                    </p>
                  </div>
                </div>
              );
            })}
          <div ref={messagesEndRef}></div>
        </div>
        {currentUser && (
          <div className="footer h-[45px] w-full max-w-[600px] flex items-center justify-between gap-3 chat-footer pr-3">
            <textarea
              type="text"
              value={textMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="send message"
              className="bg-transparent message-input w-full h-full pt-[8px] pl-3 text-sm resize-none overflow-auto rounded-md"
            />
            <IoSend
              size={34}
              id="message-sent"
              cursor={"pointer"}
              onClick={handleSentMessage}
            />
          </div>
        )}
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body className="modal-create">
          <Modal.Title>Warning ⚠️</Modal.Title>
          Are you sure you want to delete?<span className="text-2xl">😪</span>
        </Modal.Body>
        <Modal.Footer className="modal-create">
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Chats;
