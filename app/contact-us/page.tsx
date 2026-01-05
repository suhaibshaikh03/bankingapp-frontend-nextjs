import ContactForm from '../components/ContactForm';

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-gray-600 text-lg">
              Have questions or feedback? Reach out to us and our team will get back to you as soon as possible.
            </p>
          </div>

          <ContactForm />
        </div>
      </div>
    </div>
  );
}