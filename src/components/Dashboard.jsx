import React, { useState, useEffect } from 'react';
import {
    Container,
    TextField,
    Typography,
    Box,
    Grid,
    CircularProgress,
    MenuItem,
    Select,
    Card,
    CardContent,
    Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import eventService from '../services/events';

// Parking Spot Card Component
const ParkingSpotCard = ({ item, onClick }) => (
    <Card
        sx={{
            cursor: 'pointer',
            '&:hover': { boxShadow: 6 },
            transition: '0.3s',
            backgroundColor: item.status === 'Vacant' ? 'lightgreen' : 'lightcoral',
        }}
        onClick={onClick}
    >
        <CardContent>
            <Typography variant="h6" gutterBottom>
                Parking Spot: {item.parking_spot_id}
            </Typography>
            <Typography variant="body1">
                <strong>Status:</strong>{' '}
                <Chip
                    label={item.status}
                    color={item.status === 'Vacant' ? 'success' : 'error'}
                    size="small"
                />
            </Typography>
            <Typography variant="body1">
                <strong>Plate Number:</strong> {item.plate_number || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
                <strong>Last Updated:</strong> {new Date(item.timestamp).toLocaleString()}
            </Typography>
        </CardContent>
    </Card>
);

function Dashboard() {
    const [allData, setAllData] = useState([]);
    const [latestData, setLatestData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(true); // Loading state
    const [sortOption, setSortOption] = useState('parking_spot_id'); // Sorting option
    const navigate = useNavigate();

    // Fetch all data once when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Start loading
                const result = await eventService.getEvents();
                setAllData(result);
                const latest = getLatestData(result);
                setLatestData(latest);
                setFilteredData(latest); // Initialize filtered data
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false); // End loading
            }
        };
        fetchData();
    }, []);

    // Get the latest data for each parking spot
    const getLatestData = (data) => {
        const latestMap = {};
        data.forEach((item) => {
            const spotId = item.parking_spot_id;
            if (!latestMap[spotId] || new Date(item.timestamp) > new Date(latestMap[spotId].timestamp)) {
                latestMap[spotId] = item;
            }
        });
        return Object.values(latestMap);
    };

    // Apply filters when filters or latestData changes
    useEffect(() => {
        let filtered = [...latestData];
        if (filters.parking_spot_id) {
            const parkingSpotFilter = filters.parking_spot_id.toLowerCase();
            filtered = filtered.filter((item) =>
                item.parking_spot_id.toLowerCase().includes(parkingSpotFilter)
            );
        }
        if (filters.device_id) {
            const deviceFilter = filters.device_id.toLowerCase();
            filtered = filtered.filter((item) =>
                item.device_id.toLowerCase().includes(deviceFilter)
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            if (sortOption === 'status') {
                return a.status.localeCompare(b.status);
            } else if (sortOption === 'timestamp') {
                return new Date(b.timestamp) - new Date(a.timestamp);
            } else {
                return a.parking_spot_id.localeCompare(b.parking_spot_id);
            }
        });

        setFilteredData(filtered);
    }, [filters, latestData, sortOption]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const handleCardClick = (parkingSpotId) => {
        navigate(`/parking-spot/${parkingSpotId}`);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Box sx={{ marginBottom: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
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
                <Select
                    value={sortOption}
                    onChange={handleSortChange}
                    displayEmpty
                    sx={{ flex: 1, maxWidth: 200 }}
                >
                    <MenuItem value="parking_spot_id">Sort by Parking Spot ID</MenuItem>
                    <MenuItem value="status">Sort by Status</MenuItem>
                    <MenuItem value="timestamp">Sort by Time</MenuItem>
                </Select>
            </Box>

            {filteredData.length > 0 ? (
                <Grid container spacing={3}>
                    {filteredData.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.event_id}>
                            <ParkingSpotCard item={item} onClick={() => handleCardClick(item.parking_spot_id)} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body1" color="textSecondary" align="center">
                    No data found for the selected filters.
                </Typography>
            )}
        </Container>
    );
}

export default Dashboard;
