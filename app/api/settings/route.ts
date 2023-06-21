import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();

    const { name, image } = body;

    if (!currentUser?.id) {
      return new NextResponse("Unauthoried", { status: 401 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser?.id,
      },
      data: {
        name,
        image,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (err: any) {
    console.log(err, "ERROR_SETTINGS");
    return new NextResponse("ERROR_SETTINGS", { status: 500 });
  }
}
