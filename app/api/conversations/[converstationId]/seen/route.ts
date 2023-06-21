import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
  converstationId?: string;
}

export async function POST(req: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();

    const { converstationId } = params;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const conversation = await prisma.converstation.findUnique({
      where: {
        id: converstationId,
      },
      include: {
        message: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });

    if (!conversation) {
      return new NextResponse("Invalid Id", { status: 400 });
    }

    const lastMessage = conversation.message[conversation.message.length - 1];

    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    const updateMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        seender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    await pusherServer.trigger(currentUser.email, "conversation:update", {
      id: converstationId,
      message: [updateMessage],
    });

    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(conversation);
    }

    await pusherServer.trigger(
      converstationId!,
      "message:update",
      updateMessage
    );

    return NextResponse.json(updateMessage);
  } catch (error: any) {
    console.log(error, "ERROR_MESSAGE_SEEN");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
