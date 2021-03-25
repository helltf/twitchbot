class Emotegame{
    emote;
    letterguessed;
    channel
    constructor(emote,channel,letterguessed){
        this.emote=emote;
        this.letterguessed=letterguessed
        this.channel=channel
    }
    get emote(){
        return this.emote
    }
    get letterguessed(){
        return this.letterguessed
    }
    set emote(emote){
        return this.emote
    }
    set letterguessed(letterguessed){
        return this.letterguessed
    }
    set channel(channel){
        this.channel=channel
    }
    get channel(){
        return this.channel
    }
}
module.exports.Emotegame=Emotegame;