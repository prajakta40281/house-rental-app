const Button = ({children, onClick, type = "button"}) => {
    return (
        <>
        <button 
        type = {type}
        onClick = {onClick}
        className = "px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition"
        >
            {children}
        </button>
        </>
    )
}
export default Button;