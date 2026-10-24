import { Navigate, Route, Routes } from 'react-router'
import { FeedbackProvider } from './components/Feedback'
import { CustomerLayout } from './layouts/CustomerLayout'
import { DashboardLayout } from './layouts/DashboardLayout'
import BookDone from './pages/customer/BookDone'
import BookFlow from './pages/customer/BookFlow'
import Landing from './pages/customer/Landing'
import MyBooking from './pages/customer/MyBooking'
import NotFound from './pages/customer/NotFound'
import Availability from './pages/dashboard/Availability'
import Bookings from './pages/dashboard/Bookings'
import Calendar from './pages/dashboard/Calendar'
import Customers from './pages/dashboard/Customers'
import Services from './pages/dashboard/Services'
import Settings from './pages/dashboard/Settings'
import Today from './pages/dashboard/Today'

export default function App() {
  return (
    <FeedbackProvider>
      <Routes>
        <Route element={<CustomerLayout />}>
          <Route index element={<Landing />} />
          <Route path="book" element={<BookFlow />} />
          <Route path="book/done/:ref" element={<BookDone />} />
          <Route path="my-booking" element={<MyBooking />} />
        </Route>
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="today" replace />} />
          <Route path="today" element={<Today />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="customers" element={<Customers />} />
          <Route path="services" element={<Services />} />
          <Route path="availability" element={<Availability />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route element={<CustomerLayout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </FeedbackProvider>
  )
}
