/* eslint-disable */
import { Button, Card, Col, Row, Table } from "antd";
import { useState, useEffect } from "react";
import { GetLogs } from "../api";
import { isMobile } from "react-device-detect"
import { CSVLink } from "react-csv";

export default function Reports(props) {
    const [list, setlist] = useState(null)
    const columns = [
        {
            title: "Date Time",
            dataIndex: "createdAt",
            width: "15%"
        },
        {
            title: "Visitor",
            render: val => (
                <span>
                    <b>Name: </b> {val.Name} <br />
                    <b>Date of Birth: </b> {val.Date_of_Birth}<br />
                    <b>Sex: </b> {val.Sex}<br />
                    <b>Address: </b> {val.Address}<br />

                </span>
            )
        },
        {
            title: "Vehicle / License",
            render: val => (
                <span>
                    <b>Vehicle Type: </b> {val.Vehicle_Type} <br />
                    <b>Plate No.: </b> {val.Plate_No}<br />
                    <b>License No.: </b> {val.License_No} <br />
                    <b>License Expiry.: </b> {val.Expiry_Date}
                </span>
            )
        },
    ]
    const columnsM = [
        {
            title: "Visitor's Information",
            render: val => (
                <span>
                    <b>Date Visited: </b> {val.createdAt.toUpperCase()} <br />
                    <b>Name: </b> {val.Name} <br />
                    <b>Date of Birth: </b> {val.Date_of_Birth}<br />
                    <b>Sex: </b> {val.Sex}<br />
                    <b>Address: </b> {val.Address}<br />
                    <hr />
                    <div style={{ textAlign: "right" }}>
                        <b>Vehicle Type: </b> {val.Vehicle_Type} <br />
                        <b>Plate No.: </b> {val.Plate_No}<br />
                        <b>License No.: </b> {val.License_No} <br />
                        <b>License Expiry.: </b> {val.Expiry_Date}
                    </div>
                </span>
            )
        }
    ]
    async function SetLogs(query) {
        await GetLogs(query)
            .then(res => {
                console.log(res.data)
                setlist(res.data.result)
            }).catch(err => {
                console.log(err.message)
                setlist(null)
            })
    }

    useEffect(() => {
        SetLogs({})
    },
        [])
    return (
        <Row gutter={[24, 5]}>
            <Col xs={24}>
                <Card
                    bordered
                >
                    {list!==null&&
                    <CSVLink
                    data={list}
                    filename={"reportLogs.csv"}
                    className="btn btn-primary"
                    target="_blank"
                    style={{ float: "right", color: "green" }}
                >
                    DOWNLOAD CSV
                </CSVLink>
                    }

                    <Table
                        className="ant-list-box table-responsive"
                        columns={isMobile ? columnsM : columns}
                        loading={list === null}
                        dataSource={list}
                    />
                </Card>
            </Col>
        </Row>
    )
}