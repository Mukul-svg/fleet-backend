// controllers/reportController.js

const Report = require("../models/Report");
const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");
const FuelLog = require("../models/FuelLog");
const Maintenance = require("../models/Maintenance");
const Cargo = require("../models/Cargo");
const Incident = require("../models/Incident");
const Schedule = require("../models/Schedule");

exports.generateReport = async (req, res) => {
  try {
    const { type, parameters } = req.body;

    let reportData;
    switch (type) {
      case "Vehicle Utilization":
        reportData = await generateVehicleUtilizationReport();
        break;
      case "Driver Performance":
        reportData = await generateDriverPerformanceReport();
        break;
      case "Fuel Efficiency":
        reportData = await generateFuelEfficiencyReport();
        break;
      case "Maintenance Cost":
        reportData = await generateMaintenanceCostReport();
        break;
      case "Fleet Overview":
        reportData = await generateFleetOverviewReport();
        break;
      default:
        throw new Error("Invalid report type");
    }

    const report = new Report({
      type,
      data: reportData,
      createdBy: req.user._id,
      parameters,
      status: "Generated",
    });

    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({
      message: "Report generation failed",
      error: error.message,
    });
  }
};

// Helper functions without date filtering

async function generateVehicleUtilizationReport() {
  const vehicleUtilization = await Vehicle.aggregate([
    {
      $lookup: {
        from: "schedules",
        localField: "_id",
        foreignField: "vehicle",
        as: "schedules",
      },
    },
    {
      $project: {
        vehicleId: "$_id",
        make: 1,
        model: 1,
        licensePlate: 1,
        totalSchedules: { $size: "$schedules" },
        totalTripHours: {
          $sum: {
            $map: {
              input: "$schedules",
              as: "schedule",
              in: {
                $divide: [
                  { $subtract: ["$$schedule.endTime", "$$schedule.startTime"] },
                  3600000, // Convert milliseconds to hours
                ],
              },
            },
          },
        },
      },
    },
    {
      $sort: { totalTripHours: -1 },
    },
  ]);

  return {
    totalVehicles: vehicleUtilization.length,
    vehicleUtilization,
  };
}

async function generateDriverPerformanceReport() {
  const driverPerformance = await Driver.aggregate([
    {
      $lookup: {
        from: "schedules",
        localField: "_id",
        foreignField: "driver",
        as: "schedules",
      },
    },
    {
      $lookup: {
        from: "incidents",
        localField: "_id",
        foreignField: "driver",
        as: "incidents",
      },
    },
    {
      $project: {
        driverId: "$_id",
        name: 1,
        rating: 1,
        totalTrips: { $size: "$schedules" },
        completedTrips: {
          $size: {
            $filter: {
              input: "$schedules",
              as: "schedule",
              cond: { $eq: ["$$schedule.status", "Completed"] },
            },
          },
        },
        totalIncidents: { $size: "$incidents" },
        incidentTypes: {
          $map: {
            input: "$incidents",
            as: "incident",
            in: "$$incident.type",
          },
        },
        completionRate: {
          $cond: {
            if: { $gt: [{ $size: "$schedules" }, 0] },
            then: {
              $multiply: [
                {
                  $divide: [
                    {
                      $size: {
                        $filter: {
                          input: "$schedules",
                          as: "schedule",
                          cond: { $eq: ["$$schedule.status", "Completed"] },
                        },
                      },
                    },
                    { $size: "$schedules" },
                  ],
                },
                100,
              ],
            },
            else: 0,
          },
        },
      },
    },
    {
      $sort: { completionRate: -1 },
    },
  ]);

  return {
    totalDrivers: driverPerformance.length,
    driverPerformance,
  };
}

