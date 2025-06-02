import { useState } from 'react';
import { Settings, Brain, Globe, Camera, Save, Trash2, Download, Eye, Check, Loader2 } from 'lucide-react';

const ModernSettings = () => {
  // State management
  const [settings, setSettings] = useState({
    aiModel: 'claude-sonnet-4',
    temperature: 50,
    language: 'en',
    responseLanguage: 'auto',
    autoSave: true,
    retention: 30
  });

  const [screenshots, setScreenshots] = useState([
    { id: 1, name: 'Dashboard_Analysis_2025.png', date: 'June 1, 2025 - 3:42 PM', size: '1.2 MB' },
    { id: 2, name: 'Settings_Backup_Config.png', date: 'May 30, 2025 - 11:28 AM', size: '890 KB' },
    { id: 3, name: 'AI_Model_Comparison.png', date: 'May 29, 2025 - 8:15 AM', size: '2.1 MB' },
    { id: 4, name: 'Code_Review_Session.png', date: 'May 28, 2025 - 4:22 PM', size: '1.8 MB' },
    { id: 5, name: 'API_Documentation.png', date: 'May 27, 2025 - 2:15 PM', size: '750 KB' }
  ]);

  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, success
  const [storageUsed, setStorageUsed] = useState(2.3);
  const storageTotal = 5.0;

  // Handle setting updates
  const updateSetting = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Save settings with animation
  const saveSettings = async () => {
    setSaveStatus('saving');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSaveStatus('success');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  // Delete screenshot
  const deleteScreenshot = (id: number) => {
    setScreenshots(prev => prev.filter(s => s.id !== id));
    // Update storage calculation
    setStorageUsed(prev => Math.max(0, prev - 0.3));
  };

  // Clear all screenshots
  const clearAllScreenshots = () => {
    if (window.confirm('Delete ALL screenshot history?\n\nThis action cannot be undone.')) {
      setScreenshots([]);
      setStorageUsed(0.5); // Keep some base usage
    }
  };

  // View screenshot (simulate)
  const viewScreenshot = (name: string) => {
    alert(`Opening ${name}...`);
  };

  // Export screenshots
  const exportScreenshots = () => {
    alert('Screenshots exported successfully!');
  };

  // Calculate storage percentage
  const storagePercentage = (storageUsed / storageTotal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 sm:p-6 lg:p-8">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white opacity-[0.02] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white opacity-[0.01] rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-white to-gray-300 rounded-2xl shadow-2xl">
            <Settings className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-thin mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent tracking-tight">
            Settings
          </h1>
          <p className="text-xl text-gray-400 font-light">
            Customize your AI experience and manage preferences
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid gap-8 lg:gap-10 mb-12">
          
          {/* AI Model Configuration */}
          <div className="group bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-white/5 hover:-translate-y-2">
            <div className="flex items-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-white to-gray-200 rounded-xl flex items-center justify-center mr-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-7 h-7 text-black" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white mb-2">AI Model</h2>
                <p className="text-gray-400">Configure your AI assistant</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Select Model
                </label>
                <select 
                  value={settings.aiModel}
                  onChange={(e) => updateSetting('aiModel', e.target.value)}
                  className="w-full px-4 py-4 bg-black/40 border-2 border-white/20 rounded-xl text-white focus:border-white focus:outline-none focus:bg-black/60 transition-all duration-300 hover:border-white/30"
                >
                  <option value="claude-sonnet-4">Claude Sonnet 4 (Recommended)</option>
                  <option value="claude-opus-4">Claude Opus 4</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Response Creativity: {settings.temperature}%
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.temperature}
                    onChange={(e) => updateSetting('temperature', parseInt(e.target.value))}
                    className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, white 0%, white ${settings.temperature}%, rgba(255,255,255,0.2) ${settings.temperature}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Conservative</span>
                    <span>Balanced</span>
                    <span>Creative</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Language Settings */}
          <div className="group bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-white/5 hover:-translate-y-2">
            <div className="flex items-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-white to-gray-200 rounded-xl flex items-center justify-center mr-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-7 h-7 text-black" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white mb-2">Language</h2>
                <p className="text-gray-400">Localization preferences</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Interface Language
                </label>
                <select 
                  value={settings.language}
                  onChange={(e) => updateSetting('language', e.target.value)}
                  className="w-full px-4 py-4 bg-black/40 border-2 border-white/20 rounded-xl text-white focus:border-white focus:outline-none focus:bg-black/60 transition-all duration-300 hover:border-white/30"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="zh">中文</option>
                  <option value="ja">日本語</option>
                  <option value="ar">العربية</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  AI Response Language
                </label>
                <select 
                  value={settings.responseLanguage}
                  onChange={(e) => updateSetting('responseLanguage', e.target.value)}
                  className="w-full px-4 py-4 bg-black/40 border-2 border-white/20 rounded-xl text-white focus:border-white focus:outline-none focus:bg-black/60 transition-all duration-300 hover:border-white/30"
                >
                  <option value="auto">Auto-detect from input</option>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                  <option value="ja">Japanese</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>
            </div>
          </div>

          {/* Screenshot History */}
          <div className="group bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-white/5 hover:-translate-y-2">
            <div className="flex items-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-white to-gray-200 rounded-xl flex items-center justify-center mr-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Camera className="w-7 h-7 text-black" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white mb-2">Screenshot History</h2>
                <p className="text-gray-400">Manage your captured content</p>
              </div>
            </div>

            {/* Storage Stats */}
            <div className="bg-black/30 border border-white/10 rounded-2xl p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-300">Storage Usage</span>
                <span className="text-white font-semibold">
                  {storageUsed.toFixed(1)} GB / {storageTotal} GB
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-white to-gray-300 transition-all duration-1000 ease-out rounded-full"
                  style={{ width: `${storagePercentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {storagePercentage.toFixed(1)}% used
              </div>
            </div>

            {/* Controls */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">
                  Auto-save Screenshots
                </label>
                <button
                  onClick={() => updateSetting('autoSave', !settings.autoSave)}
                  className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                    settings.autoSave ? 'bg-white' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 rounded-full transition-all duration-300 ${
                      settings.autoSave 
                        ? 'left-7 bg-black' 
                        : 'left-1 bg-white'
                    }`}
                  ></div>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Retention Period
                </label>
                <select 
                  value={settings.retention}
                  onChange={(e) => updateSetting('retention', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-black/40 border-2 border-white/20 rounded-xl text-white focus:border-white focus:outline-none transition-all duration-300"
                >
                  <option value="7">7 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="365">1 year</option>
                  <option value="never">Never delete</option>
                </select>
              </div>
            </div>

            {/* Screenshot List */}
            <div className="space-y-3 mb-6 max-h-80 overflow-y-auto custom-scrollbar">
              {screenshots.length > 0 ? (
                screenshots.map((screenshot) => (
                  <div 
                    key={screenshot.id}
                    className="flex items-center justify-between p-5 bg-black/20 border border-white/5 rounded-xl hover:bg-black/40 hover:border-white/15 transition-all duration-300 group"
                  >
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">{screenshot.name}</h4>
                      <p className="text-gray-400 text-sm">{screenshot.date}</p>
                      <p className="text-gray-500 text-xs">{screenshot.size}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => viewScreenshot(screenshot.name)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-110"
                      >
                        <Eye className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => deleteScreenshot(screenshot.id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all duration-200 hover:scale-110"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <Camera className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">No screenshots in history</p>
                  <p className="text-sm mt-2">Screenshots will appear here when auto-save is enabled</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {screenshots.length > 0 && (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={clearAllScreenshots}
                  className="flex items-center px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 rounded-lg text-red-400 transition-all duration-200 hover:scale-105"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </button>
                <button
                  onClick={exportScreenshots}
                  className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-lg text-white transition-all duration-200 hover:scale-105"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center">
          <button
            onClick={saveSettings}
            disabled={saveStatus === 'saving'}
            className={`relative inline-flex items-center px-12 py-5 text-lg font-semibold rounded-2xl transition-all duration-500 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/20 ${
              saveStatus === 'success'
                ? 'bg-gradient-to-r from-green-400 to-green-600 text-black'
                : saveStatus === 'saving'
                ? 'bg-gradient-to-r from-gray-600 to-gray-800 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-white to-gray-200 text-black hover:from-gray-100 hover:to-gray-300 hover:shadow-2xl hover:shadow-white/20'
            }`}
          >
            {saveStatus === 'saving' && (
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
            )}
            {saveStatus === 'success' && (
              <Check className="w-5 h-5 mr-3" />
            )}
            {saveStatus === 'idle' && (
              <Save className="w-5 h-5 mr-3" />
            )}
            
            {saveStatus === 'saving' ? 'Saving...' : 
             saveStatus === 'success' ? 'Settings Saved!' : 
             'Save All Settings'}
          </button>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #ffffff, #e5e5e5);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.4);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ModernSettings;