import { useEffect, useState } from "react";
import { useNavigationType, useLocation } from "react-router-dom";
import LoadingMM from "./LoadingMM";
function LoadingWrapper({ children }) {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);

    // Simulate loading delay or actual data fetching
    const timer = setTimeout(() => setLoading(false), 500);

    return () => clearTimeout(timer);
  }, [location]);

  return loading ? <LoadingMM /> : children;
}

export default LoadingWrapper;
