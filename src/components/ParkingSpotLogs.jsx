import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
} from '@mui/material';

import eventService from '../services/events';

function ParkingSpotLogs() {
    const { parkingSpotId } = useParams(); // Get parking spot ID from the route
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            const result = await eventService.getEvents();
            const filteredLogs = result.filter(item => item.parking_spot_id === parkingSpotId);
            setLogs(filteredLogs);
        };
        fetchLogs();
    }, [parkingSpotId]);

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                Logs for Parking Spot: {parkingSpotId}
            </Typography>
            {logs.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Device ID</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Plate Number</TableCell>
                                <TableCell>Timestamp</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {logs.map((item) => (
                                <TableRow key={item.event_id}>
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
                    No logs found for this parking spot.
                </Typography>
            )}
        </Container>
    );
}

export default ParkingSpotLogs;
