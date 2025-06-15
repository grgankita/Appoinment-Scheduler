import React from "react";
import { assets } from "../assets/assets.js";

const About = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          ABOUT <span className="text-gray-700 font-medium">US</span>
        </p>
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.about_image}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-md text-gray-600">
          <p>
            Welcome to TwingTonic, your go-to destination for effortless and
            stylish beauty appointments. At TwingTonic, we understand how
            challenging it can be to juggle a busy schedule while keeping up
            with your self-care routine. That’s why we’ve created a seamless
            booking experience tailored to your needs.
          </p>
          <p>
            TwingTonic is dedicated to excellence in beauty and wellness
            technology. We continuously innovate our platform, integrating the
            latest advancements to ensure a smooth and enjoyable booking
            process. Whether it’s your first visit or a regular touch-up, we’re
            here to make every appointment effortless and enjoyable.
          </p>
          <b className="text-gray-800">Our Vision</b>
          <p>
            Our vision at TwingTonic is to redefine the way you book and
            experience beauty services. We aim to bridge the gap between clients
            and top-tier stylists, making it easier than ever to look and feel
            your best—whenever you desire.
          </p>
        </div>
      </div>
      <div className="text-xl my-4">
        <p>
          WHY <span className="text-gray-700 font-semibold">CHOOSE US</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>EFFICIENCY:</b>
          <p>Streamlined booking that fits into your busy life.</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>CONVENIENCE:</b>
          <p>
            Access to a curated network of skilled stylists and beauty
            professionals.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>PERSONALIZATION:</b>
          <p>
            Tailored recommendations and reminders to keep your beauty routine
            on track.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
