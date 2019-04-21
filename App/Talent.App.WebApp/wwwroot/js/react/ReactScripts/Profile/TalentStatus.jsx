import React from 'react'
import { Form, Checkbox } from 'semantic-ui-react';
import { SingleInput } from '../Form/SingleInput.jsx';

export default class TalentStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: null
        };
        this.handleChange = this.handleChange.bind(this);

    }

    componentDidUpdate() {
        if (null == this.state.status) {
            let curStatus = this.props.status
                ? this.props.status.status : "";
            let status = "0";
            if ("" != curStatus) {
                const allStatus = [
                    "Actively look for a job",
                    "Not looking for a job at the moment",
                    "Currently employed but open to offers",
                    "Will be available on later date"];
                for (let i = 0; i < allStatus.length; ++i) {
                    if (allStatus[i] === curStatus) {
                        status = i.toString();
                        break;
                    }
                }
            }
            this.setState({
                status: status
            })
        }
    }

    handleChange(event) {
        let index = event.target.value;
        this.setState({
            status: index
        });
        const allStatus = [
            "Actively look for a job",
            "Not looking for a job at the moment",
            "Currently employed but open to offers",
            "Will be available on later date"]; 
        let data = { status: allStatus[index] };
        this.props.saveProfileData(this.props.componentId, data);
    }

    render() {

        return (
            <div className="ui grid talent-status">
                <div className="row">
                    <div className="column">
                        <label>Current Status</label>
                    </div>
                </div>
                <div className="row">
                    <div className="column">
                        <div className="ui ratio checkbox">
                            <input name="jobSeekingStatus"
                                tabIndex="0"
                                type="radio"
                                value="0"
                                onChange={this.handleChange}
                                checked={"0" === this.state.status ? true : false}>
                            </input>
                            <label>Actively look for a job</label>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="column">
                        <div className="ui ratio checkbox">
                            <input name="jobSeekingStatus"
                                tabIndex="0"
                                type="radio"
                                value="1"
                                onChange={this.handleChange}
                                checked={"1" === this.state.status ? true : false}>
                            </input>
                            <label>Not looking for a job at the moment</label>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="column">
                        <div className="ui ratio checkbox">
                            <input name="jobSeekingStatus"
                                tabIndex="0"
                                type="radio"
                                value="2"
                                onChange={this.handleChange}
                                checked={"2" === this.state.status}>
                            </input>
                            <label>Currently employed but open to offers</label>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="column">
                        <div className="ui ratio checkbox">
                            <input name="jobSeekingStatus"
                                tabIndex="0"
                                type="radio"
                                value="3"
                                onChange={this.handleChange}
                                checked={"3" === this.state.status}>
                            </input>
                            <label>Will be available on later date</label>
                        </div>
                    </div>
                </div>
                <div className="row">{" "}</div>
            </div>
        );
    }
}