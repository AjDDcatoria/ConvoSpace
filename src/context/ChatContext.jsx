import { supabase } from "@/lib/helper/supabaseCient";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

const ChatContext = createContext();

const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [groupChat, setGroupChat] = useState(
    JSON.parse(localStorage.getItem("groupchat"))
  );

  useEffect(() => {
    localStorage.setItem("groupchat", JSON.stringify(groupChat ?? null));
  }, [groupChat]);

  const getGroupChat = async () => {
    const { data, error } = await supabase
      .from("groupchat")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error);
      setGroupChat(null);
    }

    if (data) {
      setGroupChat(data);
    }
  };

  const createGroup = async (data) => {
    const icon = ["🤖", "👾", "👑", "👀", "😎", "🤩", "🥳"];
    const theme = [
      "theme-green",
      "theme-yellow",
      "theme-yellow",
      "theme-blue",
      "theme-violet",
    ];
    const iconIndex = Math.floor(Math.random() * 6 + 1);
    const themeIndex = Math.floor(Math.random() * 4 + 1);
    const response = await supabase.from("groupchat").insert([
      {
        user_id: currentUser?.id,
        title: data,
        user: currentUser?.display_name,
        avatar: currentUser?.avatar,
        icon: icon[iconIndex],
        theme: theme[themeIndex],
      },
    ]);
    console.log(response);
  };

  const deleteGroup = async (data) => {
    console.log("This Id want to delete", data);
    const response = await supabase.from("groupchat").delete().eq("id", data);

    if (response.status == 204) {
      console.log("delete Successfull");
    }
  };

  const getChat = async (id) => {
    const { data, error } = await supabase
      .from("groupchat")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert(error);
      return;
    }

    return data;
  };

  return (
    <ChatContext.Provider
      value={{ getGroupChat, groupChat, createGroup, getChat, deleteGroup }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export { ChatContext, ChatContextProvider };
