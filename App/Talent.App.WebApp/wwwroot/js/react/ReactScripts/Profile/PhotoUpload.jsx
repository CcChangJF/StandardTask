/* Photo upload section */
import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { Icon, Button, Image } from 'semantic-ui-react';
import { profileUrl } from '../Config.js';

export default class PhotoUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            isChange: false,
            filePath: "",
        }

        this.handleChange = this.handleChange.bind(this);
        this.uploadPhoto = this.uploadPhoto.bind(this);
    };

    handleChange(event) {
        let file = event.target.files[0];
        const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/jpeg'];
        if (!validImageTypes.includes(file.type)) {
            alert("Please choose a image file.");
        }
        else {
            this.setState({
                file: file,
                filePath: URL.createObjectURL(file),
                isChange: true
            });
        }
    }

    uploadPhoto(event) {
        event.preventDefault();
        var cookies = Cookies.get('talentAuthToken');
        var formData = new FormData();
        formData.append('file', this.state.file);
        let link = this.props.savePhotoUrl;
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'bearer ' + cookies,
            },
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                console.log(res)
                if (res.success == true) {
                    this.setState({
                        file: null,
                        filePath: res.filePath,
                        isChange: false
                    });
                    let newData = {};
                    newData[this.props.componentId] = res.filePath;
                    this.props.updateProfileData(newData);
                    TalentUtil.notification.show("Profile updated sucessfully", "success", null, null)
                } else {
                    TalentUtil.notification.show("Profile did not update successfully", "error", null, null)
                }
            }.bind(this),
            error: function (res, a, b) {
                console.log(res)
                console.log(a)
                console.log(b)
            }
        })
    }

    render() {
        let imageUrl = this.state.file ? this.state.filePath
            : ("" === this.props.imageId || null === this.props.imageId
                ? "" : this.props.imageId);

        return (
            <div className="ui sixteen wide column">
                <div className="ui grid">
                    <div className="row">
                        <div className="column">
                            <div className="photo-upload">
                                <label htmlFor="photo-input">
                                    {"" === imageUrl
                                        ? <Icon name="camera retro"
                                            circular bordered
                                            size="huge"></Icon>
                                        : <Image src={imageUrl}
                                            className="photo-talent"
                                            circular bordered
                                            size="huge"></Image>}
                                </label>
                                <input id="photo-input"
                                    type="file"
                                    name="placeholder"
                                    onChange={this.handleChange} />


                            </div>
                        </div>
                    </div>
                    {this.state.isChange
                        ? <div className="row">
                            <div className="column ">
                                <Button type="button" color="black"
                                    onClick={this.uploadPhoto}>
                                    <Icon name="upload"></Icon>
                                    Upload</Button>
                            </div>
                        </div>
                        : ""}
                </div>
            </div>
        );
    }


}
