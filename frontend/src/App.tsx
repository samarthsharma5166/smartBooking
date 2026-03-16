import { Route, Routes } from "react-router-dom"
import AdminDashboardLayout from "./components/Layouts/AdminDashboardLayout"
import Login from "./components/Pages/Login"
import Booking from "./components/Pages/Booking"
import DoctorAvaliability from "./components/Pages/DoctorAvaliability"
import Settings from "./components/Pages/Settings"
import SessionTypes from "./components/Pages/SessionTypes"
import BookingSuccess from "./components/Pages/BookingSuccess"
import Appointments from "./components/Pages/Appointments"

const Dashboard = () => <div className="h-full flex justify-center items-center">
  <div>
   < h1 className="text-6xl font-bold">Welcome to the Dashboard! 🙋🏻‍♀️</h1>
  </div>
</div>

// const Settings = () => <div>Settings Page</div>

const App = () => {
  return (
    <div className="w-full h-full">
      <Routes>
        <Route path="/" element={<Booking/>}/>
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/admin" element={<AdminDashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="avaliability" element={<DoctorAvaliability />} />
          <Route path="settings" element={<Settings />} />
          <Route path="session-types" element={<SessionTypes />} />
          <Route path="appointments" element={<Appointments />} />
        </Route>
        <Route path="/11/22/33/44" element={<Login/>}/>
      </Routes>
    </div>
  )
}

export default App