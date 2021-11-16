import React, { Component } from 'react';
import { Row, Spinner } from 'reactstrap';
import { ReviewTable } from './ReviewTable';

export class ReviewRequests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requests: null,
            loading: true,
            userId: null
        }
    }

    componentDidMount() {
        this.populateRequestData()
    }

    renderReqsTable(state) {
        return (
            <ReviewTable state={state} />
        )
    }

    render() {
        return (
            <div>
                <Row key='1'>
                    <h4 className="p-2">Requests Awaiting Review</h4>
                </Row>
                <Row key='2'>
                    {this.state.loading
                        ? <Spinner>Loading...</Spinner>
                        : this.renderReqsTable(this.state)
                    }
                </Row>
            </div>
        )
    }

    async populateRequestData() {
        const sv = JSON.parse(localStorage.getItem("user")).id
        const response = await fetch('api/Request/Active')
        const data = await response.json();
        
        if (data !== null) {
            this.setState({
                requests: data.filter(r => (r.createdBy.supervisorId === sv)),
                loading: false,
                userId: sv
            })
        }
    }
}