import { useNavigate } from "react-router-dom";
import Register from "../../components/register/register";
import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";

export const RegisterPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) navigate("/");
  }, [auth]);
  return <Register />;
};
