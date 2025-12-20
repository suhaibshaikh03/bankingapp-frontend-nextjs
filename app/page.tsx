import Features from "./components/Features";
import WhyChooseUs from "./components/WhyChooseUs";
import LiveStatistics from "./components/LiveStatistics";
import OurServices from "./components/OurServices";
import Testimonials from "./components/Testimonials";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Features />
      <WhyChooseUs />
      <LiveStatistics />
      <OurServices />
      <Testimonials />
    </main>
  );
}

