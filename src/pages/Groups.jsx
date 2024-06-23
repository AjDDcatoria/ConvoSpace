import { ChatContext } from "@/context/ChatContext";
import React, { useContext, useEffect } from "react";

function Groups() {
  const { groupChat, getGroupChat } = useContext(ChatContext);

  useEffect(() => {
    getGroupChat();
  }, []);

  return (
    <>
      <section className="max-w-[1000px] grid p-7 w-full pr-10">
        {groupChat &&
          groupChat.map((item, index) => (
            <a
              href={`chat/${item.id}`}
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
    </>
  );
}

export default Groups;
