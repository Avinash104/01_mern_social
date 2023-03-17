import LoginRegisterForm from "components/LoginRegisterForm"
import Navbar from "components/Navbar"

const Loginpage = () => {
  return (
    <div className="bg-gray-200 h-screen w-full">
      <Navbar />
      <LoginRegisterForm />
      <h1>Login Page</h1>
    </div>
  )
}

export default Loginpage
