import React from 'react'
import Cookies from 'js-cookie'
import { default as Countries } from '../../../../util/jsonFiles/countries.json';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Button, Dropdown } from 'semantic-ui-react';

export class Address extends React.Component {
    constructor(props) {
        super(props)

        const details = props.addressData ?
            Object.assign({}, props.addressData)
            : {
                country: "",
                city: "",
                suburb: "",
                street: "",
                number: "",
                postCode: "",
            }
        details.postCode = details.postCode === 0 ? "" : details.postCode;
        this.state = {
            showEditSection: false,
            newAddr: details
        }

        this.handleChange = this.handleChange.bind(this);
        this.renderEdit = this.renderEdit.bind(this);
        this.renderDisplay = this.renderDisplay.bind(this);
        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.saveProfile = this.saveProfile.bind(this);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
    }

    openEdit() {
        let addrs = Object.assign({}, this.props.addressData);
        this.setState({
            showEditSection: true,
            newAddr: addrs
        })
    }

    closeEdit() {
        this.setState({ showEditSection: false });
    }

    render() {
        return (this.state.showEditSection
            ? this.renderEdit() : this.renderDisplay());
    }

    handleChange(event) {
        let data = Object.assign({}, this.state.newAddr);
        data[event.target.name] = event.target.value;
        if ("country" == [event.target.name]) {
            if (event.target.value != this.state.newAddr.country) {
                data["city"] = "";
                this.setState({
                    newAddr: data
                }, this.render);
            }
        }
        else {
            this.setState({
                newAddr: data
            });
        }
    }

    handleDropdownChange(name, value) {
        let data = Object.assign({}, this.state.newAddr);
        data[name] = value;
        if ("country" === name) {
            data["city"] = "";
            this.setState({
                newAddr: data
            });
        }
        else {
            this.setState({ newAddr: data });
        }
    }

    saveProfile() {
        this.props.controlFunc(this.props.componentId, this.state.newAddr);
        this.closeEdit();
    }

    renderEdit() {
        let selectedCountry = this.state.newAddr.country;
        let selectedCity = this.state.newAddr.city;
        let countryOptions = Object.keys(Countries).map(
            (x) => ({ key: x, value: x, text: x }));
        let cityOptions = [];
        if ("" != selectedCountry && null != selectedCountry) {
            cityOptions = Countries[selectedCountry].map(
                (x) => ({ key: x, value: x, text: x }));
        }
        return (
            <div className="ui grid">
                <div className="ui row">
                    <div className="ui three wide column">
                        <ChildSingleInput
                            inputType="text"
                            label="Number"
                            name="number"
                            maxLength={5}
                            value={this.state.newAddr.number}
                            placeholder="Number"
                            controlFunc={this.handleChange}
                            errorMessage="Enter a valid number" />
                    </div>
                    <div className="ui seven wide column">
                        <ChildSingleInput
                            inputType="text"
                            label="Street"
                            name="street"
                            value={this.state.newAddr.street}
                            maxLength={80}
                            placeholder="Street"
                            controlFunc={this.handleChange}
                            errorMessage="Enter a valid street" />
                    </div>
                    <div className="ui six wide column">
                        <ChildSingleInput
                            inputType="text"
                            label="Suburb"
                            name="suburb"
                            value={this.state.newAddr.suburb}
                            maxLength={20}
                            placeholder="Suburb"
                            controlFunc={this.handleChange}
                            errorMessage="Enter a valid suburb" />
                    </div>
                </div>
                <div className="ui row">
                    <div className="ui six wide column">
                        <div className="field">
                            <label>Country</label>
                            <Dropdown selection search
                                name="country"
                                value={selectedCountry}
                                placeholder="Country"
                                options={countryOptions}
                                onChange={(e, { value }) => this.handleDropdownChange("country", value)} />
                        </div>
                    </div>
                    <div className="ui six wide column">
                        <div className="field">
                            <label>City</label>
                            <Dropdown selection search
                                name="city"
                                value={selectedCity}
                                placeholder="City"
                                options={cityOptions}
                                onChange={(e, { value }) => this.handleDropdownChange("city", value)} />
                        </div>
                    </div>
                    <div className="ui four wide column">
                        <ChildSingleInput
                            inputType="text"
                            label="Post Code"
                            name="postCode"
                            value={this.state.newAddr.postCode}
                            placeholder="Post Code"
                            maxLength={8}
                            controlFunc={this.handleChange}
                            errorMessage="Enter a valid post code" />
                    </div>
                </div>
                <div className="ui row">
                    <div className="ui sixteen wide column">
                        <Button className="teal" onClick={this.saveProfile}>Save</Button>
                        <Button onClick={this.closeEdit}>Cancel</Button>
                    </div>
                </div>

            </div>
        );
    }

    renderDisplay() {
        let number = this.props.addressData.number
            ? this.props.addressData.number + "," : "";
        let street = this.props.addressData.street
            ? this.props.addressData.street + "," : "";
        let suburb = this.props.addressData.suburb
            ? this.props.addressData.suburb + "," : "";
        let postcode = this.props.addressData.postCode
            ? this.props.addressData.postCode : "";
        let city = this.props.addressData.city
            ? this.props.addressData.city : "";
        let country = this.props.addressData.country
            ? this.props.addressData.country : "";
        return (
            <div className="row">
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Address: {number + street + suburb + postcode}</p>
                        <p>City: {city} </p>
                        <p>Country: {country}</p>
                    </React.Fragment>
                    <Button className="teal right floated"
                        onClick={this.openEdit}>Edit</Button>
                </div>
            </div>
        );
    }
}

export class Nationality extends React.Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(value) {
        let data = {};
        data[this.props.componentId] = value;
        this.props.saveProfile(data);
    }

    render() {
        let nation = this.props.nationalityData
            ? this.props.nationalityData : "";
        let countriesOptions = Object.keys(Countries).map(
            (x) => ({key: x, value: x, text: x}));
        return (
            <div className="row">
                <div className="ui six wide column">
                    <Dropdown selection search
                        name="nationality"
                        value={nation}
                        placeholder="Nationality"
                        options={countriesOptions}
                        onChange={(e, { value }) => this.handleChange(value)} />

                </div>
            </div>
        );
    }
}