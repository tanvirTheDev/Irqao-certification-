import { google } from "googleapis";
import { NextRequest } from "next/server";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_RANGE = "Sheet1";

async function getSheetData() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: SHEET_RANGE,
  });

  return response.data.values;
}

export async function GET(
  req: NextRequest,
  context: { params: { registrationNo: string } }
) {
  try {
    const { registrationNo } = await context.params; // Await context.params
    const rows = await getSheetData();
    if (!rows || rows.length === 0) {
      return new Response(JSON.stringify({ found: false }), { status: 404 });
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);
    const match = dataRows.find((row) => row[0] === registrationNo);

    if (match) {
      const user: Record<string, string> = {};
      headers.forEach((header, idx) => {
        user[header] = match[idx];
      });
      return new Response(JSON.stringify({ found: true, data: user }), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ found: false }), { status: 404 });
    }
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal Server Error", detail: err }),
      { status: 500 }
    );
  }
}
