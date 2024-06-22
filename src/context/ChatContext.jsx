import { supabase } from "@/lib/helper/supabaseCient";
import { createContext, useEffect, useState } from "react";

const ChatContext = createContext();

const ChatContextProvider = ({ children }) => {
  const [groupChat, setGroupChat] = useState(
    JSON.parse(localStorage.getItem("groupchat"))
  );

  useEffect(() => {
    localStorage.setItem("groupchat", JSON.stringify(groupChat ?? null));
  }, [groupChat]);

  const getGroupChat = async () => {
    const { data, error } = await supabase.from("groupchat").select("*");

    if (error) {
      alert(error);
      setGroupChat(null);
    }

    if (data) {
      setGroupChat(data);
    }
  };

  return (
    <ChatContext.Provider value={{ getGroupChat, groupChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export { ChatContext, ChatContextProvider };
