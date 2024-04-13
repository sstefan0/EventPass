import { useNavigate, redirect } from "react-router-dom";
import Login from "../../components/login/login";
import { useEffect } from "react";
import { getAuth } from "../../util/get-auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const user = getAuth();

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  return <Login />;
};

export default LoginPage;
