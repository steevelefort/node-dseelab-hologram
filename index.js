var Hologram = require('./hologram');
var hologram = new Hologram();

setTimeout(async ()=>{
    console.log('Clear all videos ...');
    var response;
    response = await hologram.execCommand(hologram.COMMANDS.CLEAR_VIDEOS);
    response = await hologram.uploadFile("./media/01.mp4");
    response = await hologram.uploadFile("./media/02.mp4");
    response = await hologram.uploadFile("./media/03.mp4");
    response = await hologram.execCommand(hologram.COMMANDS.SELECT_VIDEO,0,0);
    response = await hologram.listMedia();
    console.log(response);
},0);
