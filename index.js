var Hologram = require('./hologram');
var hologram = new Hologram();

setTimeout(async ()=>{
    await hologram.execCommand(hologram.COMMANDS.START_ENGINE);
    await hologram.execCommand(hologram.COMMANDS.CLEAR_VIDEOS);
    await hologram.uploadFile("./media/01.mp4");
    await hologram.uploadFile("./media/02.mp4");
    await hologram.uploadFile("./media/03.mp4");
    await hologram.execCommand(hologram.COMMANDS.SELECT_VIDEO,0,2);
    var allMedia = await hologram.listMedia();
    console.log(allMedia);
},0);
