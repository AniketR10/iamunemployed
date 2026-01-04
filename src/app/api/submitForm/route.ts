import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formLink = process.env.GOOGLE_FORM_LINK;
  if (!formLink) {
    return new NextResponse("Please configure the env variables", {
      status: 500,
    });
  }

  const fieldIdName = process.env.GOOGLE_FORM_FIELD_ID_NAME;
  const fieldIdEmail = process.env.GOOGLE_FORM_FIELD_ID_EMAIL;
  const fieldIdMessage = process.env.GOOGLE_FORM_FIELD_ID_MESSAGE;

  try {
    const body = await req.json();
    const { name, message, email } = body;

    const res = await fetch(
      `${formLink}/formResponse?${fieldIdName}=${name}&${fieldIdEmail}=${email}&${fieldIdMessage}=${message}`
    );

    return NextResponse.json("Success!");
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
