import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

export class SimpleTableActionArea extends React.Component {
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
