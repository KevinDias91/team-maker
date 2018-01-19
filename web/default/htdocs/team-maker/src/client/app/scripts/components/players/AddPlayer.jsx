import React from 'react';

class AddPlayer extends React.Component {

    validateForm(e){
        e.preventDefault();
        e.stopPropagation();

        const socket = this.props.socket;
        const playerList = this.props.players;

        const form = document.forms['addPlayer'];

        const playerName = form['playerName'].value;
        const playerTypeInputs = form['playerType'];
        let playerType = [];



        Object.keys(playerTypeInputs).map((item) => {
            if (playerTypeInputs[item].checked) {
                const total = playerType.push(playerTypeInputs[item].value);
            }
        });


        if (playerName !== '' && playerType.length > 0) {

            if (playerType.length <= 3) {
                const newPlayerObj = {
                    'name': playerName,
                    'type': playerType
                };

                const finalPlayerList = playerList.push(newPlayerObj);

                this.props.updatePlayers(playerList);
            } else {
                alert('Nombre de type limité à 3');
            }
        }
    }

    render(){

        const playerTypes = this.props.playerType;

        return (
            <form className={'form--add_player'} id={'addPlayer'}>


                <fieldset>

                    <legend>
                        Ajouter un joueur
                    </legend>

                    <input type="text" name='playerName' id={'playerName'} placeholder={'Nom du joueur'}/>
                </fieldset>

                <fieldset>
                    {
                        playerTypes.map((item, key) => {

                            const typeAbr = Object.keys(item)[0];
                            const typeName = item[Object.keys(item)[0]];

                            return (
                                <label key={key} htmlFor={typeAbr}>
                                    {typeName}
                                    <input type="checkbox" name={'playerType'} value={typeAbr} id={typeAbr}/>
                                </label>
                            )
                        })
                    }
                </fieldset>

                <button type={'submit'} onClick={(evt) => this.validateForm(evt)}>OK</button>

            </form>
        )
    }
};

export default AddPlayer;
