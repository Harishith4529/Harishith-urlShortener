import React, {useEffect, useState} from 'react'
import Service from '../utils/http';
import { Anchor, Table, Text, ActionIcon, Tooltip, Group, Select, Pagination, Modal, TextInput, Button, Checkbox } from '@mantine/core';
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { notifications } from '@mantine/notifications';
import styles from './MyUrls.module.css';

const MyUrls = () => {
    const service = new Service();
    const [data, setData] = useState([]);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editUrl, setEditUrl] = useState(null);
    const [editOriginalUrl, setEditOriginalUrl] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [editLoading, setEditLoading] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteUrl, setDeleteUrl] = useState(null);
    const [deleteChecked, setDeleteChecked] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const getData = async () => {
        try {
            const response = await service.get("user/my/urls");
            setData(response.data);
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

    // Pagination logic
    const totalPages = Math.max(1, Math.ceil(data.length / limit));
    const paginatedData = data.slice((page - 1) * limit, page * limit);

    // Reset to first page if limit changes and current page is out of bounds
    useEffect(() => {
        if (page > totalPages) setPage(1);
    }, [limit, totalPages]);

    const handleEditClick = (urlObj) => {
        setEditUrl(urlObj);
        setEditOriginalUrl(urlObj.originalUrl || "");
        setEditTitle(urlObj.title || "");
        setEditModalOpen(true);
    };

    const handleEditClose = () => {
        setEditModalOpen(false);
        setEditUrl(null);
        setEditOriginalUrl("");
        setEditTitle("");
    };

    const handleDeleteClick = (urlObj) => {
        setDeleteUrl(urlObj);
        setDeleteChecked(false);
        setDeleteModalOpen(true);
    };

    const handleDeleteClose = () => {
        setDeleteModalOpen(false);
        setDeleteUrl(null);
        setDeleteChecked(false);
    };

    const handleEditSave = async () => {
        if (!editUrl) return;
        setEditLoading(true);
        try {
            const payload = {
                originalUrl: editOriginalUrl,
                title: editTitle
            };
            const response = await service.put(`s/${editUrl.shortCode}`, payload);
            notifications.show({
                title: 'URL Updated',
                message: 'Short URL updated successfully!',
                color: 'teal'
            });
            handleEditClose();
            getData();
        } catch (error) {
            notifications.show({
                title: 'Update Failed',
                message: 'Could not update the URL.',
                color: 'red'
            });
        } finally {
            setEditLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteUrl) return;
        setDeleteLoading(true);
        try {
            await service.delete(`s/${deleteUrl.shortCode}`);
            notifications.show({
                title: 'URL Deleted',
                message: 'Short URL deleted successfully!',
                color: 'red'
            });
            handleDeleteClose();
            getData();
        } catch (error) {
            notifications.show({
                title: 'Delete Failed',
                message: 'Could not delete the URL.',
                color: 'red'
            });
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>My Shortened URLs</h1>
            <div className={styles.controlsRow}>
                <label className={styles.dropdownLabel} htmlFor="show-per-page">Show per page:</label>
                <Select
                    id="show-per-page"
                    value={String(limit)}
                    onChange={val => setLimit(Number(val))}
                    data={[
                        { value: "5", label: "5" },
                        { value: "10", label: "10" },
                        { value: "20", label: "20" },
                        { value: "50", label: "50" },
                        { value: String(data.length), label: "All" }
                    ]}
                    style={{ width: 100, marginLeft: "0.5rem" }}
                    size="md"
                    radius="md"
                    className={styles.dropdownSelect}
                />
            </div>
            <div className={styles.tableWrapper}>
                <Table className={styles.table} striped highlightOnHover withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            {["Title", "Original URL", "Short URL", "Active", "Clicks", "Created At", "Expiry Date", "Actions"].map((header) => (
                                <Table.Th key={header} className={styles.headerCell}>{header}</Table.Th>
                            ))}
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {paginatedData.map((d) => (
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

                                <Table.Td className={styles.cell}>
                                    <Group gap="xs">
                                        <Tooltip label="Edit" withArrow>
                                            <ActionIcon
                                                variant="light"
                                                color="blue"
                                                className={styles.actionBtn}
                                                onClick={() => handleEditClick(d)}
                                            >
                                                <IconEdit size={18} />
                                            </ActionIcon>
                                        </Tooltip>
                                        <Tooltip label="Delete" withArrow>
                                            <ActionIcon
                                                variant="light"
                                                color="red"
                                                className={styles.actionBtn}
                                                onClick={() => handleDeleteClick(d)}
                                            >
                                                <IconTrash size={18} />
                                            </ActionIcon>
                                        </Tooltip>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </div>
            <div className={styles.paginationRow}>
                <Pagination
                    value={page}
                    onChange={setPage}
                    total={totalPages}
                    color="violet"
                    size="md"
                    radius="md"
                />
            </div>
            {/* Edit Modal */}
            <Modal
                opened={editModalOpen}
                onClose={handleEditClose}
                title={
                    <div className={styles.editModalTitle}>
                        <span>Edit URL</span>
                        <div className={styles.editModalSubtitle}>
                            You can update the title or original URL below.
                        </div>
                    </div>
                }
                centered
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                size="sm"
                classNames={{
                    content: styles.editModalContent,
                    header: styles.editModalHeader,
                }}
            >
                <div className={styles.editModalBody}>
                    <TextInput
                        label="Original URL"
                        value={editOriginalUrl}
                        onChange={e => setEditOriginalUrl(e.target.value)}
                        className={styles.input}
                        withAsterisk
                        radius="md"
                        size="md"
                        placeholder="Enter the original URL"
                    />
                    <TextInput
                        label="Title"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        className={styles.input}
                        radius="md"
                        size="md"
                        placeholder="Enter a title (optional)"
                    />
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem", gap: "1rem" }}>
                        <Button
                            variant="gradient"
                            gradient={{ from: "violet", to: "indigo" }}
                            radius="md"
                            onClick={handleEditClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="gradient"
                            gradient={{ from: "teal", to: "violet" }}
                            radius="md"
                            loading={editLoading}
                            onClick={handleEditSave}
                        >
                            Update Original URL
                        </Button>
                    </div>
                </div>
            </Modal>
            {/* Delete Modal */}
            <Modal
                opened={deleteModalOpen}
                onClose={handleDeleteClose}
                title={
                    <div className={styles.deleteModalTitle}>
                        <span>Delete URL</span>
                        <div className={styles.deleteModalSubtitle}>
                            Are you sure you want to delete this URL? This action cannot be undone.
                        </div>
                    </div>
                }
                centered
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                size="sm"
                classNames={{
                    content: styles.deleteModalContent,
                    header: styles.deleteModalHeader,
                }}
            >
                <div className={styles.deleteModalBody}>
                    <Text className={styles.deleteModalUrl}>
                        <b>Short URL:</b> {deleteUrl?.shortCode}
                    </Text>
                    <Text className={styles.deleteModalUrl}>
                        <b>Original URL:</b> {deleteUrl?.originalUrl}
                    </Text>
                    <Checkbox
                        checked={deleteChecked}
                        onChange={e => setDeleteChecked(e.currentTarget.checked)}
                        label="I am sure I want to delete this URL"
                        required
                        radius="md"
                        size="md"
                        className={styles.deleteModalCheckbox}
                        mt="md"
                    />
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem", gap: "1rem" }}>
                        <Button
                            variant="default"
                            radius="md"
                            onClick={handleDeleteClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="gradient"
                            gradient={{ from: "red", to: "violet" }}
                            radius="md"
                            disabled={!deleteChecked}
                            loading={deleteLoading}
                            onClick={handleDeleteConfirm}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default MyUrls