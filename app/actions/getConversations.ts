import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversations = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }
  try {
    const conversation = await prisma.converstation.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        userIds: {
          has: currentUser?.id,
        },
      },
      include: {
        users: true,
        message: {
          include: {
            seender: true,
            seen: true,
          },
        },
      },
    });
    return conversation;
  } catch (error: any) {
    return [];
  }
};

export default getConversations;
