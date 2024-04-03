import { useNavigate } from "react-router-dom";
import Login from "../../components/login/login";
import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";

const LoginPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      navigate("/");
    }
  }, [auth]);

  return <Login />;
};

export default LoginPage;
