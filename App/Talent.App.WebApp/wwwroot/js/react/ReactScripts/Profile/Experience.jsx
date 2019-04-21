/* Experience section */
import React from 'react';
import Cookies from 'js-cookie';
import { Button, Icon } from 'semantic-ui-react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import Datepicker from 'react-datepicker';
import moment from 'moment';

class ExperienceForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.exp.id ? props.exp.id : "",
            company: props.exp.company ? props.exp.company : "",
            position: props.exp.position ? props.exp.position : "",
            start: props.exp.start ? moment(props.exp.start) : moment(),
            end: props.exp.end ? moment(props.exp.end) : moment(),
            responsibilities: props.exp.responsibilities ? props.exp.responsibilities : ""
        }
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUpdateData = this.handleUpdateData.bind(this);
    }

    handleDateChange(name, date) {
        this.setState({
            [name]: date
        });
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleUpdateData() {
        //alert(JSON.stringify(this.state));
        this.props.saveExperience(this.props.index, this.state);
        this.setState({
            id: "",
            company: "",
            position: "",
            start: moment(),
            end: moment(),
            responsibilities: ""
        });
    }

    render() {
        const buttons =
            <div className="action-buttons">
                {"add" === this.props.mode
                    ? <Button type="button" className="teal"
                        onClick={this.handleUpdateData}>Add</Button>
                    : <Button type="button" className="teal"
                        onClick={this.handleUpdateData}>Update</Button>}
                <Button type="button" onClick={() => this.props.onCancel()}>Cancel</Button>
            </div>

        return (
            <div className="ui sixteen wide column">
                <div className="ui grid experience-edit-grid">
                    <div className="row">
                        <div className="ui eight wide column">
                            <ChildSingleInput
                                inputType="text"
                                label="Company"
                                name="company"
                                value={this.state.company}
                                placeholder="Company"
                                maxLength={10}
                                controlFunc={this.handleChange}
                                errorMessage="Enter the company name" />
                        </div>
                        <div className="ui eight wide column">
                            <ChildSingleInput
                                inputType="text"
                                label="Position"
                                name="position"
                                value={this.state.position}
                                placeholder="Postion"
                                maxLength={10}
                                controlFunc={this.handleChange}
                                errorMessage="Enter the right position" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="ui eight wide column">
                            <div className="field datepicker-container">
                                <label>Start Date</label>
                                <Datepicker
                                    name="start"
                                    selected={this.state.start}
                                    onChange={this.handleDateChange.bind(this, "start")} />
                            </div>
                        </div>
                        <div className="ui eight wide column">
                            <div className="field datepicker-container">
                                <label>End Date</label>
                                <Datepicker
                                    name="end"
                                    selected={this.state.end}
                                    onChange={this.handleDateChange.bind(this, "end")} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="ui sixteen wide column">
                            <ChildSingleInput
                                inputType="text"
                                label="Responsibilities"
                                name="responsibilities"
                                value={this.state.responsibilities}
                                placeholder="Responsibilities"
                                maxLength={80}
                                controlFunc={this.handleChange}
                                errorMessage="Enter the right position" />
                            {buttons}
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default class Experience extends React.Component {
    constructor(props) {
        super(props);

        //const data = props.experienceData
        //    ? props.experienceData
        //    : [];

        this.state = {
            mode: "",
            editingRow: null,
            //expList: data
        }
        this.openView = this.openView.bind(this);
        this.getTableData = this.getTableData.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.updateAndSaveData = this.updateAndSaveData.bind(this);
        this.dealWithUpdate = this.dealWithUpdate.bind(this);
        this.openUpdateView = this.openUpdateView.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    };

    openView(curMode) {
        this.setState({
            mode: curMode
        });
    }

    openUpdateView(idx) {
        this.setState({
            mode: "update",
            editingRow: idx
        })
    }

    updateAndSaveData(index, data) {
        let newData = this.props.experienceData;
        if (null === index || "" === index) {
            newData.push(data);
        }
        else {
            let updateItem = Object.assign({}, data);
            newData[index] = updateItem;
        }
        this.setState({
            mode: "",
            editingRow: null,
        });
        this.props.saveProfileData(this.props.componentId, newData);
    }

    handleCancel() {
        this.setState({ mode: "" });
    }

    handleDelete(idx) {
        let exps = this.props.experienceData;
        const delExp = exps.splice(idx, 1);
        this.props.saveProfileData(this.props.componentId, exps);
    }

    componentDidUpdate() {
    }

    getTableData() {
        let expList = this.props.experienceData;
        let tableData = [];
        if ("" != expList && null != expList) {
            let idx = -1;
            tableData = expList.map(x =>
                (idx = idx + 1,
                    <tr key={x.id}>
                        <td className="two wide column">{x.company}</td>
                        <td className="two wide column">{x.position}</td>
                        <td className="three wide column">{x.responsibilities}</td>
                        <td className="three wide column">{moment(x.start).format('Do MMM, YYYY')}</td>
                        <td className="three wide column">{moment(x.end).format('Do MMM, YYYY')}</td>
                        <td className="three wide column">
                            <Button basic type="button"
                                className="borderless mini right floated"
                                icon="delete"
                                onClick={this.handleDelete.bind(this, idx)} />
                            <Button basic type="button"
                                className="borderless mini right floated"
                                icon="pencil alternate"
                                onClick={this.openUpdateView.bind(this, idx)} />
                        </td>
                    </tr>)
            );
        }
        return tableData;
    }

    dealWithUpdate(tableData) {
        let editRow = this.state.editingRow;
        if (null !== editRow && "" !== editRow
            && "" != tableData && "update" === this.state.mode) {
            let firstTableData = tableData.slice(0, editRow);
            let secondTableData = tableData.slice(editRow + 1, tableData.length);
            return (
                <React.Fragment>
                    <table className="ui striped table">
                        <tbody>
                            {firstTableData}
                        </tbody>
                    </table>
                    <ExperienceForm
                        mode={"update"}
                        exp={this.props.experienceData[editRow]}
                        index={editRow}
                        saveExperience={this.updateAndSaveData}
                        onCancel={this.handleCancel} />
                    <table className="ui striped table">
                        <tbody>
                            {secondTableData}
                        </tbody>
                    </table>
                </React.Fragment>
            );
        }
        else {
            return (
                <table className="ui striped table">
                    <tbody>
                        {tableData}
                    </tbody>
                </table>);
        }
    }

    render() {
        let tableData = this.dealWithUpdate(this.getTableData());
        return (
            <React.Fragment>
                {this.state.mode !== "add" ? "" :
                    <ExperienceForm
                        mode={this.state.mode}
                        exp={null === this.state.editingRow
                            ? ""
                            : this.props.experienceData[this.state.editingRow]}
                        index={this.state.editingRow}
                        saveExperience={this.updateAndSaveData}
                        onCancel={this.handleCancel} />}
                <div className="ui sixteen wide column">
                    <table className="ui striped table">
                        <thead>
                            <tr>
                                <th className="two wide column">Company</th>
                                <th className="two wide column">Position</th>
                                <th className="three wide column">Responsibilities</th>
                                <th className="three wide column">Start</th>
                                <th className="three wide column">End</th>
                                <th className="three wide column">
                                    <Button type="button"
                                        className="teal"
                                        onClick={this.openView.bind(this, "add")}>+Add New</Button>
                                </th>
                            </tr>
                        </thead>
                    </table>
                    {tableData}
                </div>
            </React.Fragment>
        );

    }
}
