import AdsSection from "./components/AdsSection";
import HeroSection from "./components/HeroSection";
import Category from "./components/Category";
import Slider from "./components/SliderSection";
import Price from "./components/Price";
import TenderSection from "./components/TenderSection";
import ArticleSection from "./components/ArticleSection";
import EliteTradersSection from "./components/EliteTradersSection";
import SuggestionSection from "./components/SuggestionSection";
import InfoHeader from "./components/InfoHeader";
import ReadeMore from "./components/ReadeMore";
import Partners from "./components/Partners";
import Contacts from "./components/Contacts";
import PreFooter from "./components/PreFooter";
import Footer from "./components/Footer";
const HomePage = () => {
  //  throw new Error("Test error!");

  return (
    <>
      {/* <Loader /> */}
      <HeroSection />
      <Category />
      <Price />
      <Slider />
      <AdsSection />
      <TenderSection />
      <ArticleSection />
      <EliteTradersSection />
      <SuggestionSection />
      <InfoHeader />
      <ReadeMore />
      <Partners/>
      <Contacts/>
      <PreFooter/>
      <Footer/> 
      {/* </div> */}
    </>
  );
};

export default HomePage;
