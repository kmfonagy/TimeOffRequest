import React, { Component } from 'react';
import { Row, } from 'reactstrap';
import { ReviewTable } from './ReviewTable';
import Moment from 'moment'

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
                    <h4>Review Requests</h4>
                </Row>
                <Row key='2'>
                    {this.state.loading
                        ? <p><em>Loading...</em></p>
                        : this.renderReqsTable(this.state)
                    }
                </Row>
            </div>
        )
    }

    async populateRequestData() {
        const sv = Number.parseInt(localStorage.getItem("user"), 10);
        const curDate = Moment(new Date()).format('LL')
        console.log('Supervisor id: ' + sv)
        const response = await fetch('api/Request/Active');
        const data = await response.json();
        console.log(data.map(r => (Moment(r.endDate).format('LL') > curDate)))
        if (data !== null) {
            this.setState({
                requests: data.filter(r => (r.createdBy.supervisorId === sv) && (Moment(r.endDate).format('LL') < curDate)),
                loading: false,
                userId: sv
            })
        }
    }
}

export default ReviewRequests;