import React from 'react';
import _ from 'lodash';

class PlayerList extends React.Component {
    deletePlayer(evt){
        const players = this.props.players;
        const idPlayer = evt.target.parentElement.id;
        const finalPlayerList = _.pull(players,  players[idPlayer]);

        this.props.updatePlayers(finalPlayerList);
    }

    render(){
        const players = this.props.players;

        return (
            <ul className={'player--list'}>
                {
                    this.props.listOfPlayers(players)
                }
            </ul>
        )
    }
}

export default PlayerList;
