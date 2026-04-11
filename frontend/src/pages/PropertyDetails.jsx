import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function PropertyDetails(){
    const { id } = useParams();

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProperty = async () => {
        try {
            const res = await API.get(`/property/${id}`);
            setProperty(res.data);
        } catch(err){
            console.error("Error fetching property", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperty();
    },[id]);
   const scrollRef = useRef(null);
const scrollLeft = () => {
  if(scrollRef.current){
    scrollRef.current.scrollBy({left : -300, behaviour : "smooth"});
  }
};

const scrollRight = () => {
  if(scrollRef.current){
    scrollRef.current.scrollBy({left : 300, behaviour : "smooth"});
  }
}
    if(loading){
        return (
            <div className = "min-h-screen flex items-center justify-center">
                 <p className="text-gray-500">Loading property...</p>
             </div>
        )
    }
    if(!property){
        return (
             <div className="min-h-screen flex items-center justify-center">
               <p className="text-gray-500">Property not found</p>
             </div>
        )
    }


    const handleRent = async () => {
      try{
        const token = localStorage.getItem("token");

        if(!token){
          alert("Please login first");
          window.location.href = "/login";
          return;
        }
        await API.post(
          `/property/rent/${id}`,
          {},
          {
            headers : {
              Authorization : `Bearer ${token}`,
            },
          }

        );
        alert("Property rented successfully");

        setProperty({...property, isAvailable : false});
      } catch(err){
        console.error("Rent failed", err);
        alert("Failed to rent property");
      }
    }


    return (
    <div className="min-h-screen  bg-gray-50 p-6">
      
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">

        <div className="relative h-full bg-gray-200">

  {/* LEFT BUTTON */}
  <button
    onClick={scrollLeft}
    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow px-3 py-1 rounded-full"
  >
    ←
  </button>

  {/* RIGHT BUTTON */}
  <button
    onClick={scrollRight}
    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow px-3 py-1 rounded-full"
  >
    →
  </button>

  {/* IMAGES */}
  <div
    ref={scrollRef}
    className="h-full overflow-x-auto flex scroll-smooth"
  >
    {property.images && property.images.length > 0 ? (
      property.images.map((img, index) => (
        <img
          key={index}
          src={img.imageUrl}
          alt={property.title}
          className="w-full h-full object-cover flex-shrink-0"
        />
      ))
    ) : (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        No Image
      </div>
    )}
  </div>

</div>
        {/* Content */}
        <div className="p-6 space-y-4">

          <h1 className="text-2xl font-semibold text-gray-800">
            {property.title}
          </h1>

          <p className="text-gray-500">
            {property.location}
          </p>

          <p className="text-yellow-700 text-xl font-semibold">
            ₹{property.rent}/month
          </p>

          {/* Owner */}
          {property.owner && (
            <p className="text-gray-600">
              Owner: {property.owner.name}
            </p>
          )}

          {/* Button */}
         <button
            onClick={handleRent}
            disabled={!property.isAvailable}
            className={`mt-4 px-6 py-2 rounded-lg text-white ${
            property.isAvailable
           ? "bg-yellow-500 hover:bg-yellow-600"
          : "bg-gray-400 cursor-not-allowed"
  }`}
>
  {property.isAvailable ? "Rent Now" : "Rented"}
</button>

        </div>

      </div>

    </div>
  );

}
export default PropertyDetails;
