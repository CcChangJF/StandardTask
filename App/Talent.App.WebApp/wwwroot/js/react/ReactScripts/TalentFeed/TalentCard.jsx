import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types'
import { Popup, Icon, Card, Embed, Label, Image, Segment } from 'semantic-ui-react'
import TalentCartDetail from './TalentCardDetail.jsx';

export default class TalentCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.getCardsView = this.getCardsView.bind(this);
    }

    getCardsView() {
        let talents = this.props.talents;
        //talents = talents.slice(0, 5);
        let talentCards = [];
        if ("" != talents) {
            talentCards = talents.map(
                x => <TalentCartDetail talent={x} />);
        }
        return talentCards;
    }

    render() {
        let talentCards = this.getCardsView();
        return (
            <div className="ui container talent-cards">
                {talentCards}
            </div>
            );
    }
}