import PaymentsCards from '../components/PaymentsCards';
import WhyChooseUs from '../components/WhyChooseUs';
import LiveStatistics from '../components/LiveStatistics';
import OurServices from '../components/OurServices';
import Testimonials from '../components/Testimonials';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

export default function PaymentsPage() {
  return (
    <ProtectedRoute>
      <main className="flex flex-col overflow-x-hidden">
        <PaymentsCards />
        <WhyChooseUs />
        <LiveStatistics />
        <OurServices />
        <Testimonials />
      </main>
    </ProtectedRoute>
  );
}