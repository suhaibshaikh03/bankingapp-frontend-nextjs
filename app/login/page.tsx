import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <div className="lg:w-1/2 w-full flex items-center justify-center px-8 py-12 bg-gradient-to-br from-blue-50 to-indigo-100">
          <LoginForm />
        </div>

        <div className="lg:w-1/2 hidden lg:block">
          <div className="w-full h-full">
            <img
              src="/pexels-pixabay-164527.jpg"
              alt="Banking security concept"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;