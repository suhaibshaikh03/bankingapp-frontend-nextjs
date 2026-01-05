import TransfersCards from '../components/TransfersCards';
import WhyChooseUs from '../components/WhyChooseUs';
import LiveStatistics from '../components/LiveStatistics';
import OurServices from '../components/OurServices';
import Testimonials from '../components/Testimonials';

export default function TransfersPage() {
  return (
    <main className="flex flex-col overflow-x-hidden">
      <TransfersCards />
      <WhyChooseUs />
      <LiveStatistics />
      <OurServices />
      <Testimonials />
    </main>
  );
}