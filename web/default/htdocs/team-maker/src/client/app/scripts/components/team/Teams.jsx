import React from 'react';

class Teams extends React.Component {
    showTeams(teams, showReplacement){
        return (
            teams.map((item, key) => {

                return (
                    <ul key={key}>
                        <li>{item.team}</li>
                        { this.props.listOfPlayers(item.players) }
                        { item.replacement.length > 0 && showReplacement === 1 ? <li>replacements</li> : '' }
                        { showReplacement === 1 ? this.props.listOfPlayers(item.replacement) : null }
                    </ul>
                )
            })

        )
    }

    showReplacement(replacementArray){
        return (
            <div>
                <h2>Replacement</h2>
                {
                    this.props.listOfPlayers(replacementArray)
                }
            </div>
        )
    }

    render(){
        const teams = this.props.teams;

        //Returns 1 there is more than one replacement
        const moreThanOneReplacement = (teams[0].replacement.length > 0 && teams[1].replacement.length);

        return (
            <div>
                <h2>equipes</h2>
                { this.showTeams(teams, moreThanOneReplacement) }

                { moreThanOneReplacement === 0 ? this.showReplacement(teams[0].replacement) : '' }
            </div>
        )
    }
}

export default Teams;
