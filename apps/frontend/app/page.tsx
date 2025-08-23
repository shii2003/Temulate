import LandingPageFooter from "@/components/Footer/LandingPageFooter";
import Tagline from "@/components/logo/Tagline";
import Navbar from "@/components/Navbar/Navbar";

import GetStartedButton from "@/components/ui/buttons/GetStartedButton";
import HomePageCard from "@/components/ui/Cards/HomePageCard";



export default function Home() {
  return (

    <div className="flex flex-col  items-center justify-center  min-h-screen">
      <div className="w-full flex items-center justify-center top-0 left-0 fixed z-40">
        <Navbar />
      </div>
      <div className="flex grow justify-center mt-[8rem] ">
        <div className="flex  flex-col gap-7">
          <Tagline />
          <p className="text-gray-400 text-center text-lg  font-semibold">
            Empowering teams to build, share, and grow together.
          </p>
          <div className="flex items-center justify-center">
            <GetStartedButton />
          </div>
          <div className="flex items-center justify-center w-full ">
            <HomePageCard />
          </div>

          <HomePageCard />
          <HomePageCard />
          <HomePageCard />
          <HomePageCard />
          <div className="flex items-center justify-center w-full">
            <HomePageCard />
          </div>
        </div>
      </div>
      <div className="w-full mt-4">
        <LandingPageFooter />
      </div>
    </div>

  );
}

