function About() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About MARQAIT</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            MARQAIT is a modern web application built with React, TypeScript, and Tailwind CSS.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">Technologies Used</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• React 19</li>
                <li>• TypeScript</li>
                <li>• React Router</li>
                <li>• Zustand (State Management)</li>
                <li>• Tailwind CSS</li>
                <li>• Vite (Build Tool)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">Features</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Modern UI/UX</li>
                <li>• Dark/Light Theme</li>
                <li>• Responsive Design</li>
                <li>• Type Safety</li>
                <li>• Fast Development</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;