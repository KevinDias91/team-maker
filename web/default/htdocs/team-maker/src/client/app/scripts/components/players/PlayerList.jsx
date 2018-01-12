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
                    players.map((player, key) => {
                        const rowLen = player.type.length;

                        return (
                            <li key={key} id={key}>
                                {player.name} (
                                    {
                                        player.type.map((type, i) => {
                                            let coma = rowLen === i + 1 ? '' : ', ';

                                            return type + coma
                                        })
                                    }
                                )

                                <button className={'deletePlayer hidden'} onClick={(evt) => this.deletePlayer(evt)}>del</button>
                            </li>
                        )
                    })
                }
            </ul>
        )
    }
}

export default PlayerList;
