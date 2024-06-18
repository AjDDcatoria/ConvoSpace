import React, { useEffect, useState } from "react";

function Groups() {
  const [groupChat, setGroupChat] = useState([]);

  useEffect(() => {
    fetch("/data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setGroupChat(data.groupChat);
      })
      .catch((error) => console.error("Error fetching the JSON data:", error));
  }, []);

  return (
    <section className="max-w-[1000px] w-full grid p-7">
      {groupChat.map((item, index) => (
        <a
          href="/#"
          key={index}
          className={`${item.chat.theme} bg-gray-900 flex flex-col gap-2 relative cursor-pointer rounded before:rounded`}
        >
          <div className="flex gap-2">
            <span className="absolute right-3 top-[-20px] text-3xl">
              {item.chat.icon}
            </span>
            <img src={item.chat.avatar} className="h-11 rounded-full" />
            <div>
              <p className="text-sm">{item.chat.user}</p>
              <p className="created text-slate-400">Online</p>
            </div>
          </div>
          <div>
            <p className="text-xl">{item.chat.title}</p>
          </div>
        </a>
      ))}
    </section>
  );
}

export default Groups;
