"use client";
import { Camera } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  armName: string;
  armId: 1 | 2;
  enabled?: boolean;
};

type OfferPayload = { sdp: string; type: RTCSdpType };
type AnswerPayload = { sdp: string; type: RTCSdpType };

export default function CameraCard({ armName, armId, enabled = true }: Props) {
  const [on, setOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const status = useMemo(() => {
    if (!enabled) return { label: "Unavailable", className: "text-gray-400" };
    if (error) return { label: "Error", className: "text-yellow-400" };
    return on
      ? { label: "Online", className: "text-green-400" }
      : { label: "Offline", className: "text-red-400" };
  }, [enabled, error, on]);

  useEffect(() => {
    return () => {
      try {
        pcRef.current?.close();
      } catch {
        // ignore
      } finally {
        pcRef.current = null;
        if (videoRef.current) videoRef.current.srcObject = null;
      }
    };
  }, []);

  async function start() {
    setError(null);

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
    });
    pcRef.current = pc;

    pc.ontrack = (event) => {
      const stream = event.streams[0];
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "failed" || pc.connectionState === "closed") {
        setOn(false);
      }
    };

    pc.addTransceiver("video", { direction: "recvonly" });

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const payload: OfferPayload = {
      sdp: pc.localDescription?.sdp ?? "",
      type: pc.localDescription?.type ?? "offer",
    };

    const res = await fetch(`/api/webrtc/offer?arm=${armId}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Offer failed (${res.status}). ${text ? `Response: ${text}` : ""}`.trim(),
      );
    }

    const answer = (await res.json()) as AnswerPayload;
    await pc.setRemoteDescription(
      new RTCSessionDescription({ sdp: answer.sdp, type: answer.type }),
    );
  }

  function stop() {
    setError(null);
    setOn(false);
    try {
      pcRef.current?.close();
    } catch {
      // ignore
    } finally {
      pcRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border-3 border-[#94BBE9] bg-gray-800/80 p-5 shadow-md shadow-gray-800">
      <div className="mb-2 flex shrink-0 items-center justify-between">
        <h2 className="flex items-center gap-2 font-semibold text-gray-200">
          <Camera size={30} className="text-blue-400" />
          {armName} Camera
        </h2>
        <span className={`text-lg ${status.className}`}>{status.label}</span>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center rounded-lg bg-black text-gray-500">
        {on ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover rounded-lg"
          />
        ) : enabled ? (
          error ? (
            <div className="p-3 text-sm text-yellow-300 text-center">{error}</div>
          ) : (
            "Camera is off"
          )
        ) : (
          "Camera not available"
        )}
      </div>

      <button
        type="button"
        className="mt-3 w-full shrink-0 rounded-lg bg-gray-500/80 py-2 transition enabled:hover:bg-green-600 disabled:opacity-50"
        onClick={async () => {
          if (!enabled) return;
          if (on) {
            stop();
            return;
          }
          setOn(true);
          try {
            await start();
          } catch (e) {
            stop();
            setError(e instanceof Error ? e.message : "Failed to start WebRTC.");
          }
        }}
        disabled={!enabled}
      >
        {!enabled ? "Unavailable" : on ? "Turn Off" : "Turn On"}
      </button>
    </div>
  );
}
