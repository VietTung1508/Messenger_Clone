import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
  converstationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { converstationId } = params;

    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingConversation = await prisma.converstation.findUnique({
      where: {
        id: converstationId,
      },
      include: {
        users: true,
      },
    });

    if (!existingConversation) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const deletedConversation = await prisma.converstation.deleteMany({
      where: {
        id: converstationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    existingConversation?.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(
          user.email,
          "conversation:delete",
          existingConversation
        );
      }
    });

    return NextResponse.json(deletedConversation);
  } catch (error: any) {
    console.log(error, "ERROR_CONVERSATION_DELETE");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
