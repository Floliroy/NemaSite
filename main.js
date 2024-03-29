require('dotenv').config()
/**
 * My libraries
 */
const YouTubeNotifier = require('youtube-notification')
const notifier = new YouTubeNotifier({
   hubCallback: "http://194.5.159.2:3614/",
   port: 3614,
   secret: process.env.SECRET,
   path: "/"
})
const YouTube = require('youtube-node')
const youtube = new YouTube()
youtube.setKey(process.env.YOUTUBE_TOKEN)

const express = require('express')
const app = express()
 
/**
 * Get youtube video IDs
 */
notifier.setup()
notifier.on("notified", function(){
    updateVideoIds()
})
notifier.subscribe(process.env.YOUTUBE_CHANNEL_ID)

let videoIds = new Array()
let playlistIds = new Array()
function updateVideoIds(){
    youtube.getPlayListsItemsById(process.env.YOUTUBE_PLAYLIST_ID, 4, function(err, data){
        if(data.items[0].contentDetails.videoId != videoIds[0]){
            console.log("Update Youtube videos displayed !")
        }else return
        videoIds = new Array()
        for(const item of data.items){
            videoIds.push(item.contentDetails.videoId)
        }
    })
    youtube.getPlayListsItemsById("PLXuWGuL4Fzc5Gjmp_FRjg75VRhFfJ5-Ub", 50, function(err, data){
        if(data.items[0].contentDetails.videoId != playlistIds[playlistIds.length - 1]){
            console.log("Update Youtube playlist : Duos Improbables !")
        }else return
        playlistIds = new Array()
        for(const item of data.items){
            playlistIds.push(item.contentDetails.videoId)
        }
        playlistIds = playlistIds.reverse()
    })
    setTimeout(updateVideoIds, 15 * 60 * 1000)
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
    console.log(`${ip} asked for index !`)
    res.render("partials/layout", {body: "index", videoIds: videoIds, req: req})
})
app.get("/duos", async function(req, res){
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    console.log(`${ip} asked for duos !`)
    res.render("partials/layout", {body: "duos", playlistIds: playlistIds, req: req})
})
app.get("/zlan", async function(req, res){
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    console.log(`${ip} asked for zlan !`)
    res.render("partials/layout", {body: "zlan", req: req})
})
app.get("/discord", (req, res) => res.redirect("https://discord.gg/GgGRtYb"))

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