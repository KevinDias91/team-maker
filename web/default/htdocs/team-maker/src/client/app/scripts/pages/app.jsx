import React from 'react';

import Header from '../components/header.jsx'
import Footer from '../components/footer.jsx'
import AddPlayer from '../components/players/AddPlayer.jsx';
import PlayerList from '../components/players/PlayerList.jsx';
import CreateTeam from '../components/team/CreateTeam.jsx';

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
            socket: openSocket('http://localhost:3000')
        }
    }

    updatePlayers(newPlayerList) {
        this.state.socket.emit('save_data', newPlayerList, 'players');

        this.setState({
            playerList: newPlayerList
        })
    }

    componentDidMount() {
        const _this = this;

        this.state.socket.emit('get_data', 'players');

        this.state.socket.on('send_data', function (data) {
            _this.setState({
                playerList: data
            });

            console.log('send_data', data);
        })
    }

    render () {
        return (
            <div>
                <Header />
                <PlayerList players={this.state.playerList}  updatePlayers={this.updatePlayers.bind(this)}/>
                <AddPlayer playerType={this.state.playerTypes} players={this.state.playerList} socket={this.state.socket} updatePlayers={this.updatePlayers.bind(this)}/>

                <CreateTeam />
                <Footer />
            </div>
        );
    }
};

export default App;
