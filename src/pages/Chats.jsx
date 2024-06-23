import { ChatContext } from "@/context/ChatContext";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBackOutline, IoSend } from "react-icons/io5";
import { AuthContext } from "@/context/AuthContext";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function Chats() {
  const { currentUser } = useContext(AuthContext);
  const { deleteGroup } = useContext(ChatContext);
  const [isOwner, setIsOwner] = useState(false);
  const [chat, setChat] = useState(null);
  const { getChat } = useContext(ChatContext);
  const { id } = useParams();
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const result = await getChat(id);
      setChat(result);
      if (currentUser?.id == result?.user_id) {
        setIsOwner(true);
      }
    };
    fetch();
  }, []);

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

  return (
    <>
      <div className="max-w-[700px] w-full gap-1 items-center p-2 h-screen flex flex-col">
        <div className="header h-[60px] max-w-[650px] w-full flex items-center justify-between chat-header pr-5">
          <div className="flex gap-2 items-center">
            <IoArrowBackOutline
              size={"20px"}
              className="cursor-pointer"
              onClick={handleBack}
            />
            {chat?.avatar && (
              <img src={chat.avatar} className="h-[35px] rounded-full" />
            )}
            <div className="flex flex-col">
              <h1>{chat?.title}</h1>
              <span className="text-[10px] text-green-500">{chat?.user}</span>
            </div>
          </div>
          {/* Show the button only if the current user is the owner of the chat */}
          {isOwner === true ? (
            <Button variant="danger" onClick={handleShow}>
              Delete
            </Button>
          ) : (
            <></>
          )}
        </div>
        <div className="content chat-content max-w-[600px] w-full flex-1 flex items-center justify-center text-3xl text-slate-500">
          Coming Soon...
        </div>
        {currentUser && (
          <div className="footer h-[45px] w-full max-w-[600px] flex items-center justify-between gap-4 chat-footer pr-2">
            <textarea
              type="text"
              placeholder="Message"
              className="bg-transparent message-input w-full h-full pt-[8px] pl-3 resize-none overflow-auto rounded-md"
            />
            <IoSend size={30} id="message-sent" cursor={"pointer"} />
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
