import React from "react";

const LogoCard = () => {
  return (
    <div className="h-[65vh]">
      <div className="relative h-[600px] w-[404px] rounded-[19px] bg-white p-8 shadow-lg">
        <div className="font-inter absolute left-0 right-0 top-[50px] text-center text-[96px] font-extrabold leading-[116px] text-[#66738C]">
          Logo
        </div>

      
          <div className="absolute left-[105px] right-4 top-[326px]">
            <label
              className="font-inter block text-[16px] font-medium leading-[19px] text-[#66738C]"
              htmlFor="id"
            >
              ID
            </label>
            <input
              id="id"
              type="text"
              className="mt-2 h-[27px] w-[60%] rounded-[3px] border border-[#66738C] bg-white px-2"
            />
          </div>

          <div className="absolute left-[105px] right-4 top-[395px]">
            <label
              className="font-inter block text-[16px] font-medium leading-[19px] text-[#66738C]"
              htmlFor="key1"
            >
              Key 1
            </label>
            <input
              id="key1"
              type="text"
              className="mt-2 h-[27px] w-[60%] rounded-[3px] border border-[#66738C] bg-white px-2"
            />
          </div>

          <div className="absolute left-[105px] right-4 top-[463px]">
            <label
              className="font-inter block text-[16px] font-medium leading-[19px] text-[#66738C]"
              htmlFor="key2"
            >
              Key 2
            </label>
            <input
              id="key2"
              type="text"
              className="mt-2 h-[27px] w-[60%] rounded-[3px] border border-[#66738C] bg-white px-2"
            />
          </div>
        

        <button className="font-inter absolute left-[140px] top-[530px] rounded-md bg-[#6571FF] px-6 py-2 text-[21px] font-medium leading-[25px] text-white">
          Save
        </button>
      </div>
    </div>
  );
};

export default LogoCard;
