export default function JobsListPage() {
  // Placeholder list UI
  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Jobs</h1>
      <div className="flex gap-2">
        <input
          className="border rounded-md p-2 w-full"
          placeholder="Search jobs, company..."
        />
        <button className="rounded-md border px-4">Filter</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3].map((i) => (
          <article key={i} className="border rounded-lg p-4 space-y-2">
            <h2 className="font-medium">Software Engineer {i}</h2>
            <p className="text-sm text-neutral-500">Eligibility: CGPA ≥ 7.0</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-neutral-500">Deadline: TBD</span>
              <button className="rounded-md bg-black text-white px-3 py-1 text-sm">
                Apply
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

