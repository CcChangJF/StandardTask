import React from 'react';
import { Card, Image, Feed, Button } from 'semantic-ui-react';


export default class FollowingSuggestion extends React.Component {
    constructor(props) {
        super(props);
       
    }

    render() {
        return (
            <Card className="follow-suggestion-card">
                <Card.Content>
                    <Card.Header textAlign="center">Follow Talent</Card.Header>
                </Card.Content>
                <Card.Content>
                    <div className="ui items following-suggestion">
                        <div className="item">
                            <div className="ui image">
                                <img className="ui circular image"
                                    src="http://semantic-ui.com/images/avatar/small/jenny.jpg" />
                            </div>
                            <div className="content">
                                <a className="">Veronika Ossi</a>
                                <button className="ui primary basic button">
                                    <i className="icon user"></i>
                                    Follow
                                    </button>
                            </div>
                        </div>
                        <div className="item">
                            <div className="ui image">
                                <img className="ui circular image" src="http://semantic-ui.com/images/avatar/small/jenny.jpg" />
                            </div>
                            <div className="content">
                                <a className="">Veronika Ossi</a>
                                <button className="ui primary basic button"><i className="icon user"></i>Follow</button>
                            </div>
                        </div>
                    </div>
                </Card.Content>
            </Card>
        );
    }
}