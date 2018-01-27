const Discord = require("discord.js");
const fs      = require("fs");

const client = new Discord.Client();

const newCommandExp = /^!newcommand.*$/

const clientToken = fs.readFileSync("clienttoken.txt").toString();

var jsonCommands;


// todo: recognize when an added command is called

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
function findCommand(commandList, command, serverID)
{
    var subCommandList = commandList.filter(x => x.command == command);
    var foundCommand   = subCommandList.filter(x => x.serverID == serverID);
    // This asasumes they'll never be a second command made for the same server.
    return foundCommand[0];
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
        
    console.log(findCommand(jsonCommands.commands, "!a", 254411326472847370));

    // Just keeping these two lines handy...
    // var fd = fs.openSync("commands.json", "w+");
    // var q  = fs.readSync(fd);
});

client.on("message", message => 
{
    // Find !x ---
    if (newCommandExp.test(message.content))
    {
        var spliceIndex = message.content.indexOf(" ");
        // Check i now
        if (spliceIndex == -1)
        {
            message.channel.send("\`!newcommand\` requires a name for the new command and"
                               + " a response it'd give.");
            return;
        }

        var args = message.content.slice(spliceIndex + 1); 
        var arg1, arg2;

        console.log("Split message: " + args);
        spliceIndex = args.indexOf(" ");

        if (spliceIndex == -1)
        {
            arg1 = arg1;
            arg2 = "";
        }
        else
        {
            arg1 = args.slice(0, spliceIndex);
            arg2 = args.slice(spliceIndex + 1);
        }

        //console.log("args: " + arg1 + " " + arg2);
        //console.log("Found message: " + message.content);

        // Either we:
        //  1) Enter a new Command if it doesn't exist (unless there is no arg 2)
        //  2) modify the command
        //  3) delete the command if arg2 is empty. (unless there arg1 isn't an existing command)
        var foundCommand = findCommand(jsonCommands.commands, arg1, message.channel.guild.id);

        console.log(foundCommand);

        // Enter new comamnd
        if (!foundCommand && arg2)
        {
            jsonCommands.commands.push({
                "command":  "!" + arg1,
                "serverID": message.channel.guild.id,
                "response": arg2
            });
            console.log(jsonCommands);
            // Add a "added!" message to user.
        }
        else if (foundCommand == true && arg2 == true)
        {
            // Unimplemented
        }
        else if (foundCommand == true && arg2 == false)
        {
            // Delete
        }
        else // There's only one more option
        {
            // Give error message.
        }

        // Then we save changes.

    }

    // Or if its !x, search.

});

client.login(clientToken);
