'use client';

import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [input, setInput] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [urlList, setUrlList] = useState<{ original: string; short: string }[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const storedUrls = localStorage.getItem('shortenedUrls');
    if (storedUrls) {
      setUrlList(JSON.parse(storedUrls));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidUrl || !input) {
      toast.error('Please enter a valid URL.');
      return;
    }

    setLoading(true);
    setShortUrl('');
    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl: input }),
      });

      const data = await res.json();

      if (res.ok) {
        setShortUrl(data.shortUrl);
        toast.success('URL shortened successfully!');
        const newEntry = { original: input, short: data.shortUrl };

        const updatedList = [newEntry, ...urlList];
        setUrlList(updatedList);
        localStorage.setItem('shortenedUrls', JSON.stringify(updatedList));

        setInput('');
      } else {
        toast.error(data.error || 'Something went wrong');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlCheck = (value: string) => {
    try {
      const url = new URL(value);

      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        throw new Error();
      }

      setIsValidUrl(true);
      setError('');
    } catch (err) {
      setIsValidUrl(false);
      setError(`We'll need a valid URL, like "yourbrnd.co/niceurl"`);
    }
  };

  return (
    <main className="flex min-h-screen w-full bg-gray-100">
      <Toaster />

     
      <aside
        className={`fixed top-0 right-0 h-full bg-white shadow-lg w-80 z-40 transition-transform duration-300 ease-in-out ${
          showSidebar ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">📃 All Shortened URLs</h2>
            <button
              onClick={() => setShowSidebar(false)}
              className="text-gray-600 hover:text-black text-xl"
            >
              ❌
            </button>
          </div>

          {urlList.length === 0 ? (
            <p className="text-gray-500 text-center">No URLs yet</p>
          ) : (
            <ul className="space-y-3 overflow-y-auto max-h-[80vh]">
              {urlList.map((url, index) => (
                <li
                  key={index}
                  className="border rounded p-2 shadow-sm bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-700 truncate">🔗 {url.original}</p>
                    <div className="flex items-center justify-between mt-1">
                      <a
                        href={url.short}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        Redirect →
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(url.short);
                          toast.success('Link copied!');
                        }}
                        className="text-xs text-white bg-blue-500 px-2 py-1 rounded hover:bg-blue-600 ml-2"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      
      <section className="flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-6">🔗 URL Shortener</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md"
        >
          <input
            type="url"
            placeholder="Paste a long URL"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              handleUrlCheck(e.target.value);
            }}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            disabled={loading || !isValidUrl}
            className={`px-6 py-2 rounded-md text-white ${
              loading || !isValidUrl
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Shortening...' : 'Shorten'}
          </button>
        </form>

        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

        {shortUrl && (
          <p className="mt-6 text-lg">
            Short URL:{' '}
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {shortUrl}
            </a>
          </p>
        )}

        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="mt-8 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          📋 {showSidebar ? 'Hide' : 'Show'} All URLs
        </button>
      </section>
    </main>
  );
}
