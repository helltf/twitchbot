class Rpsgame{
    player1;
    player2;
    player1_decision;
    player2_decision;
    channel;
    constructor(player1,player2,channel){
        this.player1=player1
        this.player2=player2
        this.player1_decision=undefined
        this.player2_decision=undefined
        this.channel = channel
    }
    get player1(){
        return this.player1
    }
    get player2(){
        return this.player2
    }
    set player1(player){
        this.player1=player;
    }
    set player2(player){
        this.player1=player;
    }
    get player1_decision(){
        return this.player1_decision
    }
    get player2_decision(){
        return this.player2_decision
    }
    set player1_decision(decision){
        this.player1_decision=decision;
    }
    set player2_decision(decision){
        this.player2_decision=decision;
    }
    get channel(){
        return this.channel;
    }
    set channel(channel){
        this.channel=channel
    }
}
module.exports.Rpsgame=Rpsgame;
