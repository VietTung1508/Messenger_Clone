import { Converstation, Message, User } from "@prisma/client";

export type FullMessageType = Message & {
  seender: User;
  seen: User[];
};

export type FullConversationType = Converstation & {
  users: User[];
  message: FullMessageType[];
};
