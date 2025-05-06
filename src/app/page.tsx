"use client";

import { useState } from "react";

export default function Home() {
  const [regNo, setRegNo] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/user/${regNo}`);
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Search by Registration No</h1>
      <input
        className="border p-2 rounded mb-2"
        placeholder="Enter registration no"
        value={regNo}
        onChange={(e) => setRegNo(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Searching..." : "Search"}
      </button>

      {result && (
        <div className="mt-4">
          {result.found ? (
            <pre className="bg-gray-100 p-4 rounded">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          ) : (
            <p className="text-red-500">User Not Found</p>
          )}
        </div>
      )}
    </div>
  );
}
