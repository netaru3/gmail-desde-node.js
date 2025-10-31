import nodemailer from 'nodemailer';
import readline from 'readline/promises';
//creando la interfaz UwU 
let rl= readline.createInterface(
    {input: process.stdin,
    output: process.stdout
    }
 )
 let contraseña= await rl.question("ingrese su contraseña de aplicación:");
let gmailUsuario=await rl.question("ingrese su gmail:");
let gmailDestinatario=await rl.question("ingrese el gmail del destinatario:");
let titulo=await rl.question("ingrese el titulo del gmail:")
let texto=await rl.question("ingrese el texto que desea enviar:")
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: gmail(),
    pass: contraseña
  }
});
 function gmail(){if(gmailUsuario===""){return "netaru3@gmail.com"}
else{return gmailUsuario}}
  function destinatario(){if(gmailDestinatario===""){return "aaronpastorini46@gmail.com"}
else{return gmailDestinatario}}
  function subject(){if(titulo===""){return "hola desde node.js"}
else{return titulo}}
const mailOptions = {
  from:gmail(), 
  to: destinatario(),
  subject: subject(),
  text: texto
  
};

try {
  const info = await transporter.sendMail(mailOptions);
  console.log('Correo enviado:', info.response);
} catch (error) {
  console.error('Error al enviar el correo:', error);
}
rl.close()