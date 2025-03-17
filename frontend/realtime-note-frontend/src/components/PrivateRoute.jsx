"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children }) => {
  const { accessToken } = useContext(AuthContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) {
        
      return;
    }

    const decodedToken = jwtDecode(accessToken);

    

    // Check if the token has expired
    const currentTime = Date.now() / 1000; 
    console.log("Token Expiration Time:", decodedToken.exp);
    console.log("Current Time:", currentTime);
    console.log("Is Token Expired?", decodedToken.exp < currentTime);

    if (decodedToken.exp < currentTime) {
      router.push("/login");
    } else {
      setIsLoading(false); 
    }
  }, [accessToken, router]);

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  
  return children;
};

export default PrivateRoute;