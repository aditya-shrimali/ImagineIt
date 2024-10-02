import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Home, CreatePost, Register, Login } from "./pages";
import { useEffect, useState } from "react";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token });
    }
  }, []);

  return (
    <BrowserRouter>
      <header className="w-full flex justify-between items-center bg-white sm:px-8 px-4 py-2 border-b">
        <Link to="/home" className="text-2xl font-semibold text-gray-800 ">
          IMAGINE.it
        </Link>
        <div className="flex gap-3">
          <Link
            to="/create-post"
            className="bg-gray-800 text-white px-4 py-1.5 rounded-md"
          >
            Create
          </Link>
          {user ? (
            <Link
              to="/login"
              className="bg-gray-800 text-white px-4 py-1.5 rounded-md"
              onClick={() => {
                localStorage.removeItem("token");
                setUser(null);
              }}
            >
              Logout
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-gray-800 text-white px-4 py-1.5 rounded-md"
            >
              Login
            </Link>
          )}
        </div>
      </header>
      <main className="sm:p-8 p-4 py-8 w-full bg-slate-100 min-h-[calc(100vh-73px)]">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
