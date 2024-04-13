import { useNavigate } from "react-router-dom";
import Register from "../../components/register/register";
import { useEffect } from "react";
import { getAuth } from "../../util/get-auth";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const user = getAuth();
  useEffect(() => {
    if (user) navigate("/");
  }, [user]);
  return <Register />;
};
