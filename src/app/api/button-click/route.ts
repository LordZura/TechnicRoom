import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const buttonId = body?.buttonId;
    const path = body?.path ?? null;
    const locale = body?.locale ?? null;

    if (typeof buttonId !== "string" || !buttonId) {
      return NextResponse.json({ ok: false, error: "Missing buttonId" }, { status: 400 });
    }

    const { error } = await supabase.rpc("increment_button_click", {
      p_button_id: buttonId,
      p_path: path,
      p_locale: locale,
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}