import React, {useEffect, useState} from 'react'
import Service from '../utils/http';
import { Anchor, Table, Text, ActionIcon, Tooltip, Group, Select, Pagination, Modal, TextInput, Button, Checkbox, Switch, Paper } from '@mantine/core';
import { IconEdit, IconTrash, IconSearch } from "@tabler/icons-react";
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
    const [editStatus, setEditStatus] = useState(true);
    const [editLoading, setEditLoading] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteUrl, setDeleteUrl] = useState(null);
    const [deleteChecked, setDeleteChecked] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchField, setSearchField] = useState("all");

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

    // Filter data based on search term and selected field
    const filteredData = data.filter((url) => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase().trim();
        
        switch (searchField) {
            case 'originalUrl':
                return url.originalUrl?.toLowerCase().includes(searchLower) || false;
            case 'shortCode':
                return url.shortCode?.toLowerCase().includes(searchLower) || false;
            case 'title':
                // Handle title search more reliably
                if (!url.title || url.title === null || url.title === undefined) {
                    // If no title, only match if searching for "na"
                    return searchLower === "na";
                }
                // Convert title to string and search
                const titleStr = String(url.title).toLowerCase();
                return titleStr.includes(searchLower);
            case 'all':
            default:
                // Check original URL
                const urlMatch = url.originalUrl?.toLowerCase().includes(searchLower) || false;
                
                // Check short code
                const codeMatch = url.shortCode?.toLowerCase().includes(searchLower) || false;
                
                // Check title
                let titleMatch = false;
                if (!url.title || url.title === null || url.title === undefined) {
                    titleMatch = searchLower === "na";
                } else {
                    const titleStr = String(url.title).toLowerCase();
                    titleMatch = titleStr.includes(searchLower);
                }
                
                return urlMatch || codeMatch || titleMatch;
        }
    });

    // Pagination logic
    const totalPages = Math.max(1, Math.ceil(filteredData.length / limit));
    const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

    // Reset to first page if search changes or limit changes and current page is out of bounds
    useEffect(() => {
        if (page > totalPages) setPage(1);
    }, [limit, totalPages, searchTerm]);

    const handleEditClick = (urlObj) => {
        setEditUrl(urlObj);
        setEditOriginalUrl(urlObj.originalUrl || "");
        setEditTitle(urlObj.title || "");
        setEditStatus(urlObj.isActive ?? true);
        setEditModalOpen(true);
    };

    const handleEditClose = () => {
        setEditModalOpen(false);
        setEditUrl(null);
        setEditOriginalUrl("");
        setEditTitle("");
        setEditStatus(true);
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
                title: editTitle,
                isActive: editStatus
            };
            await service.put(`s/${editUrl.shortCode}`, payload);
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

    // Determine delete modal message and button text
    const isDeleteInactive = deleteUrl && !deleteUrl.isActive;
    const deleteModalMessage = isDeleteInactive
        ? "This will permanently delete the URL from the database. Are you sure?"
        : "Deleting will make this URL inactive. You can delete it permanently later.";
    const deleteButtonText = isDeleteInactive ? "Delete Permanently" : "Delete & Set Inactive";

    const getSearchPlaceholder = () => {
        switch (searchField) {
            case 'originalUrl':
                return 'Search by original URL...';
            case 'shortCode':
                return 'Search by short code...';
            case 'title':
                return 'Search by title...';
            case 'all':
            default:
                return 'Search by URL, title, or short code...';
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>My Shortened URLs</h1>
            <div className={styles.controlsRow}>
                <div className={styles.searchGroup}>
                    <Select
                        value={searchField}
                        onChange={setSearchField}
                        data={[
                            { value: "all", label: "All Fields" },
                            { value: "originalUrl", label: "Original URL" },
                            { value: "shortCode", label: "Short Code" },
                            { value: "title", label: "Title" }
                        ]}
                        style={{ width: 140, marginRight: "0.5rem" }}
                        size="md"
                        radius="md"
                        className={styles.searchFieldSelect}
                    />
                    <TextInput
                        placeholder={getSearchPlaceholder()}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        leftSection={<IconSearch size={16} />}
                        style={{ flex: 1 }}
                        size="md"
                        radius="md"
                        className={styles.searchInput}
                    />
                </div>
                <div className={styles.paginationGroup}>
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
                            { value: String(filteredData.length), label: "All" }
                        ]}
                        style={{ width: 100, marginLeft: "0.5rem" }}
                        size="md"
                        radius="md"
                        className={styles.dropdownSelect}
                    />
                </div>
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
                                    {/* Short URL: disable if inactive */}
                                    {d?.isActive ? (
                                        <Anchor 
                                            href={`${service.getBaseURL()}/api/s/${d?.shortCode}`}
                                            target="_blank"
                                            className={styles.link}
                                        >
                                            {d?.shortCode}
                                        </Anchor>
                                    ) : (
                                        <span className={styles.inactiveShortUrl}>{d?.shortCode} <span className={styles.inactiveLabel}>(Inactive)</span></span>
                                    )}
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
                {filteredData.length === 0 && searchTerm && (
                    <Text ta="center" py="xl" color="dimmed">
                        No URLs found matching "{searchTerm}"
                    </Text>
                )}
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
                withCloseButton={false}
            >
                <div className={styles.modalHeader}>
                    <span className={styles.editModalTitle}>Edit URL</span>
                    <Button
                        variant="subtle"
                        color="gray"
                        size="sm"
                        radius="xl"
                        onClick={handleEditClose}
                    >
                        Close
                    </Button>
                </div>
                <div className={styles.modalSection}>
                    <Text size="sm" color="dimmed" mb="md">
                        Update the details of your short URL below.
                    </Text>
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
                    <div className={styles.switchSection}>
                        <Switch
                            checked={editStatus}
                            onChange={e => setEditStatus(e.currentTarget.checked)}
                            label={editStatus ? "Active" : "Inactive"}
                            color={editStatus ? "teal" : "red"}
                            size="md"
                            radius="md"
                        />
                    </div>
                </div>
                <div className={styles.modalFooter}>
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
                        Update
                    </Button>
                </div>
            </Modal>
            {/* Delete Modal */}
            <Modal
                opened={deleteModalOpen}
                onClose={handleDeleteClose}
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
                withCloseButton={false}
            >
                <div className={styles.modalHeader}>
                    <span className={styles.deleteModalTitle}>Delete URL</span>
                    <Button
                        variant="subtle"
                        color="gray"
                        size="sm"
                        radius="xl"
                        onClick={handleDeleteClose}
                    >
                        Close
                    </Button>
                </div>
                <div className={styles.modalSection}>
                    <Text size="sm" color="dimmed" mb="md">
                        {deleteModalMessage}
                    </Text>
                    <Text className={styles.deleteModalUrl}>
                        <b>Short URL:</b> {deleteUrl?.shortCode}
                    </Text>
                    <Text className={styles.deleteModalUrl}>
                        <b>Original URL:</b> {deleteUrl?.originalUrl}
                    </Text>
                    <Checkbox
                        checked={deleteChecked}
                        onChange={e => setDeleteChecked(e.currentTarget.checked)}
                        label={isDeleteInactive
                            ? "I am sure I want to permanently delete this URL"
                            : "I am sure I want to delete this URL (it will become inactive)"}
                        required
                        radius="md"
                        size="md"
                        className={styles.deleteModalCheckbox}
                        mt="md"
                    />
                </div>
                <div className={styles.modalFooter}>
                    <Button
                        variant="default"
                        radius="md"
                        onClick={handleDeleteClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="gradient"
                        gradient={isDeleteInactive
                            ? { from: "red", to: "violet" }
                            : { from: "orange", to: "violet" }}
                        radius="md"
                        disabled={!deleteChecked}
                        loading={deleteLoading}
                        onClick={handleDeleteConfirm}
                    >
                        {deleteButtonText}
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

export default MyUrls