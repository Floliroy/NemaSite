require('dotenv').config()
/**
 * My libraries
 */
const YouTube = require('youtube-node')
const youtube = new YouTube()
youtube.setKey(process.env.YOUTUBE_TOKEN)

const express = require('express')
const app = express()
 
/**
 * Get youtube video IDs
 */
let videoIds = new Array()
function updateVideoIds(){
    youtube.getPlayListsItemsById("UUHgSUqAOaNpwxVZxd3ZlAZA", 4, function(err, data){
        if(data.items[0].contentDetails.videoId != videoIds[0]){
            console.log("Update Youtube videos displayed !")
        }
        videoIds = new Array()
        for(const item of data.items){
            videoIds.push(item.contentDetails.videoId)
        }
    })
    //re call each 30 minutes
    setTimeout(updateVideoIds, 30 * 60 * 1000)
}
updateVideoIds()

/**
 * Website Init
 */
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(express.json())

app.get("/", async function(req, res){
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    console.log(`${ip} asked for index !`);
    res.render("partials/layout", {body: "index", videoIds: videoIds, req: req})
})

/**
 * Lancement serveur web
 */
app.use(function (req, res){
    return res.redirect("/")
})
app.listen(5000, function(){
    console.log("Server running on port 5000!")
})

/**
 * Change base console.log
 */
const basicConsole = console.log
Date.prototype.format = function(){
    return this.toLocaleDateString('fr-FR', { 'timeZone': 'Europe/Paris', 
        'day': '2-digit', 'month': '2-digit', 'year': 'numeric', 
        'hour': '2-digit', 'minute': '2-digit', 'second': '2-digit', 'hour12': false 
    }).replace(',', ' -')
}
console.log = function(){
    const date = `[${new Date().format()}]`
    Array.prototype.unshift.call(arguments, date)
    basicConsole.apply(this, arguments)
}
 /**
  * To avoid crashes
  */
process.on('uncaughtException', (err) => {
    console.log(err)
})