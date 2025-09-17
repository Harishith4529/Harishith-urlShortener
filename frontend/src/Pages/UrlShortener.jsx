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
                    href={`${service.getBaseURL()}/api/s/${shortUrlData?.shortCode}`} 
                    target="_blank"
                    className={styles.input}
                    >
                    {`${service.getBaseURL()}/api/s/${shortUrlData?.shortCode}`}
                </Anchor>
                <div className={styles.qrContainer}>
                    <div 
                        className={isQrExpanded ? styles.qrCodeExpanded : styles.qrCode}
                        onClick={() => setIsQrExpanded(!isQrExpanded)}
                    >
                        <QRCodeSVG 
                            value={`${service.getBaseURL()}/api/s/${shortUrlData?.shortCode}`}
                            size={isQrExpanded ? 256 : 128}
                        />
                    </div>
                </div>
            </>

            }
            </Stack>
      </Paper>
    </Center>
  );
};

export default UrlShortener;