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
    const { data: sessionData } = await supabase.auth.getSession();

    if (sessionData?.session) {
      const userEmail = sessionData?.session?.user?.email;

      const { data: userResult } = await supabase
        .from("users")
        .select()
        .eq("email", userEmail)
        .single();

      if (userResult) {
        setCurrentUser(userResult);
      } else {
        const newUser = {
          display_name: sessionData?.session?.user?.user_metadata.user_name,
          email: userEmail,
          avatar: sessionData?.session?.user?.user_metadata?.avatar_url,
          user_id: sessionData?.session?.user?.id,
        };

        const { data: insertData } = await supabase
          .from("users")
          .insert([newUser]);

        if (insertData) {
          const { data: newUserResult, error: newUserError } = await supabase
            .from("users")
            .select()
            .eq("email", userEmail)
            .single();

          if (newUserError) {
            console.error(newUserError);
            return;
          }
          setCurrentUser(newUserResult);
        }
      }

      supabase.auth.initialize(currentUser);

      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event == "SIGNED_OUT") {
          removeUser();
        } else {
          supabase.auth.setSession(session?.user?.user_metadata);
        }
      });
    }
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
