import Hero from './components/hero';
import Header from './components/Header'; 
import Eruda from "./components/Eruda";
import AnimeSelector from "./components/AnimeSelector";  
import GenreQuickAccess from './components/GenreQuickAccess';  

export default function Home() {
  return (
    <main>
      <Eruda />
      <Header />
      <Hero />
      <GenreQuickAccess />  
      <AnimeSelector />  
    </main>
  );
}
