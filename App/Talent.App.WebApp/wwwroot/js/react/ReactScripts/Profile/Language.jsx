/* Language section */
import React from 'react';
import Cookies from 'js-cookie';
import { Button, Icon, Dropdown } from 'semantic-ui-react';
import ReactTable from 'react-table';
import { profileUrl } from '../Config';

class ActionArea extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const editModes = {
            view: props => (
                <div>
                    <Button basic
                        className="borderless right floated"
                        type="button" onClick={() => props.onDelete()}>
                        <Icon className="ui right floated" name="delete"></Icon>
                    </Button>
                    <Button basic
                        className="borderless right floated"
                        type="button" onClick={() => props.onEdit()}>
                        <Icon name="pencil alternate"></Icon>
                    </Button>
                </div>),
            edit: props => (
                <div>
                    <Button basic className="mini"
                        color="blue" type="button"
                        onClick={() => props.onSave()}>Update</Button>
                    <Button basic className="mini"
                        color="red" type="button"
                        onClick={() => props.onCancel()}>Cancel</Button>
                </div>)
        }
        const { mode,
            actions: { onEdit, onCancel, onSave, onDelete } } = this.props.columnProps.rest;
        const EditArea = editModes[mode];
        return <EditArea
            onEdit={onEdit}
            onCancel={onCancel}
            onSave={onSave}
            onDelete={onDelete} />
    }
}

export default class Language extends React.Component {
    constructor(props) {
        super(props);

        let langs = this.props.languageData
            ? this.props.languageData
            : [];
        this.state = {
            showAddSection: false,
            editingRow: null,
            editingName: "",
            editingLevel: "",
            languages: langs,
            name: "",
            level: "",
        }

        this.handleChange = this.handleChange.bind(this);
        this.openAddView = this.openAddView.bind(this);
        this.closeAddView = this.closeAddView.bind(this);
        this.handleAddLanguage = this.handleAddLanguage.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.getActionProps = this.getActionProps.bind(this);
        this.renderEditName = this.renderEditName.bind(this);
        this.renderEditLevel = this.renderEditLevel.bind(this);
        this.updateLanguage = this.updateLanguage.bind(this);
    }

    componentDidMount() {

    }

    openAddView(event) {
        this.setState({ showAddSection: true });
    }

    closeAddView() {
        this.setState({ showAddSection: false });
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    updateLanguage() {
        let link = profileUrl + "/profile/updateLanguage";
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: 'POST',
            data: JSON.stringify(this.state.languages),
            success: function (res) {
                console.log(res)
                if (res.success == true) {
                    TalentUtil.notification.show("Profile updated sucessfully", "success", null, null)
                    let data = {};
                    data[this.props.componentId] = res.languages.result;
                    this.props.updateProfileData(data);
                    this.setState({ languages: res.languages });
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

    getActionProps(state, rowInfo) {
        return (rowInfo && {
            mode: rowInfo.index === this.state.editingRow ? "edit" : "view",
            actions: {
                onEdit: () => this.setState({
                    languages: this.props.languageData,
                    editingRow: rowInfo.index,
                    editingName: rowInfo.original.name,
                    editingLevel: rowInfo.original.level
                }),
                onCancel: () => this.setState({ editingRow: null }),
                onSave: () => {
                    const newLangs = this.state.languages;
                    newLangs[rowInfo.index].name = this.state.editingName;
                    newLangs[rowInfo.index].level = this.state.editingLevel;
                    this.setState({
                        languages: newLangs,
                        editingRow: null
                    }, this.updateLanguage);
                    //this.props.saveProfileData(this.props.componentId, langs);
                },
                onDelete: () => {
                    const langs = this.props.languageData;
                    var newLangs = langs.splice(rowInfo.index, 1);
                    this.setState({ languages: langs }, this.updateLanguage);
                    //this.props.saveProfileData(this.props.componentId, langs);
                }
            }
        }) || {};
    }

    handleSelectChange(value) {
        this.setState({
            level: value
        });
    }

    handleAddLanguage() {
        let languagesList = this.props.languageData
            ? this.props.languageData
            : [];
        let newLang = { name: this.state.name, level: this.state.level };
        languagesList.push(newLang);
        this.setState({ languages: languagesList }, this.updateLanguage);
        //this.props.saveProfileData(this.props.componentId, languagesList);
        this.setState({
            name: "",
            level: ""
        })
    }

    renderAddView() {
        const levels = ["Basic", "Conversational", "Fluent", "Native/Bilingual"];
        const levelOptions = levels.map(
            (x) => ({ key: x, value: x, text: x }));
        return (
            <div className="row">
                <div className="ui four wide column">
                    <input
                        name="name"
                        value={this.state.name}
                        placeholder="Add Language"
                        onChange={this.handleChange}></input>
                </div>
                <div className="ui six wide column">

                    <Dropdown selection className="language-dropdown"
                        name="level"
                        value={this.state.level}
                        placeholder={"Language Level"}
                        options={levelOptions}
                        onChange={(e, { value }) => this.handleSelectChange(value)}>
                    </Dropdown>
                </div>
                <div className="ui six wide column action-group">
                    <Button type="button" className="teal" onClick={this.handleAddLanguage}>Add</Button>
                    <Button type="button" onClick={this.closeAddView}>Cancel</Button>
                </div>
            </div>);
    }

    renderEditName(cellInfo) {
        if (cellInfo.index !== undefined
            && this.state.editingRow === cellInfo.index) {
            return (
                <div className="four wide column">
                    <input
                        name="editingName"
                        value={this.state.editingName}
                        onChange={this.handleChange}></input>
                </div>);
        }
        else {
            return <div className="four wide column">{cellInfo.value}</div>
        }
    }

    handleEditLevelChange(value) {
        this.setState({
            editingLevel: value
        })
    }

    renderEditLevel(cellInfo) {
        if (cellInfo.index !== undefined
            && this.state.editingRow === cellInfo.index) {
            const levels = ["Basic", "Conversational", "Fluent", "Native/Bilingual"];
            const levelOptions = levels.map(
                (x) => ({ key: x, value: x, text: x }))
            return (
                <div className="five wide column">
                    <Dropdown selection className="language-dropdown"
                        name="editingLevel"
                        value={this.state.editingLevel}
                        options={levelOptions}
                        onChange={(e, { value }) => this.handleEditLevelChange(value)}>
                    </Dropdown></div>);
        }
        else {
            return <div className="five wide column">{cellInfo.value}</div>
        }
    }

    render() {
        let data = this.props.languageData
            ? this.props.languageData
            : [];
        let addView = this.state.showAddSection
            ? this.renderAddView()
            : "";

        return (
            <div className="ui sixteen wide column">
                <div className="ui grid">
                    {addView}
                    <div className="ui row">
                        <div className="ui sixteen wide column">
                            <ReactTable
                                data={data}
                                minRows={0}
                                NoDataComponent={() => null}
                                showPagination={false}
                                className="-striped -highlight"
                                columns={[
                                    {
                                        Header: "Language",
                                        accessor: "name",
                                        Cell: this.renderEditName
                                    },
                                    {
                                        Header: 'Level',
                                        accessor: 'level',
                                        Cell: this.renderEditLevel
                                    },
                                    {
                                        sortable: false,
                                        Header: () =>
                                            <div className="seven wide column">
                                                <Button type="button" className="ui teal"
                                                    onClick={this.openAddView}>+Add New</Button>
                                            </div>,
                                        getProps: this.getActionProps,
                                        Cell: ActionArea
                                    },
                                ]} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}