"use client";

import { FullMessageType } from "@/app/types";
import { useRef, useState, useEffect } from "react";
import useConverstation from "@/app/hooks/useConverstation";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface bodyProps {
  initialMessage: FullMessageType[];
}

const Body: React.FC<bodyProps> = ({ initialMessage }) => {
  const [messages, setMessages] = useState(initialMessage);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { converstationId } = useConverstation();

  useEffect(() => {
    axios.post(`/api/conversations/${converstationId}/seen`);
  }, [converstationId]);

  useEffect(() => {
    pusherClient.subscribe(converstationId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${converstationId}/seen`);

      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message];
      });

      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }

          return currentMessage;
        })
      );
    };

    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("messsage:update", updateMessageHandler);

    // You must be unbind and unsubcribe every time you unmouth

    return () => {
      pusherClient.unsubscribe(converstationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [converstationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div ref={bottomRef} className="pt-4" />
    </div>
  );
};

export default Body;
