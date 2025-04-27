import { useState } from 'react';
import { Search, LogOut, Sun, Cloud, CloudRain } from 'lucide-react';

export default function AgricultureDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  const sidebarItems = [
    'Dashboard', 'Analytics', 'Fields', 'Harvesting', 'Finances', 'Weather', 'Settings'
  ];
  
  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold">
            <span className="text-green-400">agri</span>
            <span className="text-white">cultur</span>
          </h1>
        </div>
        
        <div className="flex flex-col flex-1">
          {sidebarItems.map((item) => (
            <button
              key={item}
              className={`py-3 px-6 text-left ${
                activeTab === item 
                  ? 'bg-green-200 text-gray-800 font-medium'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
              onClick={() => setActiveTab(item)}
            >
              {item}
            </button>
          ))}
        </div>
        
        <div className="p-6">
          <button className="flex items-center text-gray-300 hover:text-white">
            <LogOut size={20} className="mr-2" />
            Logout
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Search Bar */}
        <div className="p-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Search any of content"
            />
          </div>
        </div>
        
        {/* Dashboard Content */}
        <div className="px-6 pb-6">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Summary</h2>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Wheat Card */}
            <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Wheat</p>
                <p className="text-sm text-gray-500">Total production</p>
                <div className="flex items-end">
                  <h3 className="text-3xl font-bold text-gray-900">125</h3>
                  <p className="ml-1 mb-1">Tons</p>
                </div>
              </div>
              <div className="relative w-16 h-16">
                <div className="w-16 h-16 rounded-full border-4 border-green-500 border-r-transparent transform rotate-45"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-green-500 font-bold">12%</p>
                </div>
              </div>
            </div>
            
            {/* Rice Card */}
            <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rice</p>
                <p className="text-sm text-gray-500">Total production</p>
                <div className="flex items-end">
                  <h3 className="text-3xl font-bold text-gray-900">980</h3>
                  <p className="ml-1 mb-1">Tons</p>
                </div>
              </div>
              <div className="relative w-16 h-16">
                <div className="w-16 h-16 rounded-full border-4 border-green-500 border-r-transparent transform rotate-[120deg]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-green-500 font-bold">33%</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Weather Forecast */}
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-700">Weather forecast</h2>
            <a href="#" className="text-blue-500 text-sm">open app</a>
          </div>
          
          <div className="grid grid-cols-5 gap-4 mb-6">
            {/* Today */}
            <div className="bg-green-50 p-4 rounded-lg flex flex-col items-center relative">
              <p className="text-sm text-gray-600">Today</p>
              <div className="flex items-center">
                <h3 className="text-3xl font-bold">37°</h3>
                <span className="text-sm text-gray-500">/23°</span>
              </div>
              <div className="flex items-center">
                <CloudRain size={20} className="text-blue-500 mr-1" />
                <p className="text-sm text-gray-600">Rainy · Cloudy</p>
              </div>
              <div className="absolute top-2 right-2">
                <Sun size={24} className="text-yellow-500" />
              </div>
            </div>
            
            {/* Next Days */}
            <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center">
              <p className="text-sm text-gray-600">25 June</p>
              <h3 className="text-3xl font-bold">29°</h3>
              <p className="text-sm text-gray-600">Thunderstorm</p>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center">
              <p className="text-sm text-gray-600">26 June</p>
              <h3 className="text-3xl font-bold">32°</h3>
              <p className="text-sm text-gray-600">Rainy cloudy</p>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center">
              <p className="text-sm text-gray-600">27 June</p>
              <h3 className="text-3xl font-bold">39°</h3>
              <p className="text-sm text-gray-600">Semicloudy</p>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center">
              <p className="text-sm text-gray-600">28 June</p>
              <h3 className="text-3xl font-bold">42°</h3>
              <p className="text-sm text-gray-600">Sunny · Humidity</p>
            </div>
          </div>
          
          {/* Farm Management Section */}
          <h2 className="text-lg font-medium text-gray-700 mb-4">Manage your farm</h2>
          
          <div className="bg-white rounded-lg overflow-hidden mb-6 h-48">
            <img 
              src="/api/placeholder/700/200" 
              alt="Farm field with corn" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Predictive Analysis */}
          <h2 className="text-lg font-medium text-gray-700 mb-4">Predictive analysis</h2>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            {/* January */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-medium text-gray-700 mb-2">January '22</h3>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Wheat</span>
                  <span>59%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '59%'}}></div>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Rice</span>
                  <span>81%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '81%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Maize</span>
                  <span>13%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{width: '13%'}}></div>
                </div>
              </div>
            </div>
            
            {/* February */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-medium text-gray-700 mb-2">February '22</h3>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Wheat</span>
                  <span>59%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '59%'}}></div>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Rice</span>
                  <span>81%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '81%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Maize</span>
                  <span>13%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{width: '13%'}}></div>
                </div>
              </div>
            </div>
            
            {/* March */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-medium text-gray-700 mb-2">March '22</h3>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Wheat</span>
                  <span>59%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '59%'}}></div>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Rice</span>
                  <span>81%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '81%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Maize</span>
                  <span>13%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{width: '13%'}}></div>
                </div>
              </div>
            </div>
            
            {/* Harvesting Costs */}
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="text-md font-medium text-gray-700 mb-2">Harvesting Cost</h3>
              
              <div className="mb-1">
                <div className="flex justify-between text-sm">
                  <span>Wheat</span>
                  <span>$76K</span>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm">
                  <span>Rice</span>
                  <span>$24K</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">Total estimation</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">$100K</div>
              
              <div className="flex justify-end">
                <div className="w-16 h-16">
                  <div className="w-full h-full rounded-full bg-green-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}