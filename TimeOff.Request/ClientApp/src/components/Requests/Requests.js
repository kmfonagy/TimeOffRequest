import React, { Component } from 'react';
import { Row, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import History from './History';
import NewRequest from './NewRequest';

export class Requests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displaying: 'history',
            title: 'Request History',
            open: false,
            requests: []
        }

        this.header = [
            { id: 0, name: 'Request History', value: 'history' },
            { id: 1, name: 'New Request', value: 'create' }
        ]
    }

    toggle = () => {
        const opening = !this.state.open;
        this.setState({
            open: opening
        })
    }

    changeDisplay = (header) => {
        this.setState({
            displaying: header.value,
            title: header.name
        })
    }

    render() {
        return (
            <div>
                <Row key='1'>
                    <Dropdown group isOpen={this.state.open} size="md" toggle={this.toggle}>
                        <DropdownToggle caret>
                            {this.state.title}
                        </DropdownToggle>
                        <DropdownMenu container="body" key="requestMenu">
                            {this.header.map(h =>
                                <DropdownItem
                                    key={h.id}
                                    value={h.value}
                                    onClick={this.changeDisplay.bind(this, h)}
                                >{h.name}</DropdownItem>
                            )}
                        </DropdownMenu>
                    </Dropdown>
                </Row>
                <Row key='2'>
                    {this.state.displaying === 'history' ? (
                        <History />
                    ) : (
                        <NewRequest />
                    )}
                </Row>
            </div>
        );
    }
}
