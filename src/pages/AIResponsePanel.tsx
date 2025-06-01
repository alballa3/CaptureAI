
interface AIResponse {
  text: string;
  timestamp: Date;
  loading: boolean;
}

interface Props {
  aiResponse: AIResponse | null;
  show: boolean;
  onClose: () => void;
}

export default function AIResponsePanel({ aiResponse, show, onClose }: Props) {
  if (!show) return null;
  return (
    <div className="absolute bottom-6 left-6 right-6 max-w-2xl mx-auto bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 animate-slide-up">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <div>
              <h3 className="text-white font-semibold">AI Analysis</h3>
              <p className="text-gray-400 text-xs">{aiResponse?.timestamp.toLocaleTimeString()}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
            <span className="text-white text-lg">×</span>
          </button>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 min-h-[100px] max-h-[300px] overflow-y-auto">
          {aiResponse?.loading ? (
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span>Analyzing image with AI...</span>
            </div>
          ) : (
            <p className="text-white text-sm leading-relaxed">{aiResponse?.text || 'No response received'}</p>
          )}
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium transition-colors">Copy</button>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl text-xs font-medium transition-colors">Save</button>
        </div>
      </div>
    </div>
  );
}