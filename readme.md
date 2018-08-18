# Node.JS driver for DseeLab Hologram
Written for Dsee-50. I hope it works for other models

## Warning ! This is an experimental library and it may damage your device. Use it at your own risks !

## Before using it
Images must be encoded to MP4 file :
```
ffmpeg -loop 1 -i "path/source.png" -c:v libx264 -vprofile baseline -level 3 -s 512x512 -r 24 -refs 1 -b:v 1.0M -c:a libmp3lame -pix_fmt yuvj420p -t 5 "path/target.mp4"
```
Video must be encoded too : 
```
ffmpeg -i "path/source.mp4" -c:v libx264 -vprofile baseline -level 31 -s 512x512 -r 24 -refs 1 -b:v 1.0M -c:a libmp3lame -ac 2 -ar 22050 -pix_fmt yuvj420p "path/target.mp4" 
```

## Fast start
```
var Hologram = require('./hologram');
var hologram = new Hologram();

// Start engine
await hologram.execCommand(hologram.COMMANDS.START_ENGINE);

// Remove all media
await hologram.execCommand(hologram.COMMANDS.CLEAR_VIDEOS);

// Upload 3 media
await hologram.uploadFile("./media/01.mp4");
await hologram.uploadFile("./media/02.mp4");
await hologram.uploadFile("./media/03.mp4");

// Choose the last uploaded media
await hologram.execCommand(hologram.COMMANDS.SELECT_VIDEO,0,2);

// List all uploaded media
var allMedia = await hologram.listMedia();
console.log(allMedia);
```