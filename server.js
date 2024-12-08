const express = require('express');
const connectDB = require('./config/db');
const config = require('./config/config');
const cors = require('cors');

// Route imports
const userRoutes = require('./routes/userRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const driverRoutes = require('./routes/driverRoutes');
const fuelLogRoutes = require('./routes/fuelLogRoutes');
const cargoRoutes = require('./routes/cargoRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const routeRoutes = require('./routes/routeRoutes');

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/fuel-logs', fuelLogRoutes);
app.use('/api/cargo', cargoRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/route', routeRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start Server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;