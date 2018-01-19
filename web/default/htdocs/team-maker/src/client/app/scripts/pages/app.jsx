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

    componentDidMount() {
        const _this = this;

        this.state.socket.emit('get_data', 'players');

        this.state.socket.on('send_data', function (data) {
            _this.setState({
                playerList: data
            });

            // console.log('send_data', data);
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
                            listOfPlayers={this.listOfPlayers.bind(this)}/>

                <AddPlayer playerType={this.state.playerTypes}
                           players={this.state.playerList}
                           socket={this.state.socket}
                           updatePlayers={this.updatePlayers.bind(this)}/>

                <CreateTeam players={this.state.playerList}
                            teams={this.state.teams}
                            playersOrdered={this.state.playersOrdered}
                            updateNewTeam={this.updateNewTeam.bind(this)}/>

                {teams}

                <Footer />
            </div>
        );
    }
};

export default App;
