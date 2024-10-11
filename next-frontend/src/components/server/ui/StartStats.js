export const StartStats = () => {
    return (
      <div className="flex w-full tems-center items-center justify-center flex-col md:flex-row md:justify-between py-10">
        <div className=" w-1/3   flex flex-col justify-center items-center ">
          <p className="text-exalt text-[110px] font-bold">24/7</p>
          <p className=" w-full text-exalt-light  text-[24px] font-bold text-center">real-time data</p>
        </div>
        <div className="w-1/3   flex flex-col justify-center items-center ">
          <p className="text-exalt_second text-[110px] font-bold">100+</p>
          <p className="text-[24px] w-full text-exalt_second-light font-bold text-center ">business integrations</p>
        </div>
        <div className="w-1/3   flex flex-col justify-center items-center ">
          <p className="text-exalt text-[110px] font-bold">200K+</p>
          <p className="text-[24px] text-exalt-light font-bold text-center md:text-left">queries handled</p>
        </div>
      </div>
    );
  };
  