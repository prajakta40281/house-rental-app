import {useEffect, useState} from "react";
import PropertyCard from "../components/PropertyCard";
import API from "../services/api";

function Home(){
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProperties = async () => {
        try{
           
            const res = await API.get("/property");
            setProperties(res.data);
            



        } catch(err){

            console.error("Error fetching properties", err);
        } finally {
          setLoading(false);
        }
    };
    useEffect(() => {
        fetchProperties();
    },[]);

    if(loading){
        return (
          <div className = "min-h-screen flex items-center justify-center">
            <p className = "text-gray-500">Loading properties...</p>
          </div>

        )

      }

    if(properties.length === 0){
        return (
          <div className = "min-h-screen flex items-center justify-center">
            <p className = "text-gray-500">No properties available</p>
          </div>
        )
      }



    return (
         <div className="min-h-screen bg-gray-50 p-6">
          
      
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Available Properties
      </h1>

      

      
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            id = {property.id}
            title={property.title}
            location={property.location}
            price={property.rent}
            image={property.images?.[0]?.imageUrl}
          />
        ))}
      </div>

    </div>
    );
};
export default Home;