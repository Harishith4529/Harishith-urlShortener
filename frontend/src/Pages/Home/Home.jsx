import {
  Button,
  Center,
  Container,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getIsLoggedIn } from "../../redux/slices/User";
import { IconLink } from "@tabler/icons-react";

const Home = () => {
  const isLoggedIn = useSelector(getIsLoggedIn);
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #d9afd9 0%, #97d9e1 100%)",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Container size="sm" style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            backdropFilter: "blur(20px)",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "30px",
            padding: "3rem 2rem",
            boxShadow: "0 8px 40px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
          }}
        >
          <Center>
            <IconLink size={48} color="#ffffff" />
          </Center>

          <Title
            order={1}
            style={{
              color: "white",
              fontWeight: 700,
              fontSize: "2.8rem",
              marginTop: "1rem",
            }}
          >
            Your App Name
          </Title>

          <Text
            size="xl"
fw={700}
            style={{
              color: "#f1f1f1",
              marginTop: "0.8rem",
              marginBottom: "2rem",
              fontWeight: 400,
            }}
          >
            
          </Text>

          <Button
            size="md"
            radius="xl"
            variant="gradient"
            gradient={{ from: "grape", to: "indigo" }}
            onClick={() =>
              isLoggedIn ? navigate("/url/shortener") : navigate("/login")
            }
          >
            Get Started
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Home;
