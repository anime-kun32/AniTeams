import Hero from './components/hero';
import Eruda from "./components/Eruda";
import Header from './components/Header';
import AnimeSelector from "./components/AnimeSelector";
import GenreQuickAccess from './components/GenreQuickAccess';
import OnAir from './components/OnAir';
import ResumeWatching from './components/ResumeWatching';  

export default function Home() {
  return (
    <main>
      <Hero />  {/* Hero stays at the top */}
      <Eruda />
      <Header />
      <GenreQuickAccess />
      <ResumeWatching />  
      <AnimeSelector />
      <OnAir />
    </main>
  );
}
