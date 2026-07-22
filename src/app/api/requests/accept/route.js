import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    const body = await request.json().catch(() => ({}));
    const { request_id, mechanic_id } = body;

    if (!request_id || !mechanic_id) {
      return NextResponse.json(
        { success: false, error: "request_id dan mechanic_id wajib diisi!" },
        { status: 400 },
      );
    }

    // 1. Atomic Update Query (Anti Race Condition: HANYA jika status PENDING)
    const { data: updatedRequest, error: updateErr } = await supabase
      .from("service_requests")
      .update({
        status: "ACCEPTED",
        assigned_mechanic_id: mechanic_id,
      })
      .eq("id", request_id)
      .eq("status", "PENDING")
      .select()
      .single();

    if (updateErr || !updatedRequest) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Gagal menerima pekerjaan. Order ini mungkin sudah diambil oleh montir lain atau statusnya bukan PENDING.",
        },
        { status: 400 },
      );
    }

    // 2. Ubah status montir menjadi BUSY
    await supabase
      .from("mechanics")
      .update({ status: "BUSY" })
      .eq("id", mechanic_id);

    return NextResponse.json({
      success: true,
      message: "Pekerjaan berhasil diterima (ACCEPTED)!",
      data: updatedRequest,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
