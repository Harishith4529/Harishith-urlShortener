import {
  Card,
  Center,
  Stack,
  Text,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { GoogleLogin } from "@react-oauth/google";
import { showNotification } from "@mantine/notifications";
import Service from "../../utils/http";
import { GOOGLE_AUTH_LOGIN } from "../../utils/urls";
import { useDispatch, useSelector } from "react-redux";
import { getIsLoggedIn, setUser } from "../../redux/slices/User";
import { Navigate, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const service = new Service();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(getIsLoggedIn);

  const googleResponse = async (res) => {
    try {
      const token = res.credential;

      if (!token) {
        showNotification({
          title: "Error",
          message: "Invalid Response From Google",
          color: "red",
        });
        return;
      }

      const response = await service.post(GOOGLE_AUTH_LOGIN, { token });
      const data = response.data;

      dispatch(
        setUser({
          name: data.name,
          avatar: data.avatar,
          token: data.token,
          email: data.email,
          isLoggedIn: true,
        })
      );
      showNotification({
        title: "Success",
        message: "Welcome! Login Successfully.",
        color: "green",
      });
      navigate("/");
    } catch (error) {
      showNotification({
        title: "Error",
        message: error.response?.data?.message ?? "Some Error Occurred!",
        color: "red",
      });
      console.error("Google login error:", error);
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #d9afd9 0%, #97d9e1 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Center style={{ height: "100%", width: "100%" }}>
        <Card
          shadow="lg"
          padding="xl"
          radius="lg"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            maxWidth: 400,
            width: "90%",
            textAlign: "center",
          }}
        >
          <Text c="white" my="sm" size="lg">
            Login to{" "}
            <Text component="span" fw={700} c="white">
              Being Zero 
            </Text>
          </Text>
          <Stack align="center" spacing="lg">
            <GoogleLogin
              width={250}
              theme="filled_black"
              useOneTap={true}
              onSuccess={googleResponse}
            />
          </Stack>
        </Card>
      </Center>
    </div>
  );
}
