import React, {useEffect, useState} from 'react'
import Service from '../utils/http';
import { Anchor, Table, Text } from '@mantine/core';
import styles from './MyUrls.module.css';

const MyUrls = () => {
    const service = new Service();
    const [data, setData] = useState([]);
    const getData = async () => {
        try {
            const response = await service.get("user/my/urls");
            setData(response.data); // <-- update here
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const formatDate = (dateString) => {
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
        <div className={styles.container}>
            <h1 className={styles.title}>My Shortened URLs</h1>
            <div className={styles.tableWrapper}>
                <Table className={styles.table} striped highlightOnHover withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            {["Title", "Original URL", "Short URL", "Active", "Clicks", "Created At", "Expiry Date"].map((header) => (
                                <Table.Th key={header} className={styles.headerCell}>{header}</Table.Th>
                            ))}
                        </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                        {data && data.map((d) => (
                            <Table.Tr key={d._id} className={styles.row}>
                                <Table.Td className={styles.cell}>
                                    <Text>{d?.title || "NA"}</Text>
                                </Table.Td>

                                <Table.Td className={`${styles.cell} ${styles.urlCell}`}>
                                    <Anchor 
                                        href={d?.originalUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={styles.link}
                                        title={d?.originalUrl}
                                    >
                                        {d?.originalUrl}
                                    </Anchor>
                                    <span className={styles.urlTooltip}>{d?.originalUrl}</span>
                                </Table.Td>

                                <Table.Td className={styles.cell}>
                                    <Anchor 
                                        href={`${service.getBaseURL()}/api/s/${d?.shortCode}`}
                                        target="_blank"
                                        className={styles.link}
                                    >
                                        {d?.shortCode}
                                    </Anchor>
                                </Table.Td>

                                <Table.Td className={styles.cell}>
                                    <span className={`${styles.badge} ${d?.isActive ? styles.badgeActive : styles.badgeInactive}`}>
                                        {d?.isActive ? "Active" : "Inactive"}
                                    </span>
                                </Table.Td>

                                <Table.Td className={styles.cell}>
                                    <Text>{d?.clickCount || 0}</Text>
                                </Table.Td>

                                <Table.Td className={styles.cell}>
                                    <Text>{formatDate(d?.createdAt)}</Text>
                                </Table.Td>

                                <Table.Td className={styles.cell}>
                                    <Text>{formatDate(d?.expiresAt)}</Text>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </div>
        </div>
    )
}

export default MyUrls