import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const AutoScrollUp = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // this component doesn't render anything
};

export default AutoScrollUp;
