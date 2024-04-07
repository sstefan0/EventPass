import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";
import ForgotPassword from "../../components/forgot-password/forgot-password";

const ForgotPasswordPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) navigate("/");
  }, [auth]);

  return <ForgotPassword />;
};

export default ForgotPasswordPage;
