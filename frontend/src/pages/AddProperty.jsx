import {useState} from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
function AddProperty(){
    const[form, setForm] = useState({
        title : "",
        location : "",
        size : "",
        rent : ""
    });
    const [images, setImages] = useState([]);
    const navigate = useNavigate();
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const data = new FormData();

            data.append("title", form.title);
            data.append("location", form.location);
            data.append("size", form.size);
            data.append("rent", form.rent);

            for(let i = 0; i < images.length; i++){
                data.append("images", images[i]);
            }
            await API.post("/property/add", data, {
                headers : {
                    Authorization : `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            alert("Property added");
            navigate("/dashboard");
            

        } catch(err){
            console.error("Add failed", err);
            alert("Failed to add property");
        }
    }
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">

  <input name="title" placeholder="Title" onChange={handleChange} />
  <input name="location" placeholder="Location" onChange={handleChange} />
  <input name="size" placeholder="Size" onChange={handleChange} />
  <input name="rent" placeholder="Rent" onChange={handleChange} />

  <input type="file" multiple onChange={handleImageChange} />

  <button type="submit">Add Property</button>

</form>
    )

};
export default AddProperty;