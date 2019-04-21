/* Social media JSX */
import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Popup, Button, Icon } from 'semantic-ui-react';

export default class SocialMediaLinkedAccount extends React.Component {
    constructor(props) {
        super(props);
        const details = props.linkedAccounts ?
            Object.assign({}, props.linkedAccounts)
            : {
                linkedIn: "",
                github: ""
            };
        this.state = {
            showEidtSection: false,
            newLinks: details
        };

        this.renderEdit = this.renderEdit.bind(this);
        this.renderDisplay = this.renderDisplay.bind(this);
        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.saveProfile = this.saveProfile.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);

    }

    componentDidMount() {
        $('.ui.button.social-media')
            .popup();
    }

    openEdit() {
        let details = Object.assign({}, this.props.linkedAccounts);
        this.setState({
            showEidtSection: true,
            newLinks: details
        });
    }

    closeEdit() {
        this.setState({
            showEidtSection: false
        })
    }

    saveProfile() {
        this.props.controlFunc(this.props.componentId, this.state.newLinks);
        this.closeEdit();
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.newLinks);
        data[event.target.name] = event.target.value;
        this.setState({
            newLinks: data
        });
        
    }

    handleClick(event) {
        let type = [event.target.name];
        let link = this.state.newLinks[type];
        alert("go to " + type + ": " + link);
    }

    render() {
        return (this.state.showEidtSection ? this.renderEdit() : this.renderDisplay());
    }

    renderEdit() {
        return (
            <div className="ui sixteen wide column">
                <ChildSingleInput
                    inputType="text"
                    label="LinkedIn"
                    name="linkedIn"
                    value={this.state.newLinks.linkedIn}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your LinkedIn Url"
                    errorMessage="Please enter a valid url" />

                <ChildSingleInput
                    inputType="text"
                    label="GitHub"
                    name="github"
                    value={this.state.newLinks.github}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your GitHub Url"
                    errorMessage="Please enter a valid url" />
                <Button className="teal" onClick={this.saveProfile}>Save</Button>
                <Button onClick={this.closeEdit}>Cancel</Button>
            </div>
            );
    }

    renderDisplay() {
        return (
            <div className="row">
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <Button color="linkedin" name="linkedIn"
                            className="left floated"
                            onClick={this.handleClick}>
                            <Icon name="linkedin"></Icon>LinkedIn
                        </Button>
                        <Button name="gitHub"
                            className="black left floated"
                            onClick={this.handleClick}>
                            <Icon name="github"></Icon>GitHub
                        </Button>
                    </React.Fragment>
                    <Button className="right floated teal" onClick={this.openEdit}>Edit</Button>
                </div>
            </div>
            );
    }
}