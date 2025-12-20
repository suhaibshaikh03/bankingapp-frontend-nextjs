import Features from "./components/Features";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="z-10 w-full max-w-5xl items-center justify-center text-center p-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Banking App</h1>
        <p className="text-lg">Your trusted financial partner</p>
      </div>
      <Features />
    </main>
  );
}

