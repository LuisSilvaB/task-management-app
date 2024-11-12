"use client";

import TaksManagementBody from "@/app/components/layout/taksManagementBody";
import TaksManagementHeader from "@/app/components/layout/taksManagementHeader";

export default function Home() {

  return (  
    <div className="w-full flex flex-1 flex-col items-center justify-center border ">
      <div className="lg:max-w-[35vw] lg:max-h-[80vh] w-full flex justify-center items-center flex-col h-full p-4 shadow-lg rounded-md bg-white">
        <TaksManagementHeader />
        <TaksManagementBody />
      </div>
    </div>
  );
}
