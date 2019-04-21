import React from 'react'
import { SingleInput } from '../Form/SingleInput.jsx';
import { Dropdown, Button } from 'semantic-ui-react';
import Datepicker from 'react-datepicker';
import moment from 'moment';

export default class VisaStatus extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isInitialed: null,
            visaStatus: props.visaStatus ? props.visaStatus : "",
            visaExpiryDate: props.visaExpiryDate
                ? moment(props.visaExpiryDate) : moment(),
        }

        this.handleVisaChange = this.handleVisaChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.saveProfileData = this.saveProfileData.bind(this);
    }

    handleDateChange(date) {
        this.setState({ visaExpiryDate: date });
    }

    handleVisaChange(event, data) {
        let newDate = this.state.visaExpiryDate;
        if ("Citizen" === data.value ||
            "Permanent Resident" === data.value) {
            newDate = null;
        }
        this.setState({
            visaStatus: data.value,
            visaExpiryDate: newDate,
        });
    }

    saveProfileData() {
        let newData = Object.assign({}, this.state);
        delete newData.isInitialed;
        this.props.saveProfileData(newData);
    }

    componentDidUpdate() {
        if (null == this.state.isInitialed) {
            this.setState({
                isInitialed: true,
                visaStatus: this.props.visaStatus,
                visaExpiryDate: this.props.visaExpiryDate
                    ? moment(this.props.showExpireDate) : moment()
            });
        }
    }

    render() {
        let visaList = ["Citizen", "Permanent Resident",
            "Work Visa", "Student Visa"];
        let visaOptions = visaList.map((x) =>
            ({ key: x, value: x, text: x }));
        let visa = this.state.visaStatus;
        let showExpireDate = ("Work Visa" === visa
            || "Student Visa" === visa) ? true : false;
        let expiryDate = this.props.visaExpiryDate
            ? moment(this.props.visaExpiryDate) : moment();

        return (
            <div className="ui sixteen wide column">
                <div className="ui grid">
                    <div className="row">
                        <div className="six wide column">
                            <div className="field">
                                <label>Visa type</label>
                                <Dropdown selection
                                    name="visaStatus"
                                    placeholder="Visa Type"
                                    value={this.state.visaStatus}
                                    options={visaOptions}
                                    onChange={this.handleVisaChange} />
                            </div>
                        </div>
                        <div className="six wide column">
                            {showExpireDate
                                ?
                                <div className="field">
                                    <label>Visa expiry date</label>
                                    <Datepicker
                                        selected={this.state.visaExpiryDate}
                                        onChange={this.handleDateChange} />
                                </div>
                                : ""
                            }

                        </div>
                        <div className="four wide column visa-button-div">
                            <Button type="button"
                                className="teal visa-button"
                                onClick={this.saveProfileData}>Save</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}