import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index path='/' element={<Home />} />
                <Route path='*' element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
