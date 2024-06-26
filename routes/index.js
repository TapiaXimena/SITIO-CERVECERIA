var express = require('express');
var router = express.Router();
var nodemailer = require("nodemailer");
var novedadesModel = require('../models/novedadesModel');
var cloudinary = require ('cloudinary').v2;

/* GET home page. */
router.get('/',async function (req, res, next) {
  var novedades = await novedadesModel.getNovedades();

novedades = novedades.splice(0,5); //seleccionamos los primeros 5 elementos del array
  novedades = novedades.map(novedad => {
    if (novedad.img_id) {
        const imagen = cloudinary.url(novedad.img_id, {
            width: 460,
            crop: 'fill'
        });
        return {
            ...novedad,
            imagen 
        }
    } else {
        return {
            ...novedad, 
            imagen: '/images/noimage.jpg' 
        }
    }
});

  res.render('index',{
    novedades
});
});

router.post("/", async (req, res, next) => {

  console.log(req.body)// estoy capturando datos?

  var nombre = req.body.nombre;
  var apellido = req.body.apellido;
  var email = req.body.email;
  var tel = req.body.tel;
  var mensaje = req.body.mensaje;

  var obj = {
    to: "x.tapia1992@gmail.com",
    subject: "contacto desde la web",
    html: nombre + " " + apellido + " se contactó a traves de la web y quiere más información a éste correo: " + email + ".<br> Ademas, hizo el siguiente comentario: " + mensaje + ".<br> Su tel es: " + tel
  } //cierra var obj

  var transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    }
  })// cierra transporter

  var info = await transport.sendMail(obj);

  res.render("index", {
    message: "Mensaje enviado correctamente",
  });
}); // cierra peticion del POST

module.exports = router;
