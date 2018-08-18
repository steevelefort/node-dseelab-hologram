var net = require('net');
var fs = require('fs');
var path = require('path');

module.exports = class Hologram {

    constructor(ip = "192.168.2.1") {
        this.IP = ip;

        // Command codes
        this.COMMANDS = {
            SELECT_VIDEO: [0x05, 0x35, 0xa4, 0x08],
            DELETE_VIDEO: [0x05, 0x35, 0xa4, 0x04],
            CLEAR_VIDEOS: [0x05, 0x35, 0xa4, 0x05],
            LIST_VIDEOS: [0x05, 0x35, 0xa4, 0x0b],
            START_ENGINE: [0x05, 0x35, 0xa4, 0x01],
            STOP_ENGINE: [0x05, 0x35, 0xa4, 0x02],
        };
    }

    execCommand(command, arg1 = 0, arg2 = 0) {
        return new Promise(function (resolve, reject) {
            if (typeof command !== "undefined") {
                console.log("IP:", this.IP);
                var socket8000 = net.createConnection(8000, this.IP);
                socket8000.once('error', function (error) {
                    socket8000.removeAllListeners();
                    socket8000.destroy();
                    reject(error);
                });
                socket8000.once("data", function (data) {
                    socket8000.removeAllListeners();
                    socket8000.destroy();
                    resolve(data);
                });
                var commandWithArgs = command.slice(0);
                commandWithArgs.push(arg1);
                commandWithArgs.push(arg2);
                var commandBuffer = Buffer.from(commandWithArgs);
                socket8000.write(commandBuffer);
            } else {
                reject("Unknow command");
            }
        }.bind(this));
    }

    async listMedia(){
        return new Promise(async function (resolve, reject) {
            try {
                var list = [];
                var response = await this.execCommand(this.COMMANDS.LIST_VIDEOS);
                var data = response.toString("utf8",7).trim();
                var lines = data.split("\r\n");
                lines.forEach(line => {
                    var fields = line.split(",");
                    list.push({
                        name:fields[0],
                        size:fields[1],
                        //unknowData:fields[2], // Don't know what is the third arg (always 1 ?)
                    });
                });
                //console.log(response,data, lines);
                resolve(list);
            } catch (error) {
                reject(error);        
            }
        }.bind(this));
    }

    uploadFile(filePath) {
        return new Promise(function (resolve, reject) {
            if (fs.existsSync(filePath)) {
                var socket8002 = net.createConnection(8002, this.IP);
                socket8002.once('error', function (error) {
                    socket8002.removeAllListeners();
                    socket8002.destroy();
                    reject(error);
                });
                socket8002.once("data", function (data) {
                    socket8002.removeAllListeners();
                    socket8002.destroy();
                    resolve(data);
                });
                var size = fs.statSync(filePath).size;
                var header = createHeader(path.basename(filePath), size);
                fs.readFile(filePath, function (error, data) {
                    if (error) reject(error);
                    var buffer = Buffer.concat([Buffer.from([1]), header, data]);
                    socket8002.write(buffer);
                });
            } else {
                reject("File does not exist.");
            }
        }.bind(this));
    }
};

function createHeader(filename, size) {
    var part2 = Buffer.from([0, 0, 0, 0, 0, 0, 0, 6]);
    var part3 = Buffer.from(filename);
    var part1 = Buffer.from(longToByteArray(size + 8 + part2.length + part3.length));
    var buffer = Buffer.concat([part1, part2, part3]);
    console.log(buffer);
    return buffer;
}

function longToByteArray(long) {
    var byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
    for (var index = 0; index < byteArray.length; index++) {
        var byte = long & 0xff;
        byteArray[7 - index] = byte; // Remove "7 -" if processor swap bytes
        long = (long - byte) / 256;
    }
    return byteArray;
}

