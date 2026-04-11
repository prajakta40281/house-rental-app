const Input = ({type = "text", name, placeholder, value, onChange}) => {
    return (
        <input type={type} name = {name} placeholder = {placeholder} value = {value} onChange = {onChange}
        className = "w-full px-4 py-2.5 border border-gray-30 rounded-lg text-gray-800 placeholder-gray-40 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"/> 
    );
};
export default Input;