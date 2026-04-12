import Button from "./Button";

function Navbar() {
  const token = localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      
      {/* Left */}
      <h1
        onClick={() => (window.location.href = "/")}
        className="text-xl font-semibold text-gray-800 cursor-pointer"
      >
        Rentify
      </h1>

      {/* Right */}
      <div className="flex items-center gap-6">

        {token && (
          <>
            {/* Dashboard (light, not a button) */}
            <span
              onClick={() => (window.location.href = "/dashboard")}
              className="text-gray-600 hover:text-yellow-600 cursor-pointer font-medium"
            >
              Dashboard
            </span>

            {/* Logout (main action) */}
            <Button onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}

        {!token && (
          <>
            <span
              onClick={() => (window.location.href = "/login")}
              className="text-gray-600 hover:text-yellow-600 cursor-pointer font-medium"
            >
              Login
            </span>

            <Button onClick={() => (window.location.href = "/register")}>
              Register
            </Button>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;