"use client"

import type React from "react"
import { useState } from "react"

// Define the type for the result state
type ResultType = {
  found: boolean
  data?: Record<string, string> // Dynamic structure based on Google Sheet headers
}

export default function Home() {
  const [regNo, setRegNo] = useState("")
  const [result, setResult] = useState<ResultType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!regNo.trim()) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const res = await fetch(`/api/user/${regNo}`)

      if (!res.ok) {
        if (res.status === 404) {
          setResult({ found: false })
        } else {
          const errorData = await res.json()
          throw new Error(errorData.error || "An error occurred")
        }
        return
      }

      const data: ResultType = await res.json()
      setResult(data)
    } catch (e) {
      console.error(e)
      setError(e instanceof Error ? e.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  // Function to determine which icon to use based on field name
  const getFieldIcon = (fieldName: string) => {
    const fieldNameLower = fieldName.toLowerCase()

    if (fieldNameLower.includes("registration") || fieldNameLower.includes("reg")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      )
    } else if (
      fieldNameLower.includes("name") &&
      !fieldNameLower.includes("father") &&
      !fieldNameLower.includes("mother") &&
      !fieldNameLower.includes("factory")
    ) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      )
    } else if (fieldNameLower.includes("father") || fieldNameLower.includes("mother")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    } else if (fieldNameLower.includes("birth") || fieldNameLower.includes("date")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      )
    } else if (
      fieldNameLower.includes("factory") ||
      fieldNameLower.includes("company") ||
      fieldNameLower.includes("organization")
    ) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      )
    } else if (fieldNameLower.includes("address") || fieldNameLower.includes("location")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      )
    } else {
      // Default icon for other fields
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      )
    }
  }

  // Function to get color based on field index
  const getFieldColor = (index: number) => {
    const colors = [
      { bg: "bg-blue-100", border: "border-blue-500", icon: "bg-blue-500", text: "text-blue-700" },
      { bg: "bg-purple-100", border: "border-purple-500", icon: "bg-purple-500", text: "text-purple-700" },
      { bg: "bg-indigo-100", border: "border-indigo-500", icon: "bg-indigo-500", text: "text-indigo-700" },
      { bg: "bg-pink-100", border: "border-pink-500", icon: "bg-pink-500", text: "text-pink-700" },
      { bg: "bg-amber-100", border: "border-amber-500", icon: "bg-amber-500", text: "text-amber-700" },
      { bg: "bg-emerald-100", border: "border-emerald-500", icon: "bg-emerald-500", text: "text-emerald-700" },
      { bg: "bg-cyan-100", border: "border-cyan-500", icon: "bg-cyan-500", text: "text-cyan-700" },
      { bg: "bg-rose-100", border: "border-rose-500", icon: "bg-rose-500", text: "text-rose-700" },
    ]

    return colors[index % colors.length]
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-md opacity-0 animate-fade-in-down">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h1 className="text-2xl font-bold text-center">Employee Verification</h1>
            <p className="text-white/90 text-center mt-1">Search for employee details using registration number</p>
          </div>

          <div className="p-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  className="w-full pl-10 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-all duration-300"
                  placeholder="Enter registration number"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <button
                onClick={handleSearch}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Search"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="mt-8 flex flex-col items-center animate-fade-in">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-ping-slow"></div>
          </div>
          <p className="mt-4 text-white font-medium animate-pulse">Searching database...</p>
        </div>
      )}

      {error && !loading && (
        <div className="mt-8 w-full max-w-md animate-fade-in-up">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-red-500">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
              <h2 className="text-xl font-bold text-center">Error</h2>
              <p className="text-white/90 text-center mt-1">An error occurred while searching</p>
            </div>
            <div className="p-8">
              <div className="flex flex-col items-center animate-bounce-in">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-red-500 text-4xl animate-pulse">!</span>
                </div>
                <p className="text-red-600 text-center">{error}</p>
              </div>
            </div>
            <div className="flex justify-center p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setError(null)
                }}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {result && !loading && !error && (
        <div className="mt-8 w-full max-w-md animate-fade-in-up">
          <div
            className={`bg-white rounded-xl shadow-2xl overflow-hidden ${!result.found ? "border-2 border-red-500" : ""}`}
          >
            <div
              className={`p-6 text-white ${result.found ? "bg-gradient-to-r from-green-500 to-teal-500" : "bg-gradient-to-r from-red-500 to-orange-500"}`}
            >
              <h2 className="text-xl font-bold text-center">{result.found ? "Employee Found" : "No Results"}</h2>
              <p className="text-white/90 text-center mt-1">
                {result.found
                  ? "Details for registration number " + regNo
                  : "No employee found with registration number " + regNo}
              </p>
            </div>

            {result.found && result.data && (
              <div className="p-6 space-y-4">
                {Object.entries(result.data).map(([key, value], index) => {
                  // Skip empty values or internal fields
                  if (!value || key.startsWith("_")) return null

                  const colors = getFieldColor(index)
                  const delay = `delay-${(index % 6) + 1}00`

                  // Special handling for parent names
                  if (key.toLowerCase().includes("father") || key.toLowerCase().includes("mother")) {
                    const isParentField = true
                    const parentType = key.toLowerCase().includes("father") ? "Father's" : "Mother's"

                    return (
                      <div
                        key={key}
                        className={`${colors.bg} rounded-lg p-4 border-l-4 ${colors.border} animate-slide-in ${delay} hover:shadow-md transition-shadow duration-300`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`${colors.icon} text-white p-2 rounded-full`}>{getFieldIcon(key)}</div>
                          <div>
                            <p className={`text-sm ${colors.text} font-medium`}>{parentType} Name</p>
                            <p className="font-semibold text-gray-800">{value || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div
                      key={key}
                      className={`${colors.bg} rounded-lg p-4 border-l-4 ${colors.border} animate-slide-in ${delay} hover:shadow-md transition-shadow duration-300`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`${colors.icon} text-white p-2 rounded-full`}>{getFieldIcon(key)}</div>
                        <div>
                          <p className={`text-sm ${colors.text} font-medium`}>{key}</p>
                          <p className="font-semibold text-gray-800">{value || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {!result.found && (
              <div className="p-8">
                <div className="flex flex-col items-center animate-bounce-in">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-red-500 text-4xl animate-pulse">!</span>
                  </div>
                  <p className="text-red-600 text-center">
                    We couldn't find any employee with the registration number <strong>{regNo}</strong>.
                    <br />
                    Please check the number and try again.
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-center p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setRegNo("")
                  setResult(null)
                }}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                New Search
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