async function generateFuelEfficiencyReport() {
  const fuelLogs = await FuelLog.find()
    .sort({ date: 1 })
    .populate('vehicle', 'make model fuelType')
    .exec();

  // Group fuel logs by vehicle
  const vehicleLogsMap = {};
  fuelLogs.forEach((log) => {
    const vehicleId = log.vehicle._id.toString();

    if (!vehicleLogsMap[vehicleId]) {
      vehicleLogsMap[vehicleId] = {
        vehicleId,
        make: log.vehicle.make,
        model: log.vehicle.model,
        fuelType: log.vehicle.fuelType,
        logs: [],
        totalFuelCost: 0,
        totalFuelQuantity: 0,
        numberOfRefuels: 0,
      };
    }

    vehicleLogsMap[vehicleId].logs.push({
      odometer: log.odometer,
      quantity: log.quantity,
      cost: log.cost,
      date: log.date,
    });
    vehicleLogsMap[vehicleId].totalFuelCost += log.cost;
    vehicleLogsMap[vehicleId].totalFuelQuantity += log.quantity;
    vehicleLogsMap[vehicleId].numberOfRefuels += 1;
  });

  // Calculate fuel efficiency for each vehicle
  const fuelEfficiencyReport = Object.values(vehicleLogsMap).map((vehicle) => {
    const logs = vehicle.logs;
    if (logs.length < 2) {
      return {
        ...vehicle,
        totalDistance: 0,
        fuelEfficiency: null,
        message: 'Insufficient data to calculate fuel efficiency',
      };
    }

    logs.sort((a, b) => a.date - b.date);
    const firstOdometer = logs[0].odometer;
    const lastOdometer = logs[logs.length - 1].odometer;
    const totalDistance = lastOdometer - firstOdometer;

    if (totalDistance <= 0 || vehicle.totalFuelQuantity <= 0) {
      return {
        ...vehicle,
        totalDistance: 0,
        fuelEfficiency: null,
        message: 'Invalid odometer readings or fuel quantity',
      };
    }

    const fuelEfficiency = totalDistance / vehicle.totalFuelQuantity;

    return {
      ...vehicle,
      totalDistance,
      fuelEfficiency: fuelEfficiency.toFixed(2),
    };
  });

  return {
    totalVehiclesFueled: fuelEfficiencyReport.length,
    fuelEfficiencyReport,
  };
}

async function generateMaintenanceCostReport() {
  const maintenanceCosts = await Maintenance.aggregate([
    {
      $group: {
        _id: "$vehicle",
        totalMaintenanceCost: { $sum: "$cost" },
        totalMaintenanceEvents: { $sum: 1 },
        maintenanceTypes: { $addToSet: "$type" },
      },
    },
    {
      $lookup: {
        from: "vehicles",
        localField: "_id",
        foreignField: "_id",
        as: "vehicleDetails",
      },
    },
    {
      $unwind: "$vehicleDetails",
    },
    {
      $project: {
        vehicleId: "$_id",
        make: "$vehicleDetails.make",
        model: "$vehicleDetails.model",
        totalMaintenanceCost: 1,
        totalMaintenanceEvents: 1,
        maintenanceTypes: 1,
        averageCostPerMaintenance: {
          $divide: ["$totalMaintenanceCost", "$totalMaintenanceEvents"],
        },
      },
    },
    {
      $sort: { totalMaintenanceCost: -1 },
    },
  ]);

  return {
    totalVehiclesMaintained: maintenanceCosts.length,
    maintenanceCosts,
  };
}

async function generateFleetOverviewReport() {
  const [vehicleStats, driverStats, scheduleStats, fuelStats] = await Promise.all([
    Vehicle.countDocuments(),
    Driver.countDocuments(),
    Schedule.aggregate([
      {
        $group: {
          _id: null,
          totalSchedules: { $sum: 1 },
          completedSchedules: {
            $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
          },
        },
      },
    ]),
    FuelLog.aggregate([
      {
        $group: {
          _id: null,
          totalFuelCost: { $sum: "$cost" },
          totalFuelQuantity: { $sum: "$quantity" },
        },
      },
    ]),
  ]);

  return {
    vehicleStats: {
      totalVehicles: vehicleStats,
    },
    driverStats: {
      totalDrivers: driverStats,
    },
    scheduleStats: scheduleStats[0] || {
      totalSchedules: 0,
      completedSchedules: 0,
    },
    fuelStats: fuelStats[0] || { totalFuelCost: 0, totalFuelQuantity: 0 },
  };
}

exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId).populate(
      "createdBy",
      "username email"
    );

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving report",
      error: error.message,
    });
  }
};

exports.listReports = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = {};

    if (type) filter.type = type;

    const reports = await Report.find(filter)
      .populate("createdBy", "username")
      .sort({ generatedDate: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({
      message: "Error listing reports",
      error: error.message,
    });
  }
};

exports.getTotalData = async (req, res) => {
  try {
    const [totalDrivers, pendingCargo, totalVehicles, openIncidents] = await Promise.all([
      Driver.countDocuments(),
      Cargo.countDocuments({ deliveryStatus: "Pending" }),
      Vehicle.countDocuments(),
      Incident.countDocuments({ resolutionStatus: "Reported" }),
    ]);

    res.json({
      totalDrivers,
      pendingCargo,
      totalVehicles,
      openIncidents,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving total data",
      error: error.message,
    });
  }
};