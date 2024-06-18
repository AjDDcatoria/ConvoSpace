import { supabase } from "@/lib/helper/supabaseCient";
import React, { useEffect, useState } from "react";

function Groups() {
  const [groupChat, setGroupChat] = useState([]);
  const [fetcError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchGroupChat = async () => {
      const { data, error } = await supabase.from("groupchat").select("*");

      if (error) {
        setFetchError("Error fetching");
        setGroupChat(null);
      }

      if (data) {
        setGroupChat(data);
        setFetchError(null);
      }
    };

    fetchGroupChat();
  }, [setGroupChat]);

  return (
    <section className="max-w-[1000px] grid p-7 w-full">
      {groupChat &&
        groupChat.map((item, index) => (
          <a
            href="/#"
            key={index}
            className={`${item?.theme} bg-gray-900 flex flex-col gap-2 relative cursor-pointer rounded before:rounded`}
          >
            <div className="flex gap-2">
              <span className="absolute right-3 top-[-20px] text-3xl icon">
                {item?.icon}
              </span>
              <img src={item?.avatar} className="h-11 rounded-full" />
              <div>
                <p className="text-sm">{item?.user}</p>
                <p className="created text-slate-400">Online</p>
              </div>
            </div>
            <div>
              <p className="text-xl">{item?.title}</p>
            </div>
          </a>
        ))}
    </section>
  );
}

export default Groups;
