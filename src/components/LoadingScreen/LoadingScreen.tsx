import React from "react";
import BackgroundGradient from "../BackgroundGradient";
import BackgroundGradientSmall from "./components/BackgroundGradientSmall";
import BackgroundGradientMedium from "./components/BackgroundGradientMedium";
import "./animations.css";
import LargeStart from "../icons/LargeStar";
import SmallStart from "../icons/SmallStart";
import { useFormStatus } from "react-dom";

export const LoadingScreen: React.FC = () => {
  const { pending } = useFormStatus();

  if (!pending) return null;

  return (
    <div className="fixed top-0 right-0 left-0 flex flex-col items-center justify-center min-h-screen bg-white overflow-hidden">
      <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center animate-background">
        <BackgroundGradient />
      </div>
      <div className="absolute top-[30%] left-[20%] animate-background-small">
        <BackgroundGradientSmall />
      </div>
      <div className="absolute bottom-[20%] right-[20%] animate-background-small">
        <BackgroundGradientMedium />
      </div>
      <div className="absolute flex flex-col items-center text-center">
        <div className="relative">
          <span
            className="twinkle-rotate-opacity absolute"
            style={{ top: "-100px", left: "-80px" }}
          >
            <LargeStart />
          </span>
          <span
            className="twinkle-rotate-opacity absolute"
            style={{ top: "-30px", left: "30px" }}
          >
            <SmallStart />
          </span>
        </div>
        <h1 className="text-[#4338CA] text-3xl font-semibold font-roboto leading-[40px] mt-8">
          We are working on your form...
        </h1>
        <p className="text-gray-700 mt-2">
          Wait a minute, worthy things take time!
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
