import React from 'react';
import Cookies from 'js-cookie';
import { Loader, Card, Image, Icon, Button } from 'semantic-ui-react';

export default class CompanyProfile extends React.Component {
    constructor(props) {
        super(props);
        const details = props.companyContact
            ? Object.assign({}, props.companyContact)
            : {
                name: "",
                email: "",
                phone: "",
                location: {
                    country: "",
                    city: ""
                }
            }
        details.skills = props.skills;
        this.state = {
            companyContact: details
        }
    }

    render() {
        let details = this.props.companyContact;
        let imageUrl = "http://semantic-ui.com/images/wireframe/image.png";
        if (details && details.profilePhotoUrl) {
            iamgeUrl = details.profilePhotoUrl;
        } 

        let name = details ? details.name : "Name"
        let phone = details ? details.phone : "No phone";
        let email = details ? details.email : "No email";

        let country = "Country";
        let city = "City";
        if (details) {
            country = details.location.country
                ? details.location.country : "Country";
            city = details.location.city
                ? details.location.city : "City"; 
        }
        let skills = "" != this.props.skills ?
            (<div>
                <p>Desired skill: <br /> </p>
                {this.props.skills.map(
                    (x) => <p>{x.skill}{": "}{x.experienceLevel}<br /></p>)}
            </div>)
            : "We currently do not have specific skills that we desire.";

        return (
            <React.Fragment>
                <Card className="employer-card">

                    <Card.Content textAlign="center">
                        <Image circular size="mini"
                            src={imageUrl}></Image>
                        <Card.Header>{name}</Card.Header>
                        <Card.Meta>
                            <Icon name="map pin"></Icon>
                            {city}{", "}{country}
                        </Card.Meta>
                        <Card.Description>{skills}</Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <div>
                            <Icon name="phone"></Icon>{":  "}{phone}
                        </div>
                        <div>
                            <Icon name="mail"></Icon>{":  "}{email}
                        </div>
                    </Card.Content>
                </Card>
            </React.Fragment>
        );
    }
}