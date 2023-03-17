import { Formik } from "formik"
import { useState } from "react"
import Dropzone from "react-dropzone"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setLogin } from "state"
import * as yup from "yup"

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
})

const loginSchema = yup.object().shape({
  email: yup.string().required("required"),
  password: yup.string().required("required"),
})

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
}

const initialValuesLogin = {
  email: "",
  password: "",
}
const LoginRegisterForm = () => {
  const [pageType, setPageType] = useState("login")
  const isLogin = pageType === "login"
  const isRegister = pageType === "register"
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const register = async (values, onSubmitProps) => {
    //can not send values directly even though its organised in order because the form contains picture
    const formData = new FormData()
    for (let value in values) {
      formData.append(value, values[value])
    }
    formData.append("picturePath", values.picture.name)

    const savedUserResponse = await fetch(
      "http://localhost:3001/auth/register",
      {
        method: "POST",
        body: formData,
      }
    )
    const savedUser = await savedUserResponse.json()
    onSubmitProps.resetForm()

    if (savedUser) {
      setPageType("login")
    }
  }

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
    const loggedIn = await loggedInResponse.json()
    onSubmitProps.resetForm()
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      )
      navigate("/home")
    }
  }

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps)
    if (isRegister) await register(values, onSubmitProps)
  }
  return (
    <div className="bg-white md:w-1/3 mx-auto rounded-lg p-5 mt-10 ">
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
        validationSchema={isLogin ? loginSchema : registerSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-4">
              {isRegister && (
                <>
                  <input
                    placeholder="First Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    name="firstName"
                    error={
                      Boolean(touched.firstName)
                        ? Boolean(errors.firstName)
                        : undefined
                    }
                    helpertext={touched.firstName && errors.firstName}
                    className="border-teal-700 p-1 px-1.5 text-lime-500 border-2 rounded-lg col-span-2 md:col-span-1 min-64"
                  />
                  <input
                    placeholder="Last Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    name="lastName"
                    error={
                      Boolean(touched.lastName)
                        ? Boolean(errors.lastName)
                        : undefined
                    }
                    helpertext={touched.lastName && errors.lastName}
                    className="border-teal-700 p-1 px-1.5 text-lime-500 border-2 rounded-lg col-span-2 md:col-span-1"
                  />
                  <input
                    placeholder="Location"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.location}
                    name="location"
                    error={
                      Boolean(touched.location)
                        ? Boolean(errors.location)
                        : undefined
                    }
                    helpertext={touched.location && errors.location}
                    className="border-teal-700 p-1 px-1.5 text-lime-500 border-2 rounded-lg col-span-2"
                  />
                  <input
                    placeholder="Occupation"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.occupation}
                    name="occupation"
                    error={
                      Boolean(touched.occupation)
                        ? Boolean(errors.occupation)
                        : undefined
                    }
                    helpertext={touched.occupation && errors.occupation}
                    className="border-teal-700 p-1 px-1.5 text-lime-500 border-2 rounded-lg col-span-2"
                  />
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div
                        className="hover:cursor-pointer border-dashed"
                        {...getRootProps()}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <div>
                            <section>{values.picture.name}</section>
                          </div>
                        )}
                      </div>
                    )}
                  </Dropzone>
                </>
              )}

              <input
                placeholder="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={
                  Boolean(touched.email) ? Boolean(errors.email) : undefined
                }
                helpertext={touched.email && errors.email}
                className="border-teal-700 p-1 px-1.5 text-lime-500 border-2 rounded-lg col-span-2"
              />
              <input
                placeholder="Password"
                type="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={
                  Boolean(touched.password)
                    ? Boolean(errors.password)
                    : undefined
                }
                helpertext={touched.password && errors.password}
                className="border-teal-700 p-1 px-1.5 text-lime-500 border-2 rounded-lg col-span-2"
              />
            </div>

            {/* Buttons  */}

            <button className="hover:cursor-pointer w-full bg-indigo-500 hover:bg-indigo-700 text-base hover:text-lg hover:p-1.5 my-4 rounded-full text-white p-2">
              {isLogin ? "LOGIN" : "REGISTER"}
            </button>
            <div
              onClick={() => {
                setPageType(isLogin ? "register" : "login")
                resetForm()
              }}
              className="hover:cursor-pointer hover:underline hover:text-blue-700 my-3"
            >
              {pageType === "login"
                ? "No account? Signup here!"
                : "Already got an account? Login here."}
            </div>
          </form>
        )}
      </Formik>
    </div>
  )
}

export default LoginRegisterForm
