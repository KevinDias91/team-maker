import React from 'react';

class Teams extends React.Component {
    showTeams(teams){
        return (
            teams.map((item, key) => {
                return (
                    <ul key={key}>
                        <li>{item.team}</li>
                        { this.props.listOfPlayers(item.players) }
                    </ul>
                )
            })

        )
    }

    render(){
        const teams = this.props.teams;

        return (
            <div>
                <h2>equipes</h2>
                { this.showTeams(teams) }
            </div>
        )
    }
}

export default Teams;
