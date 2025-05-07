import { useState, useEffect } from 'react';
import { Download, Link, Loader2, AlertCircle, Sun, Moon, Info } from 'lucide-react';

export default function YouTubeThumbnailDownloader() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(null);
  const [zoomed, setZoomed] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [showTutorial, setShowTutorial] = useState(false);

  const thumbnailTypes = [
    { id: 'maxresdefault', label: 'Maximum Resolution (1280x720)' },
    { id: 'sddefault', label: 'Standard Definition (640x480)' },
    { id: 'hqdefault', label: 'High Quality (480x360)' },
    { id: 'mqdefault', label: 'Medium Quality (320x180)' },
    { id: 'default', label: 'Default (120x90)' }
  ];

  useEffect(() => {
    if (videoId) {
      generateThumbnails();
    }
  }, [videoId]);

  const extractVideoId = (inputUrl) => {
    // Handle various YouTube URL formats
    let id = null;
    
    // Regular YouTube URLs
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = inputUrl.match(regExp);
    
    if (match && match[2].length === 11) {
      id = match[2];
    }
    
    return id;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setThumbnails([]);
    setLoading(true);
    
    const id = extractVideoId(url.trim());
    
    if (!id) {
      setLoading(false);
      setError('Invalid YouTube URL. Please enter a valid YouTube video link.');
      return;
    }
    
    setVideoId(id);
  };

  const generateThumbnails = async () => {
    try {
      const thumbnailsList = thumbnailTypes.map(type => ({
        type: type.id,
        label: type.label,
        url: `https://img.youtube.com/vi/${videoId}/${type.id}.jpg`
      }));
      
      // Check which thumbnails actually exist by loading them
      const validatedThumbnails = await Promise.all(
        thumbnailsList.map(async (thumb) => {
          try {
            const response = await fetch(thumb.url, { method: 'HEAD' });
            return {
              ...thumb,
              exists: response.ok && response.status !== 404
            };
          } catch (error) {
            return { ...thumb, exists: false };
          }
        })
      );
      
      setThumbnails(validatedThumbnails);
      setLoading(false);
      
      if (validatedThumbnails.every(thumb => !thumb.exists)) {
        setError('No thumbnails found for this video.');
      }
    } catch (err) {
      setError('Failed to load thumbnails. Please try again.');
      setLoading(false);
    }
  };

  const copyToClipboard = (url, type) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
      })
      .catch(() => {
        setError('Failed to copy URL. Please try manually.');
      });
  };

  const toggleZoom = (type) => {
    setZoomed(zoomed === type ? null : type);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">YouTube Thumbnail Downloader</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowTutorial(!showTutorial)}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              aria-label="Show tutorial"
            >
              <Info size={20} />
            </button>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {showTutorial && (
          <div className={`mb-8 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <h2 className="text-lg font-semibold mb-2">How to use</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Paste any YouTube video URL in the input field (full URL, youtu.be, embedded, or mobile links)</li>
              <li>Click "Get Thumbnails" to fetch available images</li>
              <li>Click on any thumbnail to zoom in</li>
              <li>Use the "Download" button to save the image or "Copy URL" to get the direct link</li>
            </ol>
            <h3 className="text-lg font-semibold mt-4 mb-2">Example URLs</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>https://www.youtube.com/watch?v=dQw4w9WgXcQ</li>
              <li>https://youtu.be/dQw4w9WgXcQ</li>
              <li>https://m.youtube.com/watch?v=dQw4w9WgXcQ</li>
            </ul>
            <button 
              className={`mt-4 px-3 py-1 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={() => setShowTutorial(false)}
            >
              Close Tutorial
            </button>
          </div>
        )}

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube URL here..."
              className={`flex-grow p-3 rounded-lg border ${darkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} 
                focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center 
                ${loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} 
                text-white transition-colors duration-200`}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                'Get Thumbnails'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className={`p-4 mb-6 rounded-lg flex items-start ${darkMode ? 'bg-red-900/30' : 'bg-red-100'}`}>
            <AlertCircle className={`mr-2 flex-shrink-0 ${darkMode ? 'text-red-400' : 'text-red-500'}`} size={20} />
            <p className={darkMode ? 'text-red-300' : 'text-red-700'}>{error}</p>
          </div>
        )}

        {thumbnails.length > 0 && (
          <div className="grid grid-cols-1 gap-8">
            {thumbnails.map((thumb) => (
              thumb.exists && (
                <div 
                  key={thumb.type}
                  className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} 
                    shadow-lg transition-all duration-200 ${zoomed === thumb.type ? 'ring-4 ring-blue-500' : ''}`}
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium">{thumb.label}</h3>
                  </div>
                  
                  <div className="relative">
                    <img
                      src={thumb.url}
                      alt={`YouTube thumbnail (${thumb.type})`}
                      className={`w-full h-auto cursor-pointer transition-transform duration-200 
                        ${zoomed === thumb.type ? 'scale-100' : 'hover:scale-105'}`}
                      onClick={() => toggleZoom(thumb.type)}
                    />
                  </div>
                  
                  <div className="p-4 flex flex-wrap gap-2">
                    <a
                      href={thumb.url}
                      download={`youtube-thumbnail-${videoId}-${thumb.type}.jpg`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium"
                    >
                      <Download size={18} />
                      Download
                    </a>
                    
                    <button
                      onClick={() => copyToClipboard(thumb.url, thumb.type)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md 
                        ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} 
                        font-medium transition-colors duration-200`}
                    >
                      <Link size={18} />
                      {copied === thumb.type ? 'Copied!' : 'Copy URL'}
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>This tool doesn't store any data or use YouTube's API.</p>
          <p className="mt-1">All thumbnails are fetched directly from YouTube's public servers.</p>
        </footer>
      </div>
    </div>
  );
}