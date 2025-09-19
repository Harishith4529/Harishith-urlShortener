import { useState } from "react";
import { TextInput, Center, Stack, Text, Button, Anchor, Paper } from "@mantine/core";
import Service from "../utils/http";
import styles from './UrlShortener.module.css';
import {QRCodeSVG} from 'qrcode.react';

const UrlShortener = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [title, setTitle] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [shortUrlData, setShortUrlData] = useState(null);
  const [isQrExpanded, setIsQrExpanded] = useState(false);

  const service = new Service();

  const getShortUrl = async () => {
    const response = await service.post("s", {
      customUrl,
      originalUrl,
      expiryDate,
      title,
    });
    setShortUrlData(response);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "NA";
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(',', ' |');
  };

  return (
    <Center className={styles.container}>
      <Paper className={styles.card}>
        <Stack gap="sm">
          {!shortUrlData ? 
          <>

              <Text
              className={styles.title}
              variant="gradient"
              gradient={{ from: "pink", to: "indigo", deg: 90 }}
              >
              Shorten your URL here
              </Text>

              <TextInput
              label="Original link:"
              withAsterisk
              placeholder="Enter your link here"
              onChange={(e) => setOriginalUrl(e.target.value)}
              value={originalUrl}
              className={styles.input}
              />

              <TextInput
              label="Custom link (Optional):"
              placeholder="Enter your custom link here"
              onChange={(e) => setCustomUrl(e.target.value)}
              value={customUrl}
              className={styles.input}
              />

              <TextInput
              label="Title (Optional):"
              placeholder="Enter your title here"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className={styles.input}
              />

              <TextInput
              label="Expiry Date (Optional):"
              placeholder="Enter your expiry date here"
              onChange={(e) => setExpiryDate(e.target.value)}
              value={expiryDate}
              type="date"
              className={styles.input}
              />

              <Button
              className={styles.button}
              disabled={!originalUrl}
              onClick={getShortUrl}
              >
              Shorten URL
              </Button>
          </> : 
          <>
              <Anchor 
                href={`${service.getBaseURL()}/api/s/${shortUrlData?.data?.shortCode}`} 
                target="_blank"
                className={styles.generatedUrl}
              >
                {`${service.getBaseURL()}/api/s/${shortUrlData?.data?.shortCode}`}
              </Anchor>
              <div className={styles.qrContainer}>
                <div 
                  className={isQrExpanded ? styles.qrCodeExpanded : styles.qrCode}
                  onClick={() => setIsQrExpanded(!isQrExpanded)}
                >
                  <QRCodeSVG 
                    value={`${service.getBaseURL()}/api/s/${shortUrlData?.data?.shortCode}`}
                    size={isQrExpanded ? 256 : 128}
                  />
                </div>
              </div>
              <div className={styles.generatedDetails}>
                <span className={styles.generatedLabel}>Short URL Details</span>
                <Text><b>Title:</b> {shortUrlData?.data?.title || "NA"}</Text>
                <Text>
                  <b>Original URL:</b>{" "}
                  <Anchor
                    href={shortUrlData?.data?.originalUrl}
                    target="_blank"
                    className={styles.generatedOriginalUrl}
                  >
                    {shortUrlData?.data?.originalUrl}
                  </Anchor>
                </Text>
                <Text><b>Click Count:</b> {shortUrlData?.data?.clickCount ?? 0}</Text>
                <Text>
                  <b>Status:</b>
                  <span style={{
                    marginLeft: "8px",
                    padding: "2px 12px",
                    borderRadius: "12px",
                    background: shortUrlData?.data?.isActive ? "rgba(72,199,142,0.2)" : "rgba(245,101,101,0.2)",
                    color: shortUrlData?.data?.isActive ? "#2f855a" : "#c53030",
                    fontWeight: 500
                  }}>
                    {shortUrlData?.data?.isActive ? "Active" : "Inactive"}
                  </span>
                </Text>
                <Text><b>Created At:</b> {formatDate(shortUrlData?.data?.createdAt)}</Text>
                <Text><b>Expiry Date:</b> {formatDate(shortUrlData?.data?.expiresAt)}</Text>
              </div>
          </>

          }
          </Stack>
      </Paper>
    </Center>
  );
};

export default UrlShortener;