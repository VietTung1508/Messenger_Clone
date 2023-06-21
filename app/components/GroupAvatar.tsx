"use client";

import { User } from "@prisma/client";
import Image from "next/image";

interface GroupAvatarProps {
  users?: User[];
}

const GroupAvatar: React.FC<GroupAvatarProps> = ({ users = [] }) => {
  const sliceUsers = users.slice(0, 3);

  const positionMap = {
    0: "top-0 left-[12px]",
    1: "bottom-0",
    2: "bottom-0 right-0",
  };

  return (
    <div className="relative h-11 w-11">
      {sliceUsers.map((user, i) => (
        <div
          key={i}
          className={`absolute inline-block rounded-full overflow-hidden h-[21px] w-[21px] ${
            positionMap[i as keyof typeof positionMap]
          }`}
        >
          <Image
            src={user?.image || "/images.placeholder.jpg"}
            alt="avatar"
            fill
          />
        </div>
      ))}
    </div>
  );
};

export default GroupAvatar;
