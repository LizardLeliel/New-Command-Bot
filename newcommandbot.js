const Discord = require("discord.js");
const fs      = require("fs");

const client = new Discord.Client();

const newCommandExp = /^!newcommand.*$/
const commandExp    = /^![^ ]+$/

const clientToken = fs.readFileSync("clienttoken.txt").toString();

var commandList;

/* 
 * command List format:
 *  { commands: [array of commands] }
 * A command object:
 *  {
 *      "command":  the command's name,
 *      "serverID": the server the command is associated with
 *      "response": the response the bot will give when the command
 *                   is called.
 *  } 
 */

function findCommand(commandList, command, serverID)
{
    var subCommandList = commandList.filter(x => x.command == command);
    var foundCommand   = subCommandList.filter(x => x.serverID == serverID);
    // This assumes no two commands with the same command name will be added 
    //  to the same server (shouldn't happen in code logic) 
    return foundCommand[0];
}

client.on("ready", () => 
{
    console.log("The bot is ready >:)");

    
    // Fill commandList with file (or a default value if no file exists)
    if (fs.existsSync("commands.json"))
    {
        var jsonString;
        jsonString  = fs.readFileSync("commands.json").toString();
        commandList = JSON.parse(jsonString);
    }
    else
    {
        commandList = {"commands": []};
    }
})

client.on("message", message => 
{
    // Exit if not a guild
    if (message.channel.type != "text")
    {
        message.channel.send("I'm only for guild dms!");
    }

    // User types !newcommand
    if (newCommandExp.test(message.content) == true)
    {
        var spliceIndex = message.content.indexOf(" ");
        
        // Make sure !newcommand is called with at least one argument.
        if (spliceIndex == -1)
        {
            message.channel.send("\`!newcommand\` requires a name for the new" 
                               + " command and a response it'd give.");
            return;
        }

        // Extract arguements.
        var args = message.content.slice(spliceIndex + 1); 
        var arg1, arg2;

        spliceIndex = args.indexOf(" ");

        if (spliceIndex == -1)
        {
            arg1 = args;
            arg2 = "";
        }
        else
        {
            arg1 = args.slice(0, spliceIndex);
            arg2 = args.slice(spliceIndex + 1);
        }

        // Add an ! in front of arg1 to make things a little easier.
        arg1 = "!" + arg1;

        // Find said command
        var foundCommand 
            = findCommand(commandList.commands, 
                          arg1, 
                          message.channel.guild.id);

        // User is creating a new command
        if (foundCommand == undefined && arg2 != "")
        {
            
            commandList.commands.push({
                "command": arg1,
                "serverID": message.channel.guild.id,
                "response": arg2
            });
            
            fs.writeFileSync("commands.json", JSON.stringify(commandList));
            message.channel.send("Command `" + arg1 + "` added!");
        }
        // User is editing a command.
        else if (foundCommand != undefined && arg2 != "")
        {
            foundCommand.response = arg2;

            fs.writeFileSync("commands.json", JSON.stringify(commandList));
            message.channel.send("Command `" + arg1 + "` edited!");
        }
        //User is deleting a command
        else if (foundCommand != undefined && arg2 == "")
        {
            // Filter the command out
            commandList.commands
                = commandList.commands.filter(x => x != foundCommand);

            message.channel.send("Command `" + arg1 + "` removed.");
            fs.writeFileSync("commands.json", JSON.stringify(commandList));
        }
        else // User creates a new command but with no response 
        {
            message.channel.send("You need to give a response for command `" 
                + arg1 + "`!");
        }

    }

    // User types something like a command (that has nos spaces)
    //  - search for the command.
    else if (commandExp.test(message.content) == true)
    {
        var command 
            = findCommand(commandList.commands, 
                          message.content, 
                          message.channel.guild.id)
     
        if (!command)
        {
            message.channel.send("Command not found: `" 
                                 + message.content + "`");
        }
        else
        {
            message.channel.send(command.response);
        }
    }

});

client.login(clientToken);
