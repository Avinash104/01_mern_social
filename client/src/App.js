import { useSelector } from "react-redux"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Homepage from "scenes/homePage"
import Loginpage from "scenes/loginPage"
import Profilepage from "scenes/profilePage"

function App() {
  const mode = useSelector((state) => state.mode)
  return (
    <div className={`${mode === "dark" && "dark"}`}>
      <div className="dark:bg-slate-800">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Loginpage />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/profile/:userId" element={<Profilepage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  )
}

export default App
