import React from "react";
import { HeroParallax } from "../components/ui/hero-parallax";


export const Offchain = () => {
  const products = [
    {
      title: "sam-pypi",
      link: "https://pypi.org/project/sam-cli/",
      thumbnail: "/images/pypi.jpg",
    },
    {
      title: "sam-npm",
      link: "https://www.npmjs.com/package/sam-cli-npm",
      thumbnail: "images/npm.jpg",
    },
    {
        title:'report',
        link:'',
        thumbnail:'images/report.jpg'
    },
    {
        title: 'code',
        link:'',
        thumbnail:'images/code.jpg'
    }
  ];

  return (
    <>
      <HeroParallax products={products} />
    </>
  );
};

export default Offchain;
