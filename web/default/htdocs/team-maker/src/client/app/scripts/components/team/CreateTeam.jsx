import React from 'react';
import _ from 'lodash';

class CreateTeam extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newPlayerList2: []
        }
    }

    //Add players to the different Teams.
    addPlayerToTeams(typeArray, teams, replacements){
        let index = 0;

        typeArray.map((item, key) => {
            if (!_.isUndefined(teams[index])) teams[index].players.push(item);

            //If the index is equal than the number of teams, we reset the index to zero and come back to the first team of the list.
            //Otherwise we increment the index
            if(index === teams.length-1) index = 0;
            else index++;
        });

        //Same thing for the replacement list.
        let index2 = 0;
        replacements.map((rep) => {
            teams[index2].replacement.push(rep);

            if(index2 === teams.length-1) index2 = 0;
            else index2++;
        });

        //We Update the teams with de replacement.
        this.props.updateNewTeam(teams);
    }

    createCaracArray(typeArray, abbr){
        this.state.newPlayerList2.slice().map((item) => {
            if (_.indexOf(item.type, abbr) > -1){
                typeArray.push(item);
                this.state.newPlayerList2 = _.pull(this.state.newPlayerList2, item);
            }
        });
        return typeArray;
    }

    generateTeam(teamNb, playerNb, replacementNb){
        /*
            Features priorities to create the teams
            1. Rebounds REB
            2. Defense DEF
            3. Passing PAS
            4. Scoring SCO
            5. Dribblers DRI

            We already have created the teams. They take form of an Array with an Object for each team.
            We fill the objects with the REB, DEF, PAS in the right order. Then we fill with the rest.
         */

        // let newPlayerList = playerList.slice();

        let rebArray = [];
        let defArray = [];
        let pasArray = [];
        let scoArray = [];
        let driArray = [];

        let newTeam = [];

        for (let i = 0; i < teamNb; i++) {
            const newTeamPull = newTeam.push({
                team: i+1,
                playerNumber: parseInt(playerNb),
                players: [],
                replacement: []
            });
        }

        this.props.updateNewTeam(newTeam);

        //We split the player according to their features

        const rebArrayFinal = this.createCaracArray(rebArray, 'REB');
        const defArrayFinal = this.createCaracArray(defArray, 'DEF');
        const pasArrayFinal = this.createCaracArray(pasArray, 'PAS');
        const scoArrayFinal = this.createCaracArray(scoArray, 'SCO');
        const driArrayFinal = this.createCaracArray(driArray, 'DRI');

        /*console.log('rebArray', rebArrayFinal);
        console.log('defArray', defArrayFinal);
        console.log('pasArray', pasArrayFinal);
        console.log('scoArray', scoArrayFinal);
        console.log('driArray', driArrayFinal);

        console.log(this.state.newPlayerList2);*/

        /*
        *
        * Assignement of the players
        *
        * */

        //For the distribution, on assemble the sorted players in a single Array.
        //Then we'll be able to assign with a simple loop.

        let finalArray = rebArrayFinal.concat(defArrayFinal, pasArrayFinal, scoArrayFinal, driArrayFinal);

        //We create an Array to stock the replacements for each team.
        const replacementArray = finalArray.slice(Math.max(finalArray.length - replacementNb, 1));

        for (let h = 0; h < replacementArray.length; h++) {
            finalArray = _.pull(finalArray, replacementArray[h])
        }

        this.addPlayerToTeams(finalArray, newTeam, replacementArray);
    }

    createTeamSubmit(e){
        e.preventDefault();
        e.stopPropagation();

        const form = document.forms['createTeam'];

        const teamNb = document.querySelector('input[name="playersPerTeam"]:checked').value.split('_')[0];
        const playerNb = document.querySelector('input[name="playersPerTeam"]:checked').value.split('_')[1];
        const replacementNb = document.querySelector('input[name="playersPerTeam"]:checked').value.split('_')[2];

        // console.log(teamNb, 'équipes de', playerNb, 'joueurs', replacementNb, 'remplacements');

        this.generateTeam(teamNb, playerNb, replacementNb);
    }

    countTeamNumber(playerList, playerNumber){
        return (

            //Possibility of making teams of 2, 3, 4, 5 players.

            //To count the number of teams you can make, we divide the total amount of players by each element of the player number possibilities array.
            [2, 3, 4, 5].map((item, key) => {
                const numberOfTeam = parseInt(playerNumber/item);


                let isReplacement = null;
                let replacementNumber = 0;

                //Not possible to create one player teams.
                if (numberOfTeam > 1){

                    //We calculate the number of replacement.
                    const replacementNumber = playerNumber-(numberOfTeam*item);

                    if (replacementNumber > 0) isReplacement = <span>({replacementNumber} remplaçant(s))</span>;

                    return (
                        <label htmlFor={numberOfTeam + '_' + item} key={key}>
                            {numberOfTeam} équipes de {item} joueur(s) {isReplacement}
                            <input type="radio"
                                   id={numberOfTeam + '_' + item}
                                   value={numberOfTeam + '_' + item + '_' + replacementNumber}
                                   name={'playersPerTeam'}/>
                        </label>
                    )
                }
            })
        )
    }

    render(){

        const playerList = this.props.players;
        const playerNumber = playerList.length;


        this.state.newPlayerList2 = playerList.slice();

        return (
            <form id={'createTeam'} className={'create_team--form'}>
                <h2>Génère tes team !</h2>

                <fieldset>
                    <legend>Nombre d'équipes</legend>
                    {
                        this.countTeamNumber(playerList, playerNumber)
                    }
                </fieldset>

                <button type={'submit'} onClick={(evt) => this.createTeamSubmit(evt)}>OK</button>
            </form>
        )
    }
}

export default CreateTeam;
