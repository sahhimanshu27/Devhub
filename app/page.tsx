import { Footer } from "./components/footer";
import Header from "./components/header";
import Posts from "./components/posts";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <Posts />
      <Footer />
    </div>
  );
}
