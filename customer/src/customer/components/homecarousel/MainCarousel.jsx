import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { mainCarouselData } from './MainCarouselData';


const MainCarousel = () => {
    
    const items = mainCarouselData.map((item)=>
    <img role='presentation' className='cursol-pointer -z-10' src={item.image} alt=""/>)

  return(  
    <AliceCarousel
         items={items}
         disableButtonsControls
         autoPlay
         autoPlayInterval={1000}
         infinite
 
    />
)
}

export default MainCarousel;