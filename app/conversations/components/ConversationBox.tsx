"use client";

import { FullConversationType } from "@/app/types";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Converstation, Message, User } from "@prisma/client";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import useOtherUser from "@/app/hooks/useOtherUser";

interface ConversationBoxProps {
  data: FullConversationType;
  selected: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  const otherUser = useOtherUser(data);

  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data.id, router]);

  const lastMessage = useMemo(() => {
    const message = data.message || [];

    return message[message.length - 1];
  }, [data.message]);

  const userEmail = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    if (!userEmail) {
      return false;
    }

    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [userEmail, lastMessage]);

  return <div></div>;
};

export default ConversationBox;
