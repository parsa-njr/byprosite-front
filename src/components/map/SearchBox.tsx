import React, { useState } from "react";
import axios from "axios";

interface SearchBoxProps {
  onSelectLocation: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  currentCenter: { latitude: number; longitude: number };
}

interface SearchResult {
  title: string;
  address: string;
  location: {
    x: number; // longitude
    y: number; // latitude
  };
}

const SearchBox: React.FC<SearchBoxProps> = ({
  onSelectLocation,
  currentCenter,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await axios.get("https://api.neshan.org/v1/search", {
        params: {
          term: query,
          lat: currentCenter.latitude,
          lng: currentCenter.longitude,
        },
        headers: {
          "Api-Key": "service.b4290b25123e438b880026cc40f64665",
        },
      });
      setResults(res.data.items || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item: SearchResult) => {
    const { x: lng, y: lat } = item.location;
    onSelectLocation({ latitude: lat, longitude: lng, address: item.address });
    setResults([]);
    setQuery(item.title);
  };

  return (
    <div className="relative w-full z-20">
      <form onSubmit={handleSearch}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جست‌وجوی مکان یا خیابان..."
          className="w-full px-4 py-2 rounded-lg shadow bg-white text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>

      {loading && (
        <div className="absolute w-full mt-2 bg-white text-gray-600 text-sm p-2 rounded shadow">
          در حال جست‌وجو...
        </div>
      )}

      {!loading && results.length > 0 && (
        <ul className="absolute w-full mt-2 bg-white rounded-lg shadow max-h-64 overflow-y-auto">
          {results.map((item, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              <div className="font-semibold">{item.title}</div>
              <div className="text-sm text-gray-500">{item.address}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
