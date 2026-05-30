import { NextResponse } from "next/server";
import { rooms } from "@/data/rooms";

const getNights = (checkIn: string, checkOut: string) => {
  const difference = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return difference > 0 ? Math.ceil(difference / 86400000) : 0;
};

export async function POST(request: Request) {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json({ error: "Razorpay is not configured." }, { status: 500 });
  }

  const body = await request.json();
  const room = rooms.find((item) => item.id === body.roomId);
  const nights = getNights(body.checkIn, body.checkOut);
  const guests = Number(body.guests);

  if (!room || nights <= 0 || !Number.isFinite(guests) || guests < 1 || guests > room.maxGuests) {
    return NextResponse.json({ error: "Invalid booking details." }, { status: 400 });
  }

  const total = room.pricePerNight * nights;
  const amount = total * 100;
  const receipt = `walkerz_${Date.now()}`;
  const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      currency: "INR",
      receipt,
      notes: {
        roomId: room.id,
        roomName: room.name,
        guestName: body.guestName,
        email: body.email,
        checkIn: body.checkIn,
        checkOut: body.checkOut,
        guests: `${guests}`,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json({ error: data.error?.description ?? "Unable to create payment order." }, { status: response.status });
  }

  return NextResponse.json({
    orderId: data.id,
    amount: data.amount,
    currency: data.currency,
    total,
    nights,
  });
}
