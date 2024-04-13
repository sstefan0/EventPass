import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ForgotPassword from "../../components/forgot-password/forgot-password";
import { getAuth } from "../../util/get-auth";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  useEffect(() => {
    if (auth) navigate("/");
  }, [auth]);

  return <ForgotPassword />;
};

export default ForgotPasswordPage;
