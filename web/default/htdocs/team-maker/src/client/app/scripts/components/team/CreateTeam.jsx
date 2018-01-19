import React from 'react';
import _ from 'lodash';

class CreateTeam extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newPlayerList2: []
        }
    }

    //Ajouter les joueurs aux différentes équipes.
    addPlayerToTeams(typeArray, teams, replacements){
        let index = 0;

        typeArray.map((item, key) => {
            if (!_.isUndefined(teams[index])) teams[index].players.push(item);

            //Si l'index est égal au nombre d'équipe, on réinitialise à zéro l'index pour revenir à la première équipe.
            //Sinon, on incrémente l'index.
            if(index === teams.length-1) index = 0;
            else index++;
        });

        let index2 = 0;
        replacements.map((rep) => {
            teams[index2].replacement.push(rep);

            if(index2 === teams.length-1) index2 = 0;
            else index2++;
        });

        console.log(teams);

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
            Priorités pour faire les teams
            1. Les Rebondeurs REB
            2. Les Défenseurs DEF
            3. Les Passeur PAS
            4. Les Scoreurs SCO
            5. Les Dribbleurs DRI

            Un array avec autant d'objets que de teams.
            On remplit les objets des REB, DEF, PAS dans l'ordre. Puis on remplit avec le reste.
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

        //On sépare les joueurs selon leurs caractéristiques

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
        * Distribution des joueurs
        *
        * */

        //Pour la distribution, on rassemble les joueurs classés dans un seul tableau.
        //On pourra ensuite les distribuer à l'aide d'une simple boucle.

        let finalArray = rebArrayFinal.concat(defArrayFinal, pasArrayFinal, scoArrayFinal, driArrayFinal);

        //On créer un tableau pour stocker les remplaçants pour chaque équipe.
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

            //Possibilité de faire des équipe de 2, 3, 4, 5 joueurs.

            //Pour compter le nombre d'équipe possible, on divise le nombre total de joueur par chacunes des possibilités en terme de nombre de joueur par équipe.
            [2, 3, 4, 5].map((item, key) => {
                const numberOfTeam = parseInt(playerNumber/item);


                let isReplacement = null;
                let replacementNumber = 0;

                //Impossible de créer des équipes d'un seul joueur.
                if (numberOfTeam > 1){

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
