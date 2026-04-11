import Button from "./Button";

function Navbar(){
    const token = localStorage.getItem("token");

    function handleLogout(){
        localStorage.removeItem("token");
        window.location.href = "/";

    };
    return (
        <nav className = "w-full b-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            {/* Left: Logo / App Name */}
      <h1 className="text-xl font-semibold text-gray-800 cursor-pointer">
        Rentify
      </h1>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {!token ? (
          <>
            <button
              onClick={() => (window.location.href = "/login")}
              className="text-gray-700 hover:text-yellow-600 font-medium"
            >
              Login
            </button>

            <Button onClick={() => (window.location.href = "/register")}>
              Register
            </Button>
          </>
        ) : (
          <Button onClick={handleLogout}>Logout</Button>
        )}
      </div>


        </nav>
    );
};
export default Navbar;