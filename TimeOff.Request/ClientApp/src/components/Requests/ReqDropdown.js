import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const ReqDropdown = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);
    const [lastClicked, setLastClicked] = useState(null);

    return (
        <div >
            <Dropdown group isOpen={dropdownOpen} size="sm" toggle={toggle}>
                <DropdownToggle caret>
                    {lastClicked || 'All'}
                </DropdownToggle>
                <DropdownMenu container="body">
                    <DropdownItem onClick={() => setLastClicked('All')}>All Requests</DropdownItem>
                    <DropdownItem onClick={() => setLastClicked('Timeframe')}>By Timeframe</DropdownItem>
                    <DropdownItem onClick={() => setLastClicked('Status')}>By Approval</DropdownItem>
                    <DropdownItem onClick={() => setLastClicked('Open')}>Open Requests</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}

export default ReqDropdown;