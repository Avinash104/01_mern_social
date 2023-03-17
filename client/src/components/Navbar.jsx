import {
  BellIcon,
  ChatBubbleLeftIcon,
  MoonIcon,
  QuestionMarkCircleIcon,
  SunIcon,
} from "@heroicons/react/24/solid"
import { useDispatch, useSelector } from "react-redux"
import { setMode } from "state"
import Dropdown from "./Dropdown"

const Navbar = () => {
  const mode = useSelector((state) => state.mode)
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  return (
    <div className="h-16 p-5 bg-white shadow-lg">
      <div className="flex justify-evenly items-center">
        <div>
          <h1 className="text-xl text-red-700">Sociopedia</h1>
        </div>
        {user && (
          <div className="flex justify-evenly items-center space-x-4">
            <button onClick={() => dispatch(setMode())}>
              {mode === "dark" ? (
                <MoonIcon className="h-6 w-6" />
              ) : (
                <SunIcon className="h-6 w-6" />
              )}
            </button>
            <ChatBubbleLeftIcon className="h-6 w-6" />
            <BellIcon className="h-6 w-6" />
            <QuestionMarkCircleIcon className="h-6 w-6" />
            <Dropdown />
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
