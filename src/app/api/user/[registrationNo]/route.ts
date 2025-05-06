import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

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

type Params = {
  params: {
    registrationNo: string;
  };
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ registrationNo: string }> }
) {
  try {
    const { registrationNo } = await context.params;
    const rows = await getSheetData();

    if (!rows || rows.length === 0) {
      return NextResponse.json({ found: false }, { status: 404 });
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);
    const match = dataRows.find((row) => row[0] === registrationNo);

    if (match) {
      const user: Record<string, string> = {};
      headers.forEach((header, idx) => {
        user[header] = match[idx];
      });

      return NextResponse.json({ found: true, data: user });
    }

    return NextResponse.json({ found: false }, { status: 404 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error", detail: `${err}` },
      { status: 500 }
    );
  }
}
