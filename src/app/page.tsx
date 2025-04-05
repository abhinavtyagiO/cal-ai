import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Track Your Fitness Journey with AI
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Optimize your diet and track your progress with personalized AI-powered insights.
          No workout plans, just smart calorie tracking that adapts to your routine.
        </p>
        <div className="space-x-4">
          <Link
            href="/onboarding"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/about"
            className="inline-block px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
