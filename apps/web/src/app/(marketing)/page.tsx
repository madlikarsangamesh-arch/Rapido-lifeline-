export default function MarketingHomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning-50 text-warning-600 text-sm font-semibold mb-6">
        Prototype · operational data unavailable
      </div>
      <h1 className="text-4xl font-bold text-ink-900 mb-4">Rapid Lifeline</h1>
      <p className="text-lg text-ink-600 max-w-xl mb-8">
        Rapid Lifeline is a private ambulance coordination platform, not a
        government emergency response service. Booking, dispatch, hospital, and
        tracking integrations are not connected. No operational activity is
        being displayed.
      </p>
    </main>
  );
}
