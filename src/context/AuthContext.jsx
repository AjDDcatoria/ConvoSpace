import { supabase } from "@/lib/helper/supabaseCient";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser ?? null));
  }, [currentUser]);

  const setUser = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error(error);
      return;
    }
    setCurrentUser(data?.session?.user?.user_metadata);
    supabase.auth.initialize(currentUser);
    supabase.auth.onAuthStateChange(async (event, currentUser) => {
      switch (event) {
        case "SIGNED_IN":
          await supabase.auth.setSession(currentUser);
          break;
        case "SIGNED_OUT":
          removeUser();
          break;
        default:
      }
    });
  };

  const removeUser = async () => {
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ currentUser, setUser, removeUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
