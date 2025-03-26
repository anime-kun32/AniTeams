import Hero from './components/hero';
import Header from './components/Header'; 
import Eruda from "./components/Eruda";
import AnimeSelector from "./components/AnimeSelector";  

export default function Home() {
  return (
    <main>
      <Eruda />
      <Header />
      <Hero />
      <AnimeSelector />  
    </main>
  );
}
