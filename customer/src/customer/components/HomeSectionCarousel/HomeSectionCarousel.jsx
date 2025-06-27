import React, { useRef } from "react";
import AliceCarousel from "react-alice-carousel";
import ProductCard from "../Product/ProductCard";
import HomeSectionCard from "../HomeSectionCard/HomeSectionCard";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const HomeSectionCarousel = ({data,sectionName}) => {
  const carouselRef = useRef(null);

  const responsive = {
    0: { items: 1 },
    720: { items: 3 },
    1024: { items: 4 },
  };

  const items = data.slice(0,10).map((item, idx) => (
    <div key={idx} className="mx-2">
      <ProductCard product={item} />
    </div>
  ));

  const sliderPrev = () => {
    if (carouselRef.current) {
      carouselRef.current.slidePrev();
    }
  };

  const sliderNext = () => {
    if (carouselRef.current) {
      carouselRef.current.slideNext();
    }
  };

  return (
    <div className="relative px-2 lg:px-4">
      <h2 className="text-2x1 font-extrabold text-gray-800 py-5">{sectionName}</h2>
      <div className="relative py-2">
        <AliceCarousel
          ref={carouselRef}
          items={items}
          disableButtonsControls
          disableDotsControls
          responsive={responsive}
          infinite
          keyboardNavigation
        />

        {/* Left and Right Clickable Icons */}
        <button
          onClick={sliderPrev}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-300 text-gray-700 rounded-full p-2 transition duration-300 z-10 shadow"
          style={{ display: "block" }}
        >
          <KeyboardArrowLeftIcon />
        </button>

        <button
          onClick={sliderNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-300 text-gray-700 rounded-full p-2 transition duration-300 z-10 shadow"
          style={{ display: "block" }}
        >
          <KeyboardArrowRightIcon />
        </button>
      </div>
    </div>
  );
};

export default HomeSectionCarousel;
