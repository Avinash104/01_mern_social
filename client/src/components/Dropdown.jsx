import { useState } from "react"
import { useDispatch } from "react-redux"
import { setLogout } from "state"

const Dropdown = () => {
  const [isActive, setIsActive] = useState(false)
  const dispatch = useDispatch()

  return (
    <div className="relative">
      <button
        onClick={() => setIsActive((state) => !state)}
        className="h-8 w-24 text-xs rounded-lg bg-gray-400 hover:bg-slate-600"
      >
        Dropdown
      </button>
      {isActive && (
        <div
          onClick={() => dispatch(setLogout())}
          className="absolute z-10 top-8 text-xs p-2 bg-lime-600 w-full cursor-pointer"
        >
          Logout
        </div>
      )}
    </div>
  )
}

export default Dropdown
