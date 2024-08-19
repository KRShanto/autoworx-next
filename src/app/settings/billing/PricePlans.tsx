import React from 'react';
import Image from 'next/image';

interface PricePlansProps {
  setClose : () => void;
  setSelectedPlan: (planName: string) => void;
}
export function PricePlans({ setClose, setSelectedPlan }: PricePlansProps) {

  const handlePlanSelect = (planName: string) => {
    setSelectedPlan(planName);
    setClose();
  }
  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-hidden py-20">
      <div className="relative mx-auto max-w-8xl px-4">
        <div className="flex justify-center space-x-6 w-[1000px]"> 
          {/* Plan 1 */}
          <div className="w-full max-w-xl rounded-md bg-white shadow-lg">
            <div className="flex flex-col items-center p-6 pt-0">
            <div className="mb-4">
                <button
                  type="button"
                  className="bg-gray-500 text-white py-2 px-4 rounded-sm"
                  onClick={() => handlePlanSelect("Autoworx Basic Plan")}
                >
                  Current Plan
                </button>
              </div>
            <Image
              src="/icons/CompanyLogo1.svg"
              width={200}
              height={200}
              alt="Company logo"
            ></Image>
              <h2 className="text-lg font-semibold text-gray-500 mt-4 mb-4">Autoworx Basic Plan</h2>
              <ul className="text-gray-600">
                <li className="flex items-center mb-2">
                  <span className="mr-2 ">✔</span> Feature 1
                </li>
                <li className="flex items-center mb-2">
                  <span className="mr-2 ">✔</span> Feature 2
                </li>
                <li className="flex items-center mb-2">
                  <span className="mr-2 ">✔</span> Feature 3
                </li>
                <li className="flex items-center mb-2">
                  <span className="mr-2 text-gray-400">✖</span> Feature 4
                </li>
                <li className="flex items-center mb-2">
                  <span className="mr-2 text-gray-400">✖</span> Feature 5
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-gray-400">✖</span> Feature 6
                </li>
              </ul>
             
            </div>
          </div>
          {/* Plan 2 */}
          <div className="w-full max-w-sm rounded-md bg-white shadow-lg">
            <div className="flex flex-col items-center p-6 pt-0">
            <div className="mb-4">
                <button
                  type="button"
                  className="bg-[#6571FF] text-white py-2 px-4 rounded-sm hover:bg-blue-600"
                  onClick={()=>handlePlanSelect("Autoworx Standard Plan")}
                >
                  Choose Plan
                </button>
              </div>
            <Image
              src="/icons/CompanyLogo2.svg"
              width={200}
              height={200}
              alt="Company logo"
            ></Image>
              <h2 className="text-lg font-semibold text-[#6571FF] mt-4 mb-4">Autoworx Standard Plan</h2>
              <ul className="text-gray-600">
                <li className="flex items-center mb-2">
                  <span className="mr-2 ">✔</span> Feature 1
                </li>
                <li className="flex items-center mb-2">
                  <span className="mr-2 ">✔</span> Feature 2
                </li>
                <li className="flex items-center mb-2">
                  <span className="mr-2 ">✔</span> Feature 3
                </li>
                <li className="flex items-center mb-2">
                  <span className="mr-2 ">✔</span> Feature 4
                </li>
                <li className="flex items-center mb-2">
                  <span className="mr-2 text-gray-400">✖</span> Feature 5
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-gray-400">✖</span> Feature 6
                </li>
              </ul>
              
            </div>
          </div>
          {/* Plan 3 */}
          <div className="w-full max-w-sm rounded-md bg-white shadow-lg ">
            <div className="flex flex-col items-center p-6 pt-0 ">
            <div className="mb-4">
                <button
                  type="button"
                  className="bg-yellow-500 text-white py-2 px-4 rounded-sm hover:bg-yellow-600"
                  onClick={() => handlePlanSelect("Autoworx Premium Plan")}
                >
                  Choose Plan
                </button>
              </div>
            <Image
              src="/icons/CompanyLogo3.svg"
              width={200}
              height={200}
              alt="Company logo"
              
              
            ></Image>
              <h2 className="text-lg font-semibold text-yellow-500 mt-4 mb-4">Autoworx Premium Plan</h2>
              <ul className="text-gray-600">
                <li className="flex items-center mb-2">
                  <span className="mr-2 ">✔</span> Feature 1
                </li>
                <li className="flex items-center mb-2">
                  <span className="mr-2 ">✔</span> Feature 2
                </li>
                <li className="flex items-center mb-2">
                  <span className="mr-2 ">✔</span> Feature 3
                </li>
                <li className="flex items-center mb-2">
                  <span className="mr-2 ">✔</span> Feature 4
                </li>
                <li className="flex items-center mb-2">
                  <span className="mr-2 ">✔</span> Feature 5
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✔</span> Feature 6
                </li>
              </ul>
            
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
