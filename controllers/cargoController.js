const Cargo = require('../models/Cargo');

exports.createCargo = async (req, res) => {
  const customer = req.user._id;
  try {
    const { 
      description, 
      weight, 
      dimensions, 
      type, 
      destination,  
      specialInstructions 
    } = req.body;

    const cargo = new Cargo({
      description,
      weight,
      dimensions,
      type,
      destination,
      customer,
      specialInstructions
    });

    await cargo.save();
    res.status(201).json(cargo);
  } catch (error) {
    res.status(400).json({ 
      message: 'Cargo creation failed', 
      error: error.message 
    });
  }
};

exports.updateCargoStatus = async (req, res) => {
  try {
    const { cargoId } = req.params;
    const deliveryStatus = 'In Transit';
    const cargo = await Cargo.findByIdAndUpdate(
      cargoId,
      { deliveryStatus },
      { new: true }
    );

    if (!cargo) {
      return res.status(404).json({ message: 'Cargo not found' });
    }

    res.json(cargo);
  } catch (error) {
    res.status(400).json({ 
      message: 'Cargo status update failed', 
      error: error.message 
    });
  }
};

exports.getCargoByCustomer = async (req, res) => {
  try {
    const customerId  = req.user._id;
    const cargo = await Cargo.find({ customer: customerId })
      .populate('customer', 'username email');
    res.json(cargo);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error retrieving cargo', 
      error: error.message 
    });
  }
};

exports.getAllCargo = async (req, res) => {
  try {
    const cargo = await Cargo.find()
      .populate('customer', 'username email');

    res.json(cargo);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error retrieving cargo', 
      error: error.message 
    });
  }
};