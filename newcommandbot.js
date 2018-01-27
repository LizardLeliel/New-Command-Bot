const Discord = require("discord.js");
const fs      = require("fs");

const client = new Discord.Client();

//const yesNoQuestion = /^l(izard)?[ -_]?bot,.+\?$/i;
//const ingRegExp     = /^[A-Za-z]+ing$/;
const 

const clientToken = fs.readFileSync("clienttoken.txt").toString();

var jsonCommands;


// Three main things:
// Read from a json file
// Recognize a new commaand command
//  !x y z
// Reconize an added command
//  !q

// Description for commands:
/* 
{
    "commands":
    [
    {
        "command": "!x",
        "serverID": int,
        "response": "z"
    },

    {repeat}


    ]   
}
*/

// JSON.stringify(j)

// Pick a random element from an array
function pick(array)
{
    return array[Math.floor(Math.random()*array.length)]
}

client.on("ready", () => 
{
    console.log("The bot is ready >:)");

    var jsonString;
    
    if (fs.existsSync("commands.json"))
    {
        jsonString   = fs.readFileSync("commands.json").toString();
        jsonCommands = JSON.parse(jsonString);
    }
    else
    {
        jsonCommands = {"commands": []};
    }
        
    
    // var fd = fs.openSync("commands.json", "w+");
    // var q  = fs.readSync(fd);
    //console.log(jsonCommands["commands"][0].response);

});

client.on("message", message => 
{
    // replacing _ing with _ong
    // if (ingRegExp.test(message.content))
    // {
    //     message.channel.send(message.content.slice(0,-3) + "ong");
    // }

});

client.login(clientToken);
