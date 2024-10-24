import { Command } from 'commander'
const program = new Command()

program
    .option("-p <PORT>" , "PUERTO DONDE SE INICIA EL SERVIDOR" , 8080)
    .option("--mode <mode>" , "MODO DE DESARROLLO" , "DESARROLLO")
program.parse()

//node src/util/commander.js -p 3000 --mode PRODUCCION | PORT = 3000 | mode = 'PRODUCCION'
//npm run dev - -p 8080 -- --mode PRODUCCION | PORT = 8080 | mode = PRODUCCCION
console.log("OPCIONES: " , program.opts())

export default program