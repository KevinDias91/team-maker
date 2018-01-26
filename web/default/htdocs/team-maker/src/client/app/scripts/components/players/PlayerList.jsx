import React from 'react';
import _ from 'lodash';

class PlayerList extends React.Component {
    render(){
        const players = this.props.players;

        return (
            <div>
                <ul className={'player--list'}>
                    {
                        //We call the playerListing function
                        this.props.listOfSelectablePlayers(players)
                    }
                </ul>

                <button onClick={this.props.resetList}>
                    reset
                </button>
            </div>
        )
    }
}

export default PlayerList;
