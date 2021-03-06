import React from 'react';

import Header from '../components/header.jsx'
import Footer from '../components/footer.jsx'

import AddPlayer from '../components/players/AddPlayer.jsx';
import PlayerList from '../components/players/PlayerList.jsx';
import CreateTeam from '../components/team/CreateTeam.jsx';
import Teams from '../components/team/Teams.jsx';

import openSocket from 'socket.io-client';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            playerTypes: [
                {"SCO": "Scoreur"},
                {"PAS": "Passeur"},
                {"REB": "Rebondeur"},
                {"DRI": "Dribbleur"},
                {"DEF": "Défenseur"}
            ],
            playerList: [],
            selectedPlayerList: [],
            socket: openSocket('http://localhost:3000'),
            teams: [],
            playersOrdered: []

        }
    }

    updatePlayers(newPlayerList) {
        this.state.socket.emit('save_data', newPlayerList, 'players');

        this.setState({
            playerList: newPlayerList
        })
    }

    updateNewTeam(teams){
        this.setState({
            teams: teams
        });
    }

    selectPlayer(e){
        const playerId = e.target.id.split('player_')[1];
        const playerClicked = e.target;

        let selectedPlayerArray = this.state.selectedPlayerList;

        //If the player selected is not already selected, we add him in the selected players Array.
        //Otherwise we delete the player.
        if(_.includes(selectedPlayerArray, this.state.playerList[playerId])){
            selectedPlayerArray = _.pull(selectedPlayerArray, this.state.playerList[playerId]);
        } else {
            selectedPlayerArray.push(this.state.playerList[playerId]);
        }

        //update the state to update the view
        this.setState({
            selectedPlayerList: selectedPlayerArray
        });

        playerClicked.classList.toggle('active');

    }

    deletePlayer(evt){
        const players = this.state.playerList;
        const idPlayer = evt.target.parentElement.id.split('player_')[1];

        const finalPlayerList = _.pull(players,  players[idPlayer]);

        this.updatePlayers(finalPlayerList);
    }

    listOfPlayers(players){
        return (
            players.map((player, key) => {
                const rowLen = player.type.length;

                return (
                    <li key={key}>
                        {player.name} (
                            {
                                player.type.map((type, i) => {
                                    let coma = rowLen === i + 1 ? '' : ', ';

                                    return type + coma
                                })
                            }
                        )
                    </li>
                )
            })
        )
    }

    listOfSelectablePlayers(players){
        return (
            players.map((player, key) => {
                const rowLen = player.type.length;

                return (
                    <li key={key} onClick={(evt) => {this.selectPlayer(evt)}} id={'player_'+key} className={'player--list__select'}>
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
        )
    }

    resetList() {
        const activePlayerItem = document.querySelectorAll('.player--list__select.active');

        Object.keys(activePlayerItem).map((item) => {
            activePlayerItem[item].classList.remove('active');
        });

        this.setState({
            selectedPlayerList : []
        })
    }

    componentDidMount() {
        const _this = this;

        this.state.socket.emit('get_data', 'players');

        this.state.socket.on('send_data', function (data) {
            _this.setState({
                playerList: data
            });
        })
    }


    render () {

        const teams = this.state.teams.length > 0
            ? <Teams teams={this.state.teams}
                     listOfPlayers={this.listOfPlayers.bind(this)} />
            : null;

        return (
            <div>
                <Header />

                <PlayerList players={this.state.playerList}
                            updatePlayers={this.updatePlayers.bind(this)}
                            listOfSelectablePlayers={this.listOfSelectablePlayers.bind(this)}
                            resetList={this.resetList.bind(this)}/>

                <AddPlayer playerType={this.state.playerTypes}
                           players={this.state.playerList}
                           updatePlayers={this.updatePlayers.bind(this)}/>

                <CreateTeam players={this.state.selectedPlayerList}
                            teams={this.state.teams}
                            playersOrdered={this.state.playersOrdered}
                            updateNewTeam={this.updateNewTeam.bind(this)}/>

                {teams}

                <Footer />
            </div>
        );
    }
}

export default App;
