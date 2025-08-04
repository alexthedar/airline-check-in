/* eslint-disable @typescript-eslint/no-explicit-any */
import { GET } from "../[confirmation]/route";

if (typeof Response.json !== "function") {
  /* eslint-disable-next-line no-extend-native */
  Response.json = (data: unknown, init?: ResponseInit) =>
    new Response(JSON.stringify(data), {
      status: init?.status ?? 200,
      headers: { "content-type": "application/json", ...init?.headers },
    });
}

/* ---------- helper MUST be a function declaration (hoisted) ---------- */
function buildSupabaseMock(result: any, error: any = null) {
  const single = jest.fn().mockResolvedValue({ data: result, error });
  const eq = jest.fn(() => ({ single }));
  const select = jest.fn(() => ({ eq }));
  const from = jest.fn(() => ({ select }));
  return { from, select, eq, single };
}

/* ---------- mock the Supabase client ---------- */
jest.mock("@/lib/supabaseClient", () => {
  const supabase = buildSupabaseMock(null);
  return { __esModule: true, supabase };
});

const { supabase } = jest.requireMock("@/lib/supabaseClient") as {
  supabase: ReturnType<typeof buildSupabaseMock>;
};

describe("GET /api/status/[confirmation]", () => {
  afterEach(() => jest.resetAllMocks());

  it("returns passenger data when confirmation exists", async () => {
    const passenger = {
      last_name: "Smith",
      flight_info: { flight_number: "UA456", destination: "NYC" },
      check_in_status: "Checked In",
    };
    Object.assign(supabase, buildSupabaseMock(passenger));

    const res = await GET(new Request("http://test/api/status/ABC123"), {
      params: { confirmation: "ABC123" },
    });

    expect(res.status).toBe(200);
  });

  it("returns 404 when confirmation is not found", async () => {
    Object.assign(supabase, buildSupabaseMock(null, new Error("not found")));

    const res = await GET(new Request("http://test/api/status/BAD"), {
      params: { confirmation: "BAD" },
    });

    expect(res.status).toBe(404);
  });
});
