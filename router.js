const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongoose').Types;
const { Ingrediente, Receta, Unidad , Detalle} = require('./models');

router.get('/', async (req, res) => {
  res.render('inicio', {});
});

/**************************************************/
/**************************************************/
router.get('/unidades', async (req, res) => {
  const unidades = await Unidad.find({});
  res.render('unidades', { unidades});
});

router.post('/unidades', async (req, res) => {
  const { nombre } = req.body;  
  const nuevaUnidad = new Unidad({ nombre });
  await nuevaUnidad.save();
  res.redirect('/unidades');
});
/**************************************************/
/**************************************************/
router.get('/recetas', async (req, res) => {

  const listIngredientes = await Ingrediente.aggregate([
    {
      $lookup:{
        from: "unidads",
        localField: "unidad",
        foreignField: "_id",
        as: "datos_unidad"
      }
    }
  ]);
  const recetas = await Receta.aggregate([
    {
      $lookup:{
        from: "detalles",
        localField: "_id",
        foreignField: "receta",
        as: "array_ingredientes",
        pipeline:[
          {
            $lookup:{
              from: "ingredientes",
              localField: "ingrediente",
              foreignField: "_id",
              as: "datos_ingrediente",
              pipeline:[
                {$lookup:{
                  from: "unidads",
                  localField: "unidad",
                  foreignField: "_id",
                  as: "datos_unidad"
                }}
              ]
            }
          }
        ]
      },           
    }
  ]);

  res.render('recetas', { recetas , listIngredientes});
});

router.post('/recetas', async (req, res) => {
  const { nombre, cantidad_platos } = req.body;  
  const nuevaReceta = new Receta({ nombre, cantidad_platos });
  await nuevaReceta.save();
  res.redirect('/recetas');
});

router.post('/receta_add_ingrediente', async (req, res) => {
  const { cantidadxreceta, idReceta, idIngrediente } = req.body;  
  const nuevaDetalle= new Detalle({ cantidadxreceta, ingrediente:idIngrediente, receta:idReceta });
  const resultado = await nuevaDetalle.save();
  res.send({mensaje:"OK", idDetalle:resultado._id});
});

router.post('/receta_eliminar_ingrediente', async (req, res) => {
  const { idDetalle } = req.body;  
  try {
    await Detalle.findByIdAndDelete(idDetalle);
    res.send({mensaje:"OK"});
  } catch (err) {
    res.send({mensaje:"ERROR"});
  }
});


/**************************************************/
/**************************************************/

router.get('/ingredientes', async (req, res) => {
  const ingredientes = await Ingrediente.aggregate([
    {
      $lookup:{
        from: "unidads",
        localField: "unidad",
        foreignField: "_id",
        as: "unidad"
      }
    }
  ]);
  const unidades = await Unidad.find({});
  res.render('ingredientes', { ingredientes, unidades});
});

router.post('/ingredientes', async (req, res) => {
  const { nombre, unidadMedida, costo } = req.body;
  const nuevoIngrediente = new Ingrediente({ nombre,  unidad:unidadMedida, costo });
  await nuevoIngrediente.save();
});


router.put('/ingrediente_editar', async (req, res) => {
  const { idUnidad,nombre,costo,idIngrediente} = req.body;
  try {
    const resultado = await Ingrediente.findByIdAndUpdate(idIngrediente, { nombre, costo, unidad: idUnidad}, { new: true });
    res.send({mensaje:"OK", resultado});
  } catch (error) {
    console.log(error)
    res.send({mensaje:"ERROR"});
  }

});
/**************************************************/
/**************************************************/
module.exports = router;
