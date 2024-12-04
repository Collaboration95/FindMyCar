import React, { useState, useEffect } from 'react';
import {
    Container,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import eventService from '../services/events';

function Dashboard() {
    const [allData, setAllData] = useState([]); // Stores all data fetched initially
    const [latestData, setLatestData] = useState([]); // Stores latest status of each parking spot
    const [filteredData, setFilteredData] = useState([]); // Stores filtered data
    const [filters, setFilters] = useState({}); // Stores active filters
    const navigate = useNavigate();

    // Fetch all data once when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            const result = await eventService.getEvents();
            setAllData(result);
            const latest = getLatestData(result); // Process to get the latest entries
            setLatestData(latest);
            setFilteredData(latest); // Initialize filtered data with latest entries
        };
        fetchData();
    }, []);

    // Get latest data for each parking spot ID
    const getLatestData = (data) => {
        const latestMap = {};
        data.forEach((item) => {
            const spotId = item.parking_spot_id;
            if (!latestMap[spotId] || new Date(item.timestamp) > new Date(latestMap[spotId].timestamp)) {
                latestMap[spotId] = item;
            }
        });
        return Object.values(latestMap); // Return an array of the latest entries
    };

    // Apply filters whenever filters state changes
    useEffect(() => {
        let filtered = [...latestData];
        if (filters.parking_spot_id) {
            const parkingSpotFilter = filters.parking_spot_id.toLowerCase();
            filtered = filtered.filter(item =>
                item.parking_spot_id.toLowerCase().includes(parkingSpotFilter)
            );
        }
        if (filters.device_id) {
            const deviceFilter = filters.device_id.toLowerCase();
            filtered = filtered.filter(item =>
                item.device_id.toLowerCase().includes(deviceFilter)
            );
        }
        setFilteredData(filtered);
    }, [filters, latestData]);

    // Update filters state when filter inputs change
    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    // Handle row click to navigate to detailed view
    const handleRowClick = (parkingSpotId) => {
        navigate(`/parking-spot/${parkingSpotId}`); // Navigate to detailed logs view
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Box sx={{ marginBottom: 3, display: 'flex', gap: 2 }}>
                <TextField
                    name="parking_spot_id"
                    label="Filter by Parking Spot ID"
                    variant="outlined"
                    onChange={handleFilterChange}
                    sx={{ flex: 1, maxWidth: 250 }}
                />
                <TextField
                    name="device_id"
                    label="Filter by Device ID"
                    variant="outlined"
                    onChange={handleFilterChange}
                    sx={{ flex: 1, maxWidth: 250 }}
                />
            </Box>

            {filteredData.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Parking Spot ID</TableCell>
                                <TableCell>Device ID</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Plate Number</TableCell>
                                <TableCell>Timestamp</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((item) => (
                                <TableRow
                                    key={item.event_id}
                                    hover
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleRowClick(item.parking_spot_id)}
                                >
                                    <TableCell>{item.parking_spot_id}</TableCell>
                                    <TableCell>{item.device_id}</TableCell>
                                    <TableCell>{item.status}</TableCell>
                                    <TableCell>{item.plate_number || 'N/A'}</TableCell>
                                    <TableCell>{item.timestamp}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="body1" color="textSecondary" align="center">
                    No data found for the selected filters.
                </Typography>
            )}
        </Container>
    );
}

export default Dashboard;