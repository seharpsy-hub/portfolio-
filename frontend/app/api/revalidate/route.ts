import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/site/[siteSlug]/[pageSlug]", "page");
    revalidatePath("/admin", "layout");
    return NextResponse.json({
      ok: true,
      cleared_at: new Date().toISOString(),
      message: "Next.js cache revalidated",
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: String(err) },
      { status: 500 }
    );
  }
}
