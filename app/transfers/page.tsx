import TransfersCards from '../components/TransfersCards';
import WhyChooseUs from '../components/WhyChooseUs';
import LiveStatistics from '../components/LiveStatistics';
import OurServices from '../components/OurServices';
import Testimonials from '../components/Testimonials';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

export default function TransfersPage() {
  return (
    <ProtectedRoute>
      <main className="flex flex flex-col overflow-x-hidden">
        <TransfersCards />
        <WhyChooseUs />
        <LiveStatistics />
        <OurServices />
        <Testimonials />
      </main>
    </ProtectedRoute>
  );
}