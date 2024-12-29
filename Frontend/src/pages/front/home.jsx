import React, { useContext } from "react";
import Slider from "../../components/FrontLayout/slider";
import Promotion from "../../components/FrontLayout/promotion";
import TrendingItems from "../../components/FrontLayout/trending-items";

function Home() {
  return (
    <div>
      <Slider />
      <Promotion />
      {/* <TrendingItems /> */}
    </div>
  );
}

export default Home;
