export default function Dashboard() {
  return (
    <main className="min-h-screen p-8">
      <nav className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-serif text-primary-dark">Dashboard</h1>
        <a 
          href="/"
          className="px-4 py-2 bg-primary-dark text-white rounded hover:bg-primary-medium transition"
        >
          Back to Home
        </a>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-serif mb-2 text-primary-dark">Total Listings</h3>
          <p className="text-3xl font-bold text-primary-medium">24</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-serif mb-2 text-primary-dark">Active Inquiries</h3>
          <p className="text-3xl font-bold text-primary-medium">12</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-serif mb-2 text-primary-dark">Properties Sold</h3>
          <p className="text-3xl font-bold text-primary-medium">8</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-serif mb-6 text-primary-dark">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border-b pb-4">
                <p className="text-primary-dark font-medium">New inquiry received</p>
                <p className="text-sm text-gray-600">Property: Luxury Villa {i}</p>
                <p className="text-sm text-gray-600">2 hours ago</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-serif mb-6 text-primary-dark">Top Properties</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border-b pb-4">
                <h3 className="text-lg font-medium text-primary-dark">Luxury Villa {i}</h3>
                <p className="text-primary-medium">$1,{i}00,000</p>
                <p className="text-sm text-gray-600">{i * 5} views this week</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}