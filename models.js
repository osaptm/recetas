const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UnidadSchema = new Schema({
  nombre: String,
});

const IngredienteSchema = new Schema({
  nombre: String,
  costo: Number,
  presentacion: Number,
  unidad: Schema.Types.ObjectId
});

const DetalleSchema = new Schema({
  cantidadxreceta: Number,
  ingrediente: Schema.Types.ObjectId,
  receta: Schema.Types.ObjectId
});

const RecetaSchema = new Schema({
  nombre: String,
  cantidad_platos: Number,
});

const Ingrediente = mongoose.model('Ingrediente', IngredienteSchema);
const Receta = mongoose.model('Receta', RecetaSchema);
const Unidad = mongoose.model('Unidad', UnidadSchema);
const Detalle = mongoose.model('Detalle', DetalleSchema);

module.exports = { Ingrediente, Receta, Unidad, Detalle };
