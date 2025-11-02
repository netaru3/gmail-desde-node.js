function instalar(paquete:string){try{require.resolve(paquete)} catch{
execSync(`npm install ${paquete}`)
}};
instalar("nodemailer");
instalar("imapflow");
instalar("mailparser");
import nodemailer from 'nodemailer';
import readline from 'readline/promises';
import {ImapFlow} from 'imapflow';
import {simpleParser} from 'mailparser';
import fs from 'fs';
import { execSync } from 'child_process';


let num= 0
export class logs{
    constructor(){}
    private static readonly correos='correos';

     static crearpath(){
        if(!fs.existsSync(this.correos)){
            fs.mkdirSync(this.correos, {recursive: true}
            );
        };
     };
    static savelogs(data:string){ ++num
      fs.writeFileSync(`${this.correos}/correo${num}.txt`,data)};
     }
let rl= readline.createInterface(
    {input: process.stdin,
    output: process.stdout
    }
 )
 
 async function guardar(){logs.crearpath();
  let contraseña= await rl.question("ingrese su contraseña de aplicación:");
let gmailUsuario=await rl.question("ingrese su gmail:");
let limit= await rl.question("ingrese la cantidad de correos que desea guardar:")
const client = new ImapFlow({
  host: 'imap.gmail.com',
  port: 993,
  secure: true,
  auth: {
    user: gmailUsuario ||'netaru3@gmail.com',
    pass: contraseña // NO tu contraseña normal
  },
  logger: false
});

(async () => {
  await client.connect();
  await client.mailboxOpen('INBOX');
  let i=0
  console.log( `primeros ${limit} correos:`);
  let messages = await client.search({ seen: false }, { limit: limit, sort: ['ARRIVAL'] });

  for (let uid of messages) {
   if(i<limit){let msg = await client.fetchOne(uid, { source: true });
    let parsed = await simpleParser(msg.source);
     logs.savelogs(`\nDe: ${parsed.from.text}
      Asunto: ${parsed.subject}
      Texto: ${parsed.text}...`
     );} ++i
  };

  await client.logout();
  rl.close()
})();

  
 }
  let copia=await rl.question("desea guardar una copia de seguridad de los correos, escriba si o no:")
 if(copia.toLowerCase()==="si"){guardar()}
let decision= await rl.question("escriba 'leer' para leer los correos entrantes, escriba 'enviar' para enviar un correo o escriba 'salir' para salir:")
 if(decision==="enviar"){enviargmail()};
 if(decision==="leer"){leergmails()};
 if (decision==="salir"){rl.close()}

 async function leergmails(){
let contraseña= await rl.question("ingrese su contraseña de aplicación:");
let gmailUsuario=await rl.question("ingrese su gmail:");
let limit= await rl.question("ingrese la cantidad de correos que desea ver:")
const client = new ImapFlow({
  host: 'imap.gmail.com',
  port: 993,
  secure: true,
  auth: {
    user: gmailUsuario ||'netaru3@gmail.com',
    pass: contraseña // NO tu contraseña normal
  },
  logger: false
});

(async () => {
  await client.connect();
  await client.mailboxOpen('INBOX');
  let i=0
  console.log( `primeros ${limit} correos:`);
  let messages = await client.search({ seen: false }, { limit: limit, sort: ['ARRIVAL'] });

  for (let uid of messages) {
   if(i<=limit){let msg = await client.fetchOne(uid, { source: true });
    let parsed = await simpleParser(msg.source);
     console.log(`\nDe: ${parsed.from.text}`); 
     console.log(`Asunto: ${parsed.subject}`)
    ; console.log(`Texto: ${parsed.text}...`)
    console.log("----------------------------------------");} ++i
  };

  await client.logout();
  rl.close()
})();

 }
async function enviargmail(){
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
rl.close()}

//admito que este código es un despelote ilegible super mal organizado y que gran parte lo hizo chatgpt xD
