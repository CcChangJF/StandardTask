import React from 'react';
import Cookies from 'js-cookie';
import { Button } from 'semantic-ui-react';

export class Description extends React.Component {

    constructor(props) {
        super(props);
        let desp = props.description ? props.description : "";
        let sum = props.summary ? props.summary : "";
        this.state = {
            prevId: -1,
            description: desp,
            summary: sum,
            characters: 0
        };
        this.handleChange = this.handleChange.bind(this);
        this.saveUpdate = this.saveUpdate.bind(this);
    };

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        }, function () {
            this.setState({ characters: this.state.description.length });
        });
    }

    componentDidUpdate() {
        if (-1 == this.state.prevId) {
            this.setState({
                prevId: 1,
                description: this.props.description ? this.props.description : "",
                summary: this.props.summary ? this.props.summary : "",
                characters: this.props.description ? this.props.description.length : 0
            })
        }
    }

    saveUpdate() {
        let newData = {};
        newData["description"] = this.state.description;
        newData["summary"] = this.state.summary;
        this.props.saveProfile(newData);
    }

    render() {
        const characterLimit = 600;
        
        return (
            <React.Fragment>
                <div className="four wide column">
                    <h3>Description</h3>
                    <div className="tooltip">Write a description of your company.</div>
                </div>
                <div className="ui twelve wide column">
                    <div className="field" >
                        <input name="summary"
                            value={this.state.summary}
                            placeholder="Please provide a short summary about your company."
                            onChange={this.handleChange}></input>
                        <label>Summary must be no more than 150 characters.</label>
                        <textarea maxLength={characterLimit} name="description"
                            placeholder="Please tell us about any hobbies, additional expertise, or anything else you’d like to add."
                            value={this.state.description}
                            onChange={this.handleChange} ></textarea>
                        <p>Characters remaining : {this.state.characters} / {characterLimit}</p>
                        <Button type="button" className="teal right floated" onClick={this.saveUpdate}>Save</Button>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
