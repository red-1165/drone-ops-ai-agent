import { NextResponse } from "next/server";

import fs from "fs";
import path from "path";
import Papa from "papaparse";

// ---------- CSV Loader ----------

function loadCSV(name: string) {
  const filePath = path.join(process.cwd(), "data", name);
  const file = fs.readFileSync(filePath, "utf8");

  return Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
  }).data;
}

// ---------- GET: Fetch Data ----------

export async function GET() {
  try {
    const pilots = loadCSV("pilot_roster.csv");
    const drones = loadCSV("drone_fleet.csv");
    const missions = loadCSV("missions.csv");

    return NextResponse.json({
      pilots,
      drones,
      missions,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to load CSV data" },
      { status: 500 }
    );
  }
}

// ---------- POST: Chat / Agent ----------

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message;

    if (!message) {
      return NextResponse.json({
        reply: "Please send a valid message.",
      });
    }

    // Load data
    const pilots = loadCSV("pilot_roster.csv");
    const drones = loadCSV("drone_fleet.csv");
    const missions = loadCSV("missions.csv");

    let reply = "I'm not sure how to help with that yet.";

    // Normalize text
    const msg = message.toLowerCase();

    // ---- PILOTS ----
    if (
      msg.includes("pilot") ||
      msg.includes("pilots") ||
      msg.includes("crew")
    ) {
      const available = pilots.filter(
      (p: any) =>
        String(p.status).toLowerCase() === "available"
    );


      reply = `There are ${available.length} available pilots out of ${pilots.length}.`;
    }

    // ---- DRONES ----
    else if (
      msg.includes("drone") ||
      msg.includes("drones") ||
      msg.includes("uav")
    ) {
      reply = `There are ${drones.length} drones in the fleet.`;
    }

    // ---- MISSIONS ----
    else if (
      msg.includes("mission") ||
      msg.includes("missions") ||
      msg.includes("project")
    ) {
      reply = `There are ${missions.length} missions currently registered.`;
    }

    // ---- REASSIGNMENT ----
    else if (
      msg.includes("reassign") ||
      msg.includes("urgent") ||
      msg.includes("replace") ||
      msg.includes("emergency")
    ) {
      reply =
        "Check the Reassignment tab to view available backup pilots and drones.";
    }

    // ---- HELP ----
    else if (
      msg.includes("help") ||
      msg.includes("support") ||
      msg.includes("what can you do")
    ) {
      reply =
        "You can ask me about pilots, drones, missions, conflicts, or reassignment options.";
    }

    // ✅ IMPORTANT: RETURN
    return NextResponse.json({
      reply,
    });

  } catch (err) {
    console.error("Agent POST error:", err);

    return NextResponse.json(
      {
        reply: "Agent encountered an internal error.",
      },
      { status: 500 }
    );
  }
}
