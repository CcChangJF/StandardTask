import React from 'react';
import ReactDOM from 'react-dom';
import ReactPlayer from 'react-player';
import { Popup, Icon, Card, Embed, Label, Image, Segment } from 'semantic-ui-react'


export default class TalentCardDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showProfile: false
        }

        this.talentProfileView = this.talentProfileView.bind(this);
        this.handleViewChange = this.handleViewChange.bind(this);
        this.GoToWebsite = this.GoToWebsite.bind(this);
        this.getProfileValueLabel = this.getProfileValueLabel.bind(this);
    };

    getProfileValueLabel(value, defaultValue) {
        if (value) {
            return <div>{value}</div>;
        }
        else {
            return <div className="default-value">{defaultValue}</div>
        }
    }

    talentProfileView() {
        const talentDetail = this.props.talent;
        let currentEmployer = "";
        let position = "";
        if (talentDetail && "" != talentDetail.workExperience) {
            currentEmployer = talentDetail.workExperience[0].company;
            position = talentDetail.workExperience[0].position;
        }
        let visaStatus = "";
        if (talentDetail && talentDetail.visaStatus) {
            visaStatus = talentDetail.visaStatus;
        }
        let imageUrl = "http://semantic-ui.com/images/avatar/large/elliot.jpg";
        if (talentDetail && talentDetail.photoId) {
            imageUrl = talentDetail.photoId;
        }

        return (
            <div className="ui two column grid fluid">
                <div className="row">
                    <div className="column">
                        <Image src={imageUrl}></Image>
                    </div>
                    <div className="column">
                        <div className="talent-profile-item">
                            <div className="thick">
                                Talent snapshot
                            </div>
                        </div>
                        <div className="talent-profile-item">
                            <div className="thick">
                                Current Employer
                            </div>
                            {this.getProfileValueLabel(currentEmployer, "No Recent Job")}
                        </div>
                        <div className="talent-profile-item">
                            <div className="thick">
                                Visa Status
                            </div>
                            {this.getProfileValueLabel(visaStatus, "No Visa Info")}
                        </div>
                        <div className="talent-profile-item">
                            <div className="thick">
                                Position
                                </div>
                            {this.getProfileValueLabel(position, "No Recent Job")}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    handleViewChange() {
        let status = this.state.showProfile;
        this.setState({
            showProfile: !status
        });
    }

    GoToWebsite(name) {
        if (!this.props.linkedAccounts) {
            alert("Sorry, there is no " + [name] + " account.");
        }
        else {
            let url = this.props.linkedAccounts[name];
            if (!url.startWith("http")) {
                url = "https://" + url;
            }
            window.open(url);
        }
    }

    render() {
        let talentDetail = this.props.talent;
        let talentName = talentDetail.name ? talentDetail.name : "Default name";
        let skillLabels = [];
        if (talentDetail && talentDetail.skills) {
            skillLabels = talentDetail.skills.map(
                (x) => <Label basic color="blue" key={x.id}>{x.name}</Label>);
        }
        let uniqueKey = talentDetail ? talentDetail.id : "";

        return (
            <Card fluid key={uniqueKey}>
                <Card.Content>
                    <div className="inline">
                        {talentName}
                        <div className="inline right floated">
                            <Icon name="star" size="large" />
                        </div>
                    </div>
                </Card.Content>
                <Card.Content>
                    <div className="ui container">
                        {
                            this.state.showProfile ? this.talentProfileView()
                                : <div className="ui grid ">
                                    <div className="row">
                                        <div className="column">
                                            <Embed url="http://localhost:60290/videos/demo.mp4" />
                                        </div>
                                    </div>
                                </div>
                        }
                        <div className="ui four column grid talent-info-bar">
                            <div className="row">
                                <div className="column">
                                    {
                                        this.state.showProfile
                                            ? <Icon name="video" size="large" color="grey"
                                                onClick={this.handleViewChange} />
                                            : <Icon name="user" size="large" color="grey"
                                                onClick={this.handleViewChange} />
                                    }

                                </div>
                                <div className="column">
                                    <Icon name="file pdf outline" size="large" color="grey"
                                        onClick={() => alert("Should open cv.")} />
                                </div>
                                <div className="column">
                                    <Icon name="linkedin" size="large" color="grey"
                                        onClick={() => this.GoToWebsite("linkedIn")} />
                                </div>
                                <div className="column">
                                    <Icon name="github" size="large" color="grey"
                                        onClick={() => this.GoToWebsite("github")} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card.Content>
                <Card.Content extra>
                    <div>{skillLabels}</div>
                </Card.Content>
            </Card>
        );
    }
}
