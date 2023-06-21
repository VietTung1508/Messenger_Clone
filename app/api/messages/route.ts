import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();

    const { message, image, conversationId } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const newMessage = await prisma.message.create({
      include: {
        seen: true,
        seender: true,
      },
      data: {
        body: message,
        image: image,
        conversation: {
          connect: { id: conversationId },
        },
        seender: {
          connect: { id: currentUser.id },
        },
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    const updatedConversation = await prisma.converstation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        message: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        message: {
          include: {
            seen: true,
          },
        },
      },
    });

    await pusherServer.trigger(conversationId, "messages:new", newMessage);

    // Pusher.trigger take 3 parameter ('channel', 'my-event', 'callback')

    // Channel is the channel where user currently on if they listening on that channel they can get update when this trigger update

    const lastMessage =
      updatedConversation.message[updatedConversation.message.length - 1];

    updatedConversation.users.map((user) => {
      pusherServer.trigger(user.email!, "conversation:update", {
        id: conversationId,
        message: [lastMessage],
      });
    });

    return NextResponse.json(newMessage);
  } catch (error: any) {
    console.log(error, "ERROR");
    return new NextResponse("InternalError", { status: 500 });
  }
}
