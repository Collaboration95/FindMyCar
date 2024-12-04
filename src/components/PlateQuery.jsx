import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function PlateQuery() {
    const [plateNumber, setPlateNumber] = useState('');
    const [data, setData] = useState([]);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if mobile view

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!plateNumber.trim()) {
            alert('Please enter a valid plate number');
            return;
        }
        const result = await eventService.getEventsByPlateNumber(plateNumber);
        setData(result);
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom className="Raleway-font">
                Find Your Car
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    marginBottom: 4,
                }}
            >
                <TextField
                    fullWidth
                    type="text"
                    label="Enter Plate Number"
                    variant="outlined"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{ height: { sm: '56px' } }}
                >
                    Search
                </Button>
            </Box>

            {data.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ padding: isMobile ? '4px' : '16px' }}>
                                    Parking Spot
                                </TableCell>
                                <TableCell sx={{ padding: isMobile ? '4px' : '16px' }}>
                                    Device ID
                                </TableCell>
                                <TableCell sx={{ padding: isMobile ? '4px' : '16px' }}>
                                    Status
                                </TableCell>
                                <TableCell sx={{ padding: isMobile ? '4px' : '16px' }}>
                                    Last Updated At
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.event_id}>
                                    <TableCell sx={{ padding: isMobile ? '4px' : '16px' }}>
                                        {item.parking_spot_id}
                                    </TableCell>
                                    <TableCell sx={{ padding: isMobile ? '4px' : '16px' }}>
                                        {item.device_id}
                                    </TableCell>
                                    <TableCell sx={{ padding: isMobile ? '4px' : '16px' }}>
                                        {item.status}
                                    </TableCell>
                                    <TableCell sx={{ padding: isMobile ? '4px' : '16px' }}>
                                        {item.timestamp}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="body1" color="textSecondary" align="center">
                    {plateNumber.trim()
                        ? 'No data found for this plate number.'
                        : 'Enter a plate number to search.'}
                </Typography>
            )}
        </Container>
    );
}

export default PlateQuery;
