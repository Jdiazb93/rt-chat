"use client";
import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const socket = io("http://localhost:3001");

interface MessageInterface {
  msg: string;
  user: UserInterface;
}

interface UserInterface {
  email: string;
  name: string;
  date: string;
  image?: string;
}

export default function LiveChat() {
  const [currentMsg, setCurrentMsg] = useState("");
  const [messages, setMessages] = useState<Array<MessageInterface>>([]);
  const { data: session } = useSession();

  //Use effect to get the last messages.
  useEffect(() => {
    socket.on("sendMessage", (msg: MessageInterface) => {
      console.log(msg);
      setMessages((prev) => [...prev, msg]);
    });
  }, [socket]);

  //Scroll to bottom when the last message was added.
  useEffect(() => {
    const messagesContainer = document.getElementById("messages-container");
    if (messagesContainer) {
      messagesContainer.scrollTo({
        behavior: "smooth",
        top: messagesContainer.scrollHeight,
      });
    }
  }, [messages]);

  //Function that send the msg to websocket
  const handlerMsg = async (e: any) => {
    e.preventDefault();
    await socket.emit("getMessage", {
      msg: currentMsg,
      user: {
        ...session?.user,
        date: new Date().toLocaleDateString("es-CL", {
          day: "2-digit",
          year: "numeric",
          month: "numeric",
          hour: "numeric",
          minute: 'numeric',
          second: 'numeric'
        }),
      },
    });
    setCurrentMsg("");
  };

  /**
   * Function to determinate if the message is from us or from another user
   * We aint use a collection of users or db, so the users cant sign to our system.
   * That's the why we use this function.
   * We only use the NextAuth to make sure that the user exist on google
   */
  const otherMsg = ({ user }: { user: UserInterface }) => {
    if (user.email === session?.user?.email) return true;
    return false;
  };

  return (
    <section className="flex justify-items-center items-end w-full h-[90vh]">
      <div className="mx-auto items-end w-1/3">
        <div
          id="messages-container"
          className="h-[80vh] bg-slate-300 w-full overflow-scroll rounded-t-xl"
        >
          {messages.map((msg, index) => {
            return (
              <span
                key={index}
                className={`${
                  otherMsg({ user: msg.user }) ? "justify-start" : "justify-end"
                } flex`}
              >
                <div
                  className={`flex items-center gap-x-3 px-4 py-2 w-auto max-w-[66%] ${
                    otherMsg({ user: msg.user })
                      ? "rounded-r-xl mb-3 bg-green-400"
                      : "rounded-l-xl mb-3 bg-slate-200"
                  }`}
                >
                  {otherMsg({ user: msg.user }) && msg.user.image && (
                    <img
                      src={msg.user.image}
                      alt="usr"
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <span
                    className={`${
                      otherMsg({ user: msg.user }) ? "text-start" : "text-end"
                    } w-full`}
                  >
                    <p className={`text-sm text-green-900`}>{msg.user.name}</p>
                    <p className="text-black">{msg.msg}</p>
                    <p className={`${otherMsg({ user: msg.user }) ? 'text-start' : 'text-end'} text-gray-400 text-sm`}>{msg.user.date}</p>
                  </span>
                  {!otherMsg({ user: msg.user }) && msg.user.image && (
                    <img
                      src={msg.user.image}
                      alt="usr"
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                </div>
              </span>
            );
          })}
        </div>
        <form onSubmit={handlerMsg}>
          <input
            value={currentMsg}
            placeholder="Send a message"
            onChange={(e) => setCurrentMsg(e.target.value)}
            className="border py-2 px-2 w-3/4"
          />
          <button
            type="submit"
            className="bg-sky-700 hover:bg-sky-500 transition duration-200 rounded px-4 py-2 w-1/4"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
