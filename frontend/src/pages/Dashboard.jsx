import { useState, useEffect } from "react";
import PropertyCard from "../components/PropertyCard";
import API from "../services/api";
import { useLocation } from "react-router-dom";

function Dashboard() {
  const [owned, setOwned] = useState([]);
  const [rented, setRented] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const ownedRes = await API.get("/property/owner", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const rentedRes = await API.get("/property/rented", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOwned(ownedRes.data);
      setRented(rentedRes.data);

    } catch (err) {
      console.error("Dashboard fetch error", err);
    } finally {
      setLoading(false);
    }
  };

const location = useLocation();
useEffect(() => {
    fetchData();
}, [location]);

  // loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const handleDelete = async (id) => {
    try{
        const token = localStorage.getItem("token");
        await API.delete(`/property/${id}`, {
            headers : {
                Authorization : `Bearer ${token}`,
            }
        });
        alert("Property deleted");

        // updating ui
        setOwned(owned.filter((p) => p.id !== id));
    } catch(err){
        console.error("Delete failed", err);
        alert("Failed to delete");
    }
  }

  // main UI
  return (
    <div className="min-h-screen p-6">

      {/* OWNED */}
      <div className="flex justify-between items-center mb-4">
  <h2 className="text-xl font-semibold">My Properties</h2>

  <button
    onClick={() => (window.location.href = "/add-property")}
    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm"
  >
    + Add Property
  </button>
</div>
      

      {owned.length === 0 ? (
        <p className="text-gray-500 mb-6">No properties added</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {owned.map((property) => (
  <div key={property.id}>

    <PropertyCard
      id={property.id}
      title={property.title}
      location={property.location}
      price={property.rent}
      image={property.images?.[0]?.imageUrl}
    />

    {/* Tenant Info */}
    {property.rentals && property.rentals.length > 0 && (
      <div className="text-sm text-gray-600 mt-2">
        <p>Rented by: {property.rentals[0].tenant.name}</p>
        <p>Email: {property.rentals[0].tenant.email}</p>
      </div>
    )}

    {/* Delete Button */}
    <button
      onClick={() => handleDelete(property.id)}
      className="mt-2 text-red-500 hover:text-red-700 text-sm"
    >
      Delete
    </button>

  </div>
))}
        </div>
      )}

      {/* RENTED */}
      <h2 className="text-xl font-semibold mb-4">Rented Properties</h2>

      {rented.length === 0 ? (
        <p className="text-gray-500">No rented properties</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {rented.map((item) => (
            <div key = {item.property.id}>
            <PropertyCard
              key={item.property.id}
              id={item.property.id}
              title={item.property.title}
              location={item.property.location}
              price={item.property.rent}
              image={item.property.images?.[0]?.imageUrl}
            />

            
            </div>


          ))}
        </div>
      )}

    </div>
  );
}

export default Dashboard;