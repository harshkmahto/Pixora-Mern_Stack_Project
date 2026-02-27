import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../components/Home";
import LoginSignup from "../pages/auth/LoginSignup";
import MyAccount from "../pages/auth/MyAccount";
import AdminPannel from "../pages/admin/AdminPannel";
import AllUsers from "../pages/admin/AllUsers";
import Dashbord from "../pages/admin/Dashbord";
import AllService from "../pages/admin/AllService";
import BookingStatus from "../pages/admin/BookingStatus";
import AllBooking from "../pages/admin/AllBooking";
import ServiceCategory from "../pages/ServiceCategory";
import ServiceDetails from "../pages/ServiceDetails";
import PersonalDetails from "../pages/auth/PersonalDetails";
import Checkout from "../pages/auth/Checkout";
import MyBooking from "../pages/auth/MyBooking";
import ProtectedRoute from "../components/auth/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "/auth", element: <LoginSignup /> },
      { path: "/account", element: <MyAccount /> },
      { path: "/service-category", element: <ServiceCategory /> },
      { path: "/service/:id", element: <ServiceDetails /> },
      { path: "/personal-details", element: <PersonalDetails /> },
      { path: "/checkout/:id", element: <Checkout /> },
      { path: "/my-booking", element: <MyBooking /> },

      // 👑 ADMIN ROUTES
      {
        path: "/admin",
        element: <ProtectedRoute role="admin" />,
        children: [
          {
            element: <AdminPannel />, // Layout
            children: [
              { index: true, element: <Dashbord /> },
              { path: "all-users", element: <AllUsers /> },
              { path: "all-service", element: <AllService /> },
              { path: "booking-status", element: <BookingStatus /> },
              { path: "all-booking", element: <AllBooking /> },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;