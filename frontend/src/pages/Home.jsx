// import { useEffect, useState } from "react";
// import PropertyCard from "../components/PropertyCard";
// import API from "../services/api";
// import homeLogo from "../assets/houseLogo.svg";

// function Home() {
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // search + filters
//   const [location, setLocation] = useState("");
//   const [minRent, setMinRent] = useState("");
//   const [maxRent, setMaxRent] = useState("");

//   const [results, setResults] = useState([]);

//   // fetch all properties (for recommended)
//   const fetchProperties = async () => {
//     try {
//       const res = await API.get("/property");
//       setProperties(res.data);
//     } catch (err) {
//       console.error("Error fetching properties", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProperties();
//   }, []);

//   //  filter search
//   const handleSearch = async () => {
//     try {
//       const res = await API.get("/property/search", {
//         params: {
//           location: location || undefined,
//           minRent: minRent || undefined,
//           maxRent: maxRent || undefined,
//         },
//       });

//       setResults(res.data);
//     } catch (err) {
//       console.error("Search failed", err);
//     }
//   };

//   // clear search
//   const handleClear = () => {
//     setResults([]);
//     setLocation("");
//     setMinRent("");
//     setMaxRent("");
//   };

//   // decide what to show
//   const displayProperties =
//     results.length > 0 ? results : properties.slice(0, 3);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-gray-500">Loading properties...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">

//       {/*  SEARCH */}
//       <div className="mb-10 text-center">
//         <h1 className="text-3xl font-bold text-gray-800 mb-4 flex justify-center items-center gap-2">
//           Find Your Perfect Home
//           <img src={homeLogo} alt="logo" className="w-10 h-10" />
//         </h1>

//         {/* FILTERS */}
//         <div className="flex flex-wrap justify-center gap-2">

//           <input
//             type="text"
//             placeholder="Location"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//             className="border px-3 py-2 rounded-lg"
//           />

//           <input
//             type="number"
//             placeholder="Min Rent"
//             value={minRent}
//             onChange={(e) => setMinRent(e.target.value)}
//             className="border px-3 py-2 rounded-lg w-32"
//           />

//           <input
//             type="number"
//             placeholder="Max Rent"
//             value={maxRent}
//             onChange={(e) => setMaxRent(e.target.value)}
//             className="border px-3 py-2 rounded-lg w-32"
//           />

//           <button
//             onClick={handleSearch}
//             className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
//           >
//             Search
//           </button>

//           <button
//             onClick={handleClear}
//             className="text-gray-500"
//           >
//             Clear
//           </button>

//         </div>
//       </div>

//       {/* HEADING */}
//       <h2 className="text-xl font-semibold mb-6">
//         {results.length > 0 ? "Search Results" : "Recommended"}
//       </h2>

//       {/* NO RESULTS */}
//       {results.length === 0 && (location || minRent || maxRent) ? (
//         <p className="text-gray-500">No properties found</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {displayProperties.map((property) => (
//             <PropertyCard
//               key={property.id}
//               id={property.id}
//               title={property.title}
//               location={property.location}
//               price={property.rent}
//               image={property.images?.[0]?.imageUrl}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Home;


import { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import API from "../services/api";
import homeLogo from "../assets/houseLogo.svg";

function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Original search + filters
  const [location, setLocation] = useState("");
  const [minRent, setMinRent] = useState("");
  const [maxRent, setMaxRent] = useState("");

  // New AI Search state
  const [semanticQuery, setSemanticQuery] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [results, setResults] = useState([]);

  const fetchProperties = async () => {
    try {
      const res = await API.get("/property");
      setProperties(res.data);
    } catch (err) {
      console.error("Error fetching properties", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // filter search (Original)
  const handleSearch = async () => {
    try {
      const res = await API.get("/property/search", {
        params: {
          location: location || undefined,
          minRent: minRent || undefined,
          maxRent: maxRent || undefined,
        },
      });
      setResults(res.data);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  // NEW: Semantic Search API call
  const handleSemanticSearch = async () => {
    if (!semanticQuery) return;
    setIsAiLoading(true);
    try {
      const res = await API.get("/property/search/semantic", {
        params: { query: semanticQuery },
      });
      setResults(res.data);
    } catch (err) {
      console.error("AI Search failed", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // clear search
  const handleClear = () => {
    setResults([]);
    setLocation("");
    setMinRent("");
    setMaxRent("");
    setSemanticQuery("");
  };

  // decide what to show (Your original logic)
  const displayProperties =
    results.length > 0 ? results : properties.slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* SEARCH SECTION */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 flex justify-center items-center gap-2">
          Find Your Perfect Home
          <img src={homeLogo} alt="logo" className="w-10 h-10" />
        </h1>

        {/* 1. NEW AI SEARCH BAR (Placed before filters as requested) */}
        <div className="flex justify-center gap-2 mb-4 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Describe your dream home..."
            value={semanticQuery}
            onChange={(e) => setSemanticQuery(e.target.value)}
            className="border px-4 py-2 rounded-lg flex-1 shadow-sm"
          />
          <button
            onClick={handleSemanticSearch}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            {isAiLoading ? "..." : "AI Search"}
          </button>
        </div>

        {/* 2. ORIGINAL FILTERS (Keep UI same only) */}
        <div className="flex flex-wrap justify-center gap-2">
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          />

          <input
            type="number"
            placeholder="Min Rent"
            value={minRent}
            onChange={(e) => setMinRent(e.target.value)}
            className="border px-3 py-2 rounded-lg w-32"
          />

          <input
            type="number"
            placeholder="Max Rent"
            value={maxRent}
            onChange={(e) => setMaxRent(e.target.value)}
            className="border px-3 py-2 rounded-lg w-32"
          />

          <button
            onClick={handleSearch}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
          >
            Search
          </button>

          <button
            onClick={handleClear}
            className="text-gray-500"
          >
            Clear
          </button>
        </div>
      </div>

      {/* HEADING */}
      <h2 className="text-xl font-semibold mb-6">
        {results.length > 0 ? "Search Results" : "Recommended"}
      </h2>

      {/* RESULTS GRID (Your original logic) */}
      {results.length === 0 && (location || minRent || maxRent || semanticQuery) ? (
        <p className="text-gray-500">No properties found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {displayProperties.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              title={property.title}
              location={property.location}
              price={property.rent}
              // Handles standard images or mainImage from Raw SQL
              image={property.images?.[0]?.imageUrl || property.mainImage}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;