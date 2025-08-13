import UpgradeHeader from "../../components/UpgradeHeader";

export default function UpgradeCredit() {
  return (
    <div className="min-h-screen bg-gray-50">
      <UpgradeHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Upgrade Your Credits
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Choose a plan that fits your needs and unlock the full potential of MARQAIT
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-2">Basic</h3>
              <div className="text-3xl font-bold text-purple-600 mb-4">
                $9.99<span className="text-lg font-normal text-gray-500">/month</span>
              </div>
              <p className="text-gray-600 mb-6">Perfect for getting started</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  1,000 credits/month
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Basic support
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Standard templates
                </li>
              </ul>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                Choose Plan
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-purple-600 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <div className="text-3xl font-bold text-purple-600 mb-4">
                $29.99<span className="text-lg font-normal text-gray-500">/month</span>
              </div>
              <p className="text-gray-600 mb-6">Great for growing businesses</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  5,000 credits/month
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Priority support
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Premium templates
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Analytics dashboard
                </li>
              </ul>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                Choose Plan
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <div className="text-3xl font-bold text-purple-600 mb-4">
                $99.99<span className="text-lg font-normal text-gray-500">/month</span>
              </div>
              <p className="text-gray-600 mb-6">For large teams and agencies</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  20,000 credits/month
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  24/7 dedicated support
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Custom templates
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Advanced analytics
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Team collaboration
                </li>
              </ul>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                Choose Plan
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}