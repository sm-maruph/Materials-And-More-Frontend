import React from "react";

const BottomHeader = () => {
  return (
    <div className="bg-mm-primary text-white py-2 px-4 w-full">
      <div className="w-full max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-center sm:text-left text-xs sm:text-sm font-sans leading-tight tracking-wide">
        
        {/* <p className="w-full sm:w-auto font-semibold">
          Materials & More Enterprise (M&M)
        </p> */}

        <p className="w-full sm:w-auto">
          <strong>Corporate Office:</strong> Setu Homes, 55-Box Nagar, Zoo Road, Mirpur-1, Dhaka-1216
        </p>

        <p className="w-full sm:w-auto">
          <strong>Sales Office:</strong> 1244/1, Kamrangar Chala, Mouchak, Kaliakoir, Gazipur
        </p>

        <p className="w-full sm:w-auto">
          <strong>Contact No.:</strong> +88 01755 736243, +88 01819 757777
        </p>

        <p className="w-full sm:w-auto">
  <strong>Email:</strong>{" "}
  <a
    href="mailto:sales@materialsnmore.com"
    className="no-underline hover:underline text-white"

  >
    sales@materialsnmore.com
  </a>,{" "}
  <a
    href="mailto:mnmenterprise777@gmail.com"
    className="no-underline hover:underline text-white"

  >
    mnmenterprise777@gmail.com
  </a>
</p>


      </div>
    </div>
  );
};

export default BottomHeader;
