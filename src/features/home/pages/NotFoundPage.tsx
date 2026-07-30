import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-7xl font-bold">404</h1>

      <p className="text-slate-400">Page not found.</p>

      <Link
        to="/"
        className="rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-500"
      >
        Back Home
      </Link>
    </section>
  );
}