const FuelLog = require("../models/FuelLog");

exports.createFuelLog = async (req, res) => {
  try {
    const { vehicle, driver, fuelType, quantity, cost, location, odometer } =
      req.body;

    const fuelLog = new FuelLog({
      vehicle,
      driver,
      fuelType,
      quantity,
      cost,
      location,
      odometer,
    });

    await fuelLog.save();
    res.status(201).json(fuelLog);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Fuel log creation failed", error: error.message });
  }
};

exports.getFuelLogsByVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const fuelLogs = await FuelLog.find({ vehicle: vehicleId })
      .populate("vehicle")
      .populate("driver");
    res.json(fuelLogs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving fuel logs", error: error.message });
  }
};

exports.calculateFuelEfficiency = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const fuelLogs = await FuelLog.find({ vehicle: vehicleId }).sort({
      date: 1,
    });

    if (fuelLogs.length < 2) {
      return res.status(400).json({
        message: "Insufficient data for fuel efficiency calculation",
      });
    }

    // Calculate total fuel cost and quantity
    const totalFuelCost = fuelLogs.reduce((sum, log) => sum + log.cost, 0);
    const totalFuelQuantity = fuelLogs.reduce(
      (sum, log) => sum + log.quantity,
      0
    );

    // Calculate efficiency based on first and last odometer readings
    const firstLog = fuelLogs[0];
    const lastLog = fuelLogs[fuelLogs.length - 1];

    const totalDistance = lastLog.odometer - firstLog.odometer;
    const fuelEfficiency = totalDistance / totalFuelQuantity; // km per liter

    res.json({
      vehicleId,
      totalFuelCost,
      totalFuelQuantity,
      totalDistance,
      fuelEfficiency: fuelEfficiency.toFixed(2),
      averageCostPerKm: (totalFuelCost / totalDistance).toFixed(2),
      logs: fuelLogs.length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error calculating fuel efficiency",
      error: error.message,
    });
  }
};

exports.generateFuelConsumptionReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const fuelLogs = await FuelLog.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: "$vehicle",
          totalFuelCost: { $sum: "$cost" },
          totalFuelQuantity: { $sum: "$quantity" },
          numberOfRefuels: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "vehicles", // Assuming the collection name is 'vehicles'
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
          vehicleMake: "$vehicleDetails.make",
          vehicleModel: "$vehicleDetails.model",
          totalFuelCost: 1,
          totalFuelQuantity: 1,
          numberOfRefuels: 1,
          averageCostPerRefuel: {
            $divide: ["$totalFuelCost", "$numberOfRefuels"],
          },
        },
      },
    ]);

    res.json({
      reportPeriod: { startDate, endDate },
      totalVehiclesFueled: fuelLogs.length,
      report: fuelLogs,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error generating fuel consumption report",
      error: error.message,
    });
  }
};

exports.getAllFuelLogs = async (req, res) => {
  try {
    const fuelLogs = await FuelLog.find()
      .populate("vehicle")
      .populate("driver");
    res.json(fuelLogs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving fuel logs", error: error.message });
  }
};