import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Home, CreatePost } from "./pages";

const App = () => {
  return (
    <BrowserRouter>
      <header className="w-full flex justify-between items-center bg-white sm:px-8 px-4 py-2 border-b">
        <Link to="/">LOGO</Link>
        <Link
          to="/create-post"
          className="bg-gray-800 text-white px-4 py-1.5 rounded-md"
        >
          Create
        </Link>
      </header>
      <main className="sm:p-8 p-4 py-8 w-full bg-slate-100 min-h-[calc(100vh-73px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
