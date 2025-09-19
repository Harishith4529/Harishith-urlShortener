import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Grid,
  Text,
  Group,
  Button,
  Table,
  Avatar,
  Badge,
  Stack,
  RingProgress,
} from "@mantine/core";
import {
  IconPlus,
  IconLink,
  IconList,
  IconEye,
  IconCalendar,
} from "@tabler/icons-react";
import Service from "../../utils/http";
import styles from "./Home.module.css";

const Home = () => {
  const navigate = useNavigate();
  const service = new Service();
  const [stats, setStats] = useState({
    totalUrls: 0,
    activeUrls: 0,
    inactiveUrls: 0,
  });
  const [recentUrls, setRecentUrls] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  const fetchDashboardData = async () => {
    try {
      // Fetch user URLs
      const urlsResponse = await service.get("user/my/urls");
      const urls = urlsResponse.data || [];

      // Calculate stats
      const totalUrls = urls.length;
      const activeUrls = urls.filter((url) => url.isActive).length;
      const inactiveUrls = totalUrls - activeUrls;

      setStats({ totalUrls, activeUrls, inactiveUrls });

      // Get last 5 URLs
      const recent = urls.slice(0, 5);
      setRecentUrls(recent);

      // Fetch user profile
      const profileResponse = await service.get("user/me");
      setUserProfile(profileResponse.data || profileResponse);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const navigationCards = [
    {
      title: "Create Short URL",
      description: "Generate new short URLs quickly",
      icon: IconPlus,
      color: "blue",
      path: "/UrlShortener",
    },
    {
      title: "My URLs",
      description: "Manage all your shortened URLs",
      icon: IconList,
      color: "green",
      path: "/MyUrls",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Text className={styles.mainTitle} style={{ fontSize: "4rem" }}>
          Dashboard
        </Text>

        {/* Profile Section */}
        {userProfile && (
          <Card className={styles.profileCard} shadow="md" radius="lg" mb="xl">
            <Group>
              <Avatar
                src={userProfile?.avatar || userProfile?.profilePicture}
                size="lg"
                radius="xl"
              />
              <div>
                <Text fw={600} size="lg">
                  {userProfile?.name}
                </Text>
                <Text size="sm" color="dimmed">
                  {userProfile?.email}
                </Text>
              </div>
              <Button
                variant="light"
                onClick={() => navigate("/Profile")}
                style={{ marginLeft: "auto" }}
              >
                View Profile
              </Button>
            </Group>
          </Card>
        )}

        {/* Stats Cards with Chart */}
        <Grid mb="xl">
          <Grid.Col span={{ base: 12, sm: 3 }}>
            <Card className={styles.statsCard} shadow="md" radius="lg">
              <Group justify="space-between" gap={0}>
                <div>
                  <Text size="sm" color="dimmed">
                    Total URLs
                  </Text>
                  <Text fw={700} size="xl">
                    {stats.totalUrls}
                  </Text>
                </div>
                <IconLink size={32} className={styles.statsIcon} />
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 3 }}>
            <Card className={styles.statsCard} shadow="md" radius="lg">
              <Group justify="space-between" gap={0}>
                <div>
                  <Text size="sm" color="dimmed">
                    Active URLs
                  </Text>
                  <Text fw={700} size="xl" color="green">
                    {stats.activeUrls}
                  </Text>
                </div>
                <IconEye size={32} className={styles.statsIconGreen} />
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 3 }}>
            <Card className={styles.statsCard} shadow="md" radius="lg">
              <Group justify="space-between" gap={0}>
                <div>
                  <Text size="sm" color="dimmed">
                    Inactive URLs
                  </Text>
                  <Text fw={700} size="xl" color="red">
                    {stats.inactiveUrls}
                  </Text>
                </div>
                <IconCalendar size={32} className={styles.statsIconRed} />
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 3 }}>
            <Card className={styles.statsCard} shadow="md" radius="lg">
              <Stack align="center" gap="lg">
                <Text size="lg" fw={600} ta="center" color="dark">
                  URL Distribution
                </Text>
                <RingProgress
                  size={120}
                  thickness={12}
                  sections={[
                    {
                      value:
                        stats.totalUrls > 0
                          ? (stats.activeUrls / stats.totalUrls) * 100
                          : 0,
                      color: "teal",
                      tooltip: `Active: ${stats.activeUrls}`,
                    },
                    {
                      value:
                        stats.totalUrls > 0
                          ? (stats.inactiveUrls / stats.totalUrls) * 100
                          : 0,
                      color: "red",
                      tooltip: `Inactive: ${stats.inactiveUrls}`,
                    },
                  ]}
                  label={
                    <div style={{ textAlign: "center" }}>
                      <Text size="xl" fw={700}>
                        {stats.totalUrls > 0
                          ? `${Math.round(
                              (stats.activeUrls / stats.totalUrls) * 100
                            )}%`
                          : "0%"}
                      </Text>
                      <Text size="xs" color="dimmed">
                        Active
                      </Text>
                    </div>
                  }
                />
                <Group gap="lg" justify="center">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        backgroundColor: "var(--mantine-color-teal-6)",
                        borderRadius: "50%",
                      }}
                    ></div>
                    <Text size="sm" fw={500}>
                      Active ({stats.activeUrls})
                    </Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        backgroundColor: "var(--mantine-color-red-6)",
                        borderRadius: "50%",
                      }}
                    ></div>
                    <Text size="sm" fw={500}>
                      Inactive ({stats.inactiveUrls})
                    </Text>
                  </div>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Navigation Cards */}
        <Grid mb="xl">
          {navigationCards.map((card, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6 }}>
              <Card
                className={styles.navCard}
                shadow="md"
                radius="lg"
                onClick={() => navigate(card.path)}
              >
                <Stack align="center" gap="md">
                  <card.icon size={48} className={styles.navIcon} />
                  <Text fw={600} size="lg">
                    {card.title}
                  </Text>
                  <Text size="sm" color="dimmed" ta="center">
                    {card.description}
                  </Text>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {/* Recent URLs */}
        <Card className={styles.recentCard} shadow="md" radius="lg">
          <Text fw={600} size="lg" mb="md">
            Recent URLs
          </Text>
          {recentUrls.length > 0 ? (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Title</Table.Th>
                  <Table.Th>Short Code</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Created</Table.Th>
                  <Table.Th>Clicks</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {recentUrls.map((url) => (
                  <Table.Tr key={url._id}>
                    <Table.Td>{url.title || "Untitled"}</Table.Td>
                    <Table.Td>{url.shortCode}</Table.Td>
                    <Table.Td>
                      <Badge
                        color={url.isActive ? "green" : "red"}
                        variant="light"
                      >
                        {url.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </Table.Td>
                    <Table.Td>{formatDate(url.createdAt)}</Table.Td>
                    <Table.Td>{url.clickCount || 0}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          ) : (
            <Text color="dimmed" ta="center" py="xl">
              No URLs created yet. Start by creating your first short URL!
            </Text>
          )}
          <Button
            variant="light"
            fullWidth
            mt="md"
            onClick={() => navigate("/MyUrls")}
          >
            View All URLs
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Home;
