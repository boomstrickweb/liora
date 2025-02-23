import React, { useState } from 'react';
import axios from 'axios';
import { Wand2, Image as ImageIcon, Loader2, Sparkles, Download } from 'lucide-react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateImages = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedImages([]);

    try {
      const response = await axios.post(
        'https://api.together.xyz/v1/images/generations',
        {
          model: "black-forest-labs/FLUX.1-schnell",
          prompt: prompt,
          width: 1024,
          height: 768,
          steps: 4,
          n: 4,
          response_format: "b64_json"
        },
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_TOGETHER_API_KEY}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data.data) {
        const images = response.data.data.map((img: { b64_json: string }) => 
          `data:image/jpeg;base64,${img.b64_json}`
        );
        setGeneratedImages(images);
      } else {
        setError('Failed to generate images');
      }
    } catch (err) {
      setError('Error generating images. Please check your API key and try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-image-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0a0a1f] text-white relative overflow-x-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a3a] via-[#2a2a6a] to-[#0a0a1f] opacity-80"></div>
      
      {/* Animated circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[300px] sm:w-[400px] lg:w-[500px] h-[300px] sm:h-[400px] lg:h-[500px] rounded-full bg-purple-600/20 blur-3xl -top-48 -left-24 animate-pulse"></div>
        <div className="absolute w-[250px] sm:w-[300px] lg:w-[400px] h-[250px] sm:h-[300px] lg:h-[400px] rounded-full bg-blue-600/20 blur-3xl -bottom-32 -right-16 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-purple-400 animate-pulse" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              Liora Image Generator
            </h1>
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-400 animate-pulse" />
          </div>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
            Transform your imagination into stunning visuals with our next-generation AI image generator
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6 lg:p-8 shadow-2xl mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your imagination..."
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder-gray-400 transition-all text-sm sm:text-base"
                onKeyPress={(e) => e.key === 'Enter' && generateImages()}
              />
              <Wand2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-gray-400 pointer-events-none" />
            </div>
            <button
              onClick={generateImages}
              disabled={loading}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center sm:justify-start gap-3 font-medium shadow-lg shadow-purple-500/25 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  Generate
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 sm:mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm sm:text-base">
              {error}
            </div>
          )}
        </div>

        {generatedImages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {generatedImages.map((imageUrl, index) => (
              <div key={index} className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6 shadow-2xl transform transition-all hover:scale-[1.02]">
                <img
                  src={imageUrl}
                  alt={`Generated artwork ${index + 1}`}
                  className="w-full h-auto rounded-xl shadow-2xl mb-4"
                  loading="lazy"
                />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                  <p className="text-gray-400 text-sm">Image {index + 1}</p>
                  <button
                    onClick={() => handleDownload(imageUrl, index)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-all text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;