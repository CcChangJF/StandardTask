/* Skill section */
import React from 'react';
import Cookies from 'js-cookie';
import { Button, Icon, Dropdown } from 'semantic-ui-react';
import ReactTable from 'react-table';
import { SimpleTableActionArea } from './TableActionArea.jsx';


export default class Skill extends React.Component {
    constructor(props) {
        super(props);

        let skls = this.props.skillData
            ? this.props.skillData
            : [];
        //alert("const: " + JSON.stringify(props));
        this.state = {
            showAddSection: false,
            editingRow: null,
            editingName: "",
            editingLevel: "",
            skills: skls,
            name: "",
            level: "",
        }

        this.handleChange = this.handleChange.bind(this);
        this.openAddView = this.openAddView.bind(this);
        this.closeAddView = this.closeAddView.bind(this);
        this.handleAddSkill = this.handleAddSkill.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.getActionProps = this.getActionProps.bind(this);
        this.renderEditName = this.renderEditName.bind(this);
        this.renderEditLevel = this.renderEditLevel.bind(this);
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

    getActionProps(state, rowInfo) {
        return (rowInfo && {
            mode: rowInfo.index === this.state.editingRow ? "edit" : "view",
            actions: {
                onEdit: () => this.setState({
                    skills: this.props.skillData,
                    editingRow: rowInfo.index,
                    editingName: rowInfo.original.name,
                    editingLevel: rowInfo.original.level
                }),
                onCancel: () => this.setState({ editingRow: null }),
                onSave: () => {
                    const newSkill = this.state.skills;
                    newSkill[rowInfo.index].name = this.state.editingName;
                    newSkill[rowInfo.index].level = this.state.editingLevel;
                    this.setState({
                        skills: newSkill,
                        editingRow: null
                    });
                    this.props.saveProfileData(this.props.componentId, newSkill);
                },
                onDelete: () => {
                    const skls = this.props.skillData;
                    var newSkills = skls.splice(rowInfo.index, 1);
                    this.setState({ skills: skls });
                    this.props.saveProfileData(this.props.componentId, skls);
                }
            }
        }) || {};
    }

    handleSelectChange(value) {
        this.setState({
            level: value
        });
    }

    handleAddSkill() {
        let skillsList = this.props.skillData
            ? this.props.skillData
            : [];
        let newSkill = { name: this.state.name, level: this.state.level };
        skillsList.push(newSkill);
        this.setState({ skills: skillsList });
        this.props.saveProfileData(this.props.componentId, skillsList);
        this.setState({
            name: "",
            level: ""
        })
    }

    renderAddView() {
        const levels = ["Beginner", "Intermediate", "Expert"];
        const levelOptions = levels.map(
            (x) => ({ key: x, value: x, text: x }));
        return (
            <div className="row">
                <div className="ui four wide column">
                    <input
                        name="name"
                        value={this.state.name}
                        placeholder="Add Skill"
                        onChange={this.handleChange}></input>
                </div>
                <div className="ui six wide column">

                    <Dropdown selection className="skill-dropdown"
                        name="level"
                        value={this.state.level}
                        placeholder={"Skill Level"}
                        options={levelOptions}
                        onChange={(e, { value }) => this.handleSelectChange(value)}>
                    </Dropdown>
                </div>
                <div className="ui six wide column action-group">
                    <Button type="button" className="teal" onClick={this.handleAddSkill}>Add</Button>
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
            const levels = ["Beginner", "Intermediate", "Expert"];
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
        let data = this.props.skillData
            ? this.props.skillData
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
                                className="-striped highlight"
                                columns={[
                                    {
                                        Header: "Skill",
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
                                        Cell: SimpleTableActionArea
                                    },
                                ]} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}