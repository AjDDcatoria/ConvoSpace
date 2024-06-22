import React, { useContext, useEffect, useState } from "react";
import { supabase } from "../lib/helper/supabaseCient";
import "../pages/sass/home.scss";
import { FaGithub } from "react-icons/fa";
import Dropdown from "react-bootstrap/Dropdown";
import Title from "@/components/Title";
import Modal from "@/components/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { AuthContext } from "@/context/AuthContext";

function Header() {
  const [modalShow, setModalShow] = useState(false);
  const { setUser, removeUser, currentUser } = useContext(AuthContext);
  const [title, setTitle] = useState("");

  useEffect(() => {
    setUser();
  }, []);

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: window.location.origin + "/",
      },
    });
  };

  const logout = async () => {
    const response = await supabase.auth.signOut();
    removeUser();
    window.location.reload();
    if (response.error) alert(response.error);
  };

  const handleSubmit = () => {
    console.log("Input Value:", title);
    setModalShow(false);
    setTitle("");
  };
  const handleInputChange = (event) => {
    setTitle(event.target.value);
  };

  return (
    <>
      <header className="h-[100px] flex items-center  justify-between pl-5 pr-5 max-w-[1000px] w-full">
        <div className="flex gap-2 flex-col mt-8 text-wrap">
          <Title />
          <div>
            <p className="text-green-400">
              Create or join Chat<span className="text-2xl">🥳</span>
            </p>
          </div>
        </div>
        {currentUser ? (
          <Dropdown className="bg-transparent border-0 rounded-full">
            <Dropdown.Toggle
              id="dropdown-basic"
              className="bg-transparent border-0"
            >
              {currentUser?.user_name ?? currentUser?.full_name}
            </Dropdown.Toggle>

            <Dropdown.Menu className="modal-menu">
              <Dropdown.Item onClick={() => setModalShow(true)}>
                Create Chat
              </Dropdown.Item>
              <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <button
            onClick={login}
            className="p-3 login h-10 w-[120px] rounded-md flex items-center justify-center gap-2"
          >
            <FaGithub />
            Login
          </button>
        )}
      </header>
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        heading={"Create Chat🥳"}
        title={"Title"}
        submitfunc={handleSubmit}
      >
        <InputGroup className="mb-3 bg-transparent">
          <Form.Control
            className="bg-transparent text-white"
            placeholder="Title"
            aria-label="Title"
            value={title}
            onChange={handleInputChange}
            aria-describedby="basic-addon1"
          />
        </InputGroup>
      </Modal>
    </>
  );
}

export default Header;
