const Route = require('../models/Route');
const Vehicle = require('../models/Vehicle');

// Create a new route
exports.createRoute = async (req, res) => {
  try {
    const { RouteId, Source, Destination, Distance, EstimatedTime, VehicleId } = req.body;

    const route = new Route({ RouteId, Source, Destination, Distance, EstimatedTime, VehicleId });
    await route.save();

    res.status(201).json(route);
  } catch (error) {
    res.status(400).json({ message: 'Route creation failed', error: error.message });
  }
};

// Optimize a route
exports.optimizeRoute = async (req, res) => {
  try {
    const { routeId } = req.params;

    const route = await Route.findOne({ RouteId: routeId }).populate('VehicleId');
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    // Placeholder for external API integration
    const trafficData = await getTrafficData(route.Source, route.Destination);
    const weatherData = await getWeatherData(route.Source);

    // Adjust distance and estimated time based on traffic and weather data
    const adjustedDistance = route.Distance * (1 + trafficData.trafficFactor);
    const adjustedTime = route.EstimatedTime * (1 + weatherData.weatherImpact);

    const optimizedRoute = {
      RouteId: route.RouteId,
      Source: route.Source,
      Destination: route.Destination,
      OriginalDistance: route.Distance,
      AdjustedDistance: adjustedDistance.toFixed(2),
      OriginalTime: route.EstimatedTime,
      AdjustedTime: adjustedTime.toFixed(2),
    };

    res.status(200).json(optimizedRoute);
  } catch (error) {
    res.status(500).json({ message: 'Route optimization failed', error: error.message });
  }
};

// Real-time adjustments (e.g., due to traffic/weather changes)
exports.adjustRoute = async (req, res) => {
  try {
    const { routeId } = req.params;

    const route = await Route.findOne({ RouteId: routeId });
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    const realTimeTraffic = await getTrafficData(route.Source, route.Destination);
    const realTimeWeather = await getWeatherData(route.Destination);

    const adjustment = {
      TrafficFactor: realTimeTraffic.trafficFactor,
      WeatherImpact: realTimeWeather.weatherImpact,
      SuggestedAlternative: realTimeTraffic.alternativeRoute || 'No alternative route available',
    };

    res.status(200).json(adjustment);
  } catch (error) {
    res.status(500).json({ message: 'Real-time route adjustment failed', error: error.message });
  }
};

async function getTrafficData(source, destination) {
  return {
    trafficFactor: 0.1, // Example: 10% increase in distance/time
    alternativeRoute: 'Route Alternative A', // Example: Suggested alternative route
  };
}

async function getWeatherData(location) {
  return {
    weatherImpact: 0.05, // Example: 5% increase in distance/time
  };
}

exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find().populate('VehicleId', ['licensePlate','currentLocation']);
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving routes', error: error.message });
  }
};