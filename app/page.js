import Hero from './components/hero';
import Header from './components/Header';
import AnimeSelector from "./components/AnimeSelector";
import GenreQuickAccess from './components/GenreQuickAccess';
import OnAir from './components/OnAir';  

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <GenreQuickAccess />
      <AnimeSelector />
      <OnAir />  
    </main>
  );
}