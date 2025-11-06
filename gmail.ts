import 'dotenv/config'
import env from 'env-var'
import { execSync } from 'child_process';
import nodemailer from 'nodemailer';
import readline from 'readline/promises';
import {ImapFlow} from 'imapflow';
import {simpleParser} from 'mailparser';
import fs from 'fs';
 let contraseña: string | undefined= undefined;
 let gmailUsuario:string;
 let titulo:string;
 let textoxD:string;
 let asunto=env.get("asunto").asString();
 let texto= env.get("texto").asString();

export let codigo:string | undefined=env.get('codigo').asString();
export let gmailreal= env.get("email").asString();
export let gmailDestinatario= env.get("emaildestinatario").asString();
function instalar(paquete:string){try{require.resolve(paquete)} catch{
execSync(`npm install ${paquete}`)
}};
instalar("nodemailer");
instalar("imapflow");
instalar("mailparser");
instalar("env-var")

console.log(codigo)


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
 
 async function guardar(
 contra:string,email:string){logs.crearpath();
let limit= await rl.question("ingrese la cantidad de correos que desea guardar:")
const client = new ImapFlow({
  host: 'imap.gmail.com',
  port: 993,
  secure: true,
  auth: {
    user: email,
    pass: contra // NO tu contraseña normal
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
 if(copia.toLowerCase()==="si"){guardar(codigo,gmailreal)}
let decision= await rl.question("escriba 'leer' para leer los correos entrantes, escriba 'enviar' para enviar un correo o escriba 'salir' para salir:")
 if(decision==="enviar"){enviargmail(texto,true, codigo, gmailreal, gmailDestinatario,asunto)};
 if(decision==="leer"){leergmails()};
 if (decision==="salir"){rl.close()}

 async function leergmails(){
let gmailUsuario=await rl.question("ingrese su gmail:");
let limit= await rl.question("ingrese la cantidad de correos que desea ver:")
const client = new ImapFlow({
  host: 'imap.gmail.com',
  port: 993,
  secure: true,
  auth: {
    user: gmailUsuario ||'netaru3@gmail.com',
    pass: codigo // NO tu contraseña normal
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

export async function enviargmail(text:string,
  automatizacion:boolean,
 contra:string,email:string,emaildestinatario:string,title:string,
 
){

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: email,
    pass: contra
  }
});

const mailOptions = {
  from:email, 
  to: emaildestinatario,
  subject: title,
  text: text
  
};

try {
  const info = await transporter.sendMail(mailOptions);
  console.log('Correo enviado:', info.response);
} catch (error) {
  console.error('Error al enviar el correo:', error);
}
rl.close()}

//admito que este código es un despelote ilegible super mal organizado y que gran parte lo hizo chatgpt xD
