"user client";
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/helper/supabaseCient";
import "../pages/sass/home.scss";
import { BsRocketTakeoff } from "react-icons/bs";
import { FaGithub } from "react-icons/fa";
import Rocket from "../assets/shuttle (1).png";

function Header() {
  const [user, setUser] = useState(null);
  const [avatarLink, setAvatarLink] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: currentUser, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error.message);
        return;
      }

      setUser(currentUser?.session?.user);
      setAvatarLink(currentUser?.session?.user?.user_metadata?.avatar_url);
      supabase.auth.onAuthStateChange((event, currentUser) => {
        switch (event) {
          case "INITIAL_SESSION":
            break;
          case "SIGNED_OUT":
            setUser(null);
            setAvatarLink(null);
            break;
          default:
        }
      });
    };
    fetchSession();
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
    await supabase.auth.signOut();
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleItemClick = (item) => {
    if (item == "logout") {
      logout();
    } else {
      console.log(`Clicked ${item}`);
    }
    setIsDropdownOpen(false);
  };

  return (
    <header className="h-[80px] flex items-center justify-between pl-5 pr-5 max-w-[1000px] w-full">
      <div className="flex gap-2">
        <h1 className="text-3xl">ChatDev</h1>
        <img src={Rocket} alt={Rocket} className="h-7 rocket" />
      </div>
      {user ? (
        <div className="relative">
          <button onClick={toggleDropdown}>
            <img
              src={avatarLink}
              className="h-10 w-10 rounded-full image-rendering-pixelated"
              alt="Avatar"
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 border rounded shadow-lg dropdown">
              <ul>
                <li className="w-28">
                  <button
                    onClick={() => handleItemClick("gc")}
                    className="block px-4 py-2 text-sm "
                  >
                    Make Chat
                  </button>
                </li>
                <li className="w-28">
                  <button
                    onClick={() => handleItemClick("logout")}
                    className="block px-4 py-2 text-sm "
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={login}
          className="p-3 login  h-7 w-[110px] rounded-md flex items-center justify-center gap-2"
        >
          <FaGithub />
          Login
        </button>
      )}
    </header>
  );
}

export default Header;
