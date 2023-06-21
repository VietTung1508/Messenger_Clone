"use client";

import Avatar from "@/app/components/Avatar";
import ImageModal from "@/app/components/ImageModal";
import { FullMessageType } from "@/app/types";
import { User } from "@prisma/client";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

interface messageBoxProps {
  isLast?: boolean;
  data: FullMessageType;
}

const MessageBox: React.FC<messageBoxProps> = ({ isLast, data }) => {
  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const isOwn = session?.data?.user?.email === data?.seender?.email;

  const seenList = (data.seen || [])
    .filter((user: User) => user.email !== data?.seender?.email)
    .map((user: User) => user.name)
    .join(", ");

  const container = clsx(
    `
    flex gap-3 p-4
    `,
    isOwn && "justify-end"
  );

  const avatar = clsx(isOwn && "order-2");

  const body = clsx(
    `
  flex flex-col gap-2`,
    isOwn && "items-end"
  );

  const message = clsx(
    `text-sm w-fit overflow-hidden`,
    isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
    data.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
  );

  return (
    <>
      <ImageModal
        src={data.image}
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
      />
      <div className={container}>
        <div className={avatar}>
          <Avatar user={data.seender} />
        </div>
        <div className={body}>
          <div className="flex items-center gap-1">
            <div className="text-sm text-gray-500">{data.seender.name}</div>
            <div className="text-sx text-gray-400">
              {format(new Date(data.createdAt), "p")}
            </div>
          </div>
          <div className={message}>
            {data.image ? (
              <Image
                onClick={() => setImageModalOpen(true)}
                alt="img"
                height="288"
                width="288"
                src={data.image}
                className="object-cover cursor-pointer hover:scale-110 transition translate"
              />
            ) : (
              <div>{data.body}</div>
            )}
          </div>
          {isLast && isOwn && seenList.length > 0 && (
            <div className="text-xs font-light text-gray-500">{`Seen by ${seenList}`}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default MessageBox;
