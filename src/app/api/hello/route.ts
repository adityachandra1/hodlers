import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  if (!name) {
    return NextResponse.json(
      { message: "Missing name" },
      { status: 400 }
    );
  }
    // Do whatever you want
    return NextResponse.json({ message: `Hello, ${name}!` }, { status: 200 });
}

