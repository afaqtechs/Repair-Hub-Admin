import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      {/* SVG Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-20 w-20 text-gray-400"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9 9h.01" />
        <path d="M15 9h.01" />
        <path d="M8.5 15.5s1.5-2 3.5-2 3.5 2 3.5 2" />
      </svg>

      <h2 className="text-2xl font-semibold text-gray-800">Not Found</h2>
      <p className="text-gray-500">Could not find requested resource</p>

      <Link
        href="/admin"
        className="mt-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
      >
        Return Home
      </Link>
    </div>
  )
}