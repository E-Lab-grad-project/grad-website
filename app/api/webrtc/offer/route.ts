import { NextResponse } from "next/server";

type OfferBody = {
  sdp: string;
  type: string;
};

type AnswerBody = {
  sdp: string;
  type: string;
};

function getArmOfferUrl(arm: string | null): string | null {
  if (arm === "1") return process.env.WEBRTC_OFFER_URL_ARM1 ?? null;
  if (arm === "2") return process.env.WEBRTC_OFFER_URL_ARM2 ?? null;
  return null;
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const arm = url.searchParams.get("arm");
  const offerUrl = getArmOfferUrl(arm);

  if (!offerUrl) {
    return NextResponse.json(
      {
        error:
          "Missing or unsupported arm, or WEBRTC_OFFER_URL_ARMx not configured.",
      },
      { status: 400 },
    );
  }

  let body: OfferBody;
  try {
    body = (await request.json()) as OfferBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body?.sdp || !body?.type) {
    return NextResponse.json(
      { error: "Body must include { sdp, type }." },
      { status: 400 },
    );
  }

  const upstreamRes = await fetch(offerUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ sdp: body.sdp, type: body.type }),
    cache: "no-store",
  });

  if (!upstreamRes.ok) {
    const text = await upstreamRes.text().catch(() => "");
    return NextResponse.json(
      { error: "Upstream /offer failed.", status: upstreamRes.status, text },
      { status: 502 },
    );
  }

  const answer = (await upstreamRes.json()) as AnswerBody;
  if (!answer?.sdp || !answer?.type) {
    return NextResponse.json(
      { error: "Upstream returned invalid answer." },
      { status: 502 },
    );
  }

  return NextResponse.json(answer);
}

