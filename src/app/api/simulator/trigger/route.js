import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Buat Admin Client khusus API Simulator (Bypass RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );

    const body = await request.json().catch(() => ({}));

    const customerName = body.customer_name || "Pak Ahmad";
    const customerPhone = body.customer_phone || "081234567890";
    const vehicleType = body.vehicle_type || "Motor Honda Beat 2020";
    const vehicleModel = body.vehicle_model || "2020 - Hitam";
    const problemDescription =
      body.problem_description ||
      "Ban belakang bocor & rantai lepas di dekat minimarket";
    const targetMechanicId = body.mechanic_id || null;

    let lat = body.lat || -6.2;
    let lng = body.lng || 106.816;

    // 1. Insert Customer Dummy
    const { data: customer } = await supabase
      .from("customers")
      .insert({
        name: customerName,
        phone: customerPhone,
      })
      .select()
      .single();

    // 2. Format PostGIS Point
    const pointWKT = `POINT(${lng} ${lat})`;

    // 3. Insert Service Request
    const { data: serviceRequest, error: requestErr } = await supabase
      .from("service_requests")
      .insert({
        customer_id: customer?.id || null,
        customer_name: customerName,
        customer_phone: customerPhone,
        vehicle_type: vehicleType,
        vehicle_model: vehicleModel,
        problem_description: problemDescription,
        customer_location: pointWKT,
        status: "PENDING",
      })
      .select()
      .single();

    if (requestErr) {
      return NextResponse.json(
        { success: false, error: requestErr.message },
        { status: 500 },
      );
    }

    // 4. Insert Notifikasi
    if (targetMechanicId) {
      await supabase.from("notifications").insert({
        mechanic_id: targetMechanicId,
        request_id: serviceRequest.id,
        type: "REQUEST_CREATED",
        title: "Bantuan Darurat Masuk!",
        message: `${customerName} (${vehicleType}): "${problemDescription}"`,
        is_read: false,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Simulasi Service Request berhasil ditrigger!",
      data: serviceRequest,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
