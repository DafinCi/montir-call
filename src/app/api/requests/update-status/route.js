import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    const body = await request.json().catch(() => ({}));
    const { request_id, mechanic_id, status } = body;

    const validStatuses = ["ON_THE_WAY", "ARRIVED", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Status tidak valid! Gunakan salah satu dari: ${validStatuses.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // 1. Update status pekerjaan
    const { data: updatedRequest, error: updateErr } = await supabase
      .from("service_requests")
      .update({ status })
      .eq("id", request_id)
      .eq("assigned_mechanic_id", mechanic_id)
      .select()
      .single();

    if (updateErr || !updatedRequest) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Gagal memperbarui status. Pastikan request_id dan mechanic_id sudah sesuai.",
        },
        { status: 400 },
      );
    }

    // 2. Jika status COMPLETED atau CANCELLED, kembalikan status montir ke AVAILABLE
    if (status === "COMPLETED" || status === "CANCELLED") {
      await supabase
        .from("mechanics")
        .update({ status: "AVAILABLE" })
        .eq("id", mechanic_id);
    }

    return NextResponse.json({
      success: true,
      message: `Status pekerjaan berhasil diubah menjadi ${status}!`,
      data: updatedRequest,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
