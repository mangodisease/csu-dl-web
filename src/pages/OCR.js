/* eslint-disable */
import React, { Fragment, useEffect, useState } from "react";
import { Camera } from "../camera";
import { Root, Preview, Footer, GlobalStyle } from "./styles";
import { Button, Col, Row, Form, notification, Input, Card, message, Upload, Select, Alert } from "antd";
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { Process, ProcessID, ProcessIdentity, ProcessImage, SubmitLogs } from "../api";
import moment from "moment";

export default function OCR() {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [cardImage, setCardImage] = useState();
    const [processing, setprocessing] = useState(false)
    const [uploading, setuploading] = useState(false)
    const [submitting, setsubmitting] = useState(false)
    const [okToSubmit, setokToSubmit] = useState(false)

    const [form] = Form.useForm()
    const init = {
        "Name": "",
        "Nationality": "", "Sex": "", "Date_of_Birth": "",
        "Address": "", "License_No": "", "Expiry_Date": "",
        "Plate_No": "", "Vehicle_Type": ""
    }

    function SetFieds(data) {
        try {
            var obj = {}
            const keys = Object.keys(data)
            for (let i = 0; i < keys.length; i++) {
                const k = keys[i]
                const val = data[k]
                if (k === "given_names" && val !== null) {
                    if (Array.isArray(val)) {
                        var nstr = ""
                        for (let j = 0; j < val.length; j++) {
                            const v = val[j].value
                            nstr += `${v} `
                        }
                        const name = obj.Name
                        if (name !== undefined) {
                            Object.assign(obj, { "Name": `${nstr} ${name}` })
                        } else {
                            Object.assign(obj, { "Name": val.value })
                        }
                    }
                }
                if (k === "last_name" && val !== null) {
                    const name = obj.Name
                    if (name !== undefined) {
                        Object.assign(obj, { "Name": `${val.value} ${name}` })
                    } else {
                        Object.assign(obj, { "Name": val.value })
                    }

                }
                if (k === "gender" && val !== null) {
                    Object.assign(obj, { "Sex": val.value })
                }
                if (k === "document_id" && val !== null) {
                    Object.assign(obj, { "License_No": val.value })
                }
                if (k === "expire_date" && val !== null) {
                    Object.assign(obj, { "Expiry_Date": val.value })
                }
                if (k === "birth_date" && val !== null) {
                    Object.assign(obj, { "Date_of_Birth": val.value })
                }
                if (k === "address" && val !== null) {
                    Object.assign(obj, { "Address": val.value })
                }
            }
            obj.Name = obj.Name.toUpperCase().replace(",", "")
            form.setFieldsValue(obj)
            setokToSubmit(true)
        } catch (err) {
            console.log(err.message)

        }
    }

    const { Dragger } = Upload;
    const props = {
        name: 'file',
        showUploadList: false,
        disabled: processing || uploading || submitting,
        multiple: false,
        action: 'https://csu-dl-api.onrender.com/process',
        accept: "image/png, image/jpeg",
        async onChange(info) {
            const { status } = info.file;
            info.fileList = [info.file]
            setuploading(true)
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                setuploading(false)
                const file_url = info.file.response
                setprocessing(true)
                await ProcessIdentity(file_url)
                    .then(res => {
                        const data = res.data.microsoft.extracted_data[0]
                        console.log(data)
                        SetFieds(data)
                    }).catch(err => {
                        console.log(err.message)
                    })
                setprocessing(false)

            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    function clear() {
        setokToSubmit(false)
        setsubmitting(false)
        //setIsCameraOpen(false)
        setCardImage(undefined)
        form.setFieldsValue(init)
    }

    function blobToBase64(blob) {
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }
    useEffect(() => {
        setIsCameraOpen(false)
    },
        [])
    return (
        <Row gutter={[24, 5]}>
            {/**Camera Disabled*/}
            <Col xs={24} >
                <Button
                    style={{ float: "right" }}
                    onClick={() => setIsCameraOpen(true)}
                    type="primary"
                    hidden={isCameraOpen}>
                    📷 Use Camera
                </Button>
                <Button
                    style={{ float: "right" }}
                    hidden={!isCameraOpen}
                    danger
                    onClick={() => {
                        setIsCameraOpen(false);
                        setCardImage(undefined);
                    }}
                >
                    ❌  Use File Upload
                </Button>
            </Col>
            <Col xs={24}>
                <Fragment>
                    <Root>

                        {isCameraOpen && (
                            <Camera
                                onCapture={async blob => {
                                    setCardImage(blob)
                                    setIsCameraOpen(false)
                                    setprocessing(true)
                                    //api process here
                                    var formData = new FormData();
                                    formData.append("file", blob, "file.png");
                                    const file_url = await ProcessImage(formData)
                                        .then(res => {
                                            console.log(res.data)
                                            return res.data
                                        }).catch(err => {
                                            console.log(err.message)
                                            return null
                                        })
                                    console.log(file_url)
                                    await ProcessIdentity(file_url)
                                        .then(res => {
                                            console.log(res.data)
                                            const data = res.data.microsoft.extracted_data[0]
                                            SetFieds(data)
                                        }).catch(err => {
                                            console.log(err.message)
                                        })
                                    setprocessing(false)
                                }}
                                onClear={() => {
                                    setCardImage(undefined)
                                    setIsCameraOpen(true)
                                }}
                            />
                        )}

                        {cardImage && (
                            <div>
                                <Preview src={cardImage && URL.createObjectURL(cardImage)} />

                                {!isCameraOpen && (
                                    <Button
                                        style={{ marginTop: 20, width: "90%" }}
                                        loading={processing}
                                        onClick={() => {
                                            setCardImage(undefined)
                                            setIsCameraOpen(true)
                                        }}
                                    >{processing ? "Processing" : "Take Again"}
                                    </Button>
                                )}

                            </div>
                        )}
                        <Footer hidden>
                            <button onClick={() => setIsCameraOpen(true)}>Open Camera</button>
                            <button
                                onClick={() => {
                                    setIsCameraOpen(false);
                                    setCardImage(undefined);
                                }}
                            >
                                Use File Upload
                            </button>
                        </Footer>
                    </Root>

                </Fragment>
            </Col>
            {/**Camera End */}
            <Col xs={24} style={{ marginBottom: 30 }}>
                {
                    !isCameraOpen &&
                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                            <Button type="link" loading={processing || uploading}>
                                {uploading ? "Uploading Image ..." : ""}
                                {processing ? "Processing Image ..." : ""}
                            </Button>
                        </p>
                    </Dragger>
                }

            </Col>
            {/**Form */}
            <center>
                <Col xs={22} lg={18} style={{}}>
                    <Card
                        bordered
                        hoverable
                        title={<b>VISITORS FORM</b>}
                    >
                        <Form
                            form={form}
                            initialValues={init}
                            onFinish={async (values) => {
                                console.log(values)
                                values.createdAt = moment().format("MM-DD-YYYY @ hh:mm:ss a")
                                console.log(values)
                                await SubmitLogs(values)
                                .then(res=>{
                                    console.log(res.data)
                                    notification.success({ message: "Submitted Successfully!" })
                                    clear()
                                }).catch(err=>{
                                    console.log(err.message)
                                    setsubmitting(false)
                                    notification.error({ message: "Server Error! Please try again later!" })
                                })
                                
                            }}
                            onFinishFailed={err => {
                                console.log(err)
                                setsubmitting(false)
                                notification.warn({
                                    message: "Please fill in the from completely!"
                                })
                            }}
                            alignment="horizontal"
                        >
                            <Row gutter={[24, 5]}>
                                <Col xs={24}>
                                    <Form.Item
                                        hasFeedback
                                        validateStatus={!okToSubmit? "" : form.getFieldValue("Name")||form.getFieldValue("Name")!==null? "success" : ""}
                                        name="Name"
                                        label="Name"
                                        rules={[
                                            { required: true, message: "Please fill in this field!" },
                                        ]}
                                    >
                                        <Input type="text" placeholder="" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} lg={12}>
                                    <Form.Item
                                        hasFeedback
                                        validateStatus={!okToSubmit? "" : form.getFieldValue("Date_of_Birth")||form.getFieldValue("Date_of_Birth")!==null? "success" : ""}
                                        name="Date_of_Birth"
                                        label="Date of Birth"
                                        rules={[
                                            { required: false, message: "Please fill in this field!" },
                                        ]}
                                    >
                                        <Input type="text" placeholder="" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} lg={12}>
                                    <Form.Item
                                        hasFeedback
                                        validateStatus={!okToSubmit? "" : form.getFieldValue("Sex")||form.getFieldValue("Sex")!==null? "success" : okToSubmit? "warning" : ""}
                                        name="Sex"
                                        label="Sex"
                                        rules={[
                                            { required: false, message: "Please fill in this field!" },
                                        ]}
                                    >
                                        <Input type="text" placeholder="" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24}>
                                    <Form.Item
                                        hasFeedback
                                        validateStatus={!okToSubmit? "" : form.getFieldValue("Address")||form.getFieldValue("Address")!==null? "success" : okToSubmit? "warning" : ""}
                                        name="Address"
                                        label="Address"
                                        rules={[
                                            { required: false, message: "Please fill in this field!" },
                                        ]}
                                    >
                                        <Input.TextArea type="text" placeholder="" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} lg={12}>
                                    <Form.Item
                                        hasFeedback
                                        validateStatus={!okToSubmit? "" : form.getFieldValue("Expiry_Date")||form.getFieldValue("Expiry_Date")!==null? "success" : okToSubmit? "warning" : ""}
                                        name="Expiry_Date"
                                        label="Expiry Date"
                                        rules={[
                                            { required: false, message: "Please fill in this field!" },
                                        ]}
                                    >
                                        <Input type="text" placeholder="" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} lg={12}>
                                    <Form.Item
                                        hasFeedback
                                        validateStatus={!okToSubmit? "" : form.getFieldValue("License_No")||form.getFieldValue("License_No")!==null? "success" : okToSubmit? "warning" : ""}
                                        name="License_No"
                                        label="License No."
                                        rules={[
                                            { required: false, message: "Please fill in this field!" },
                                        ]}
                                    >
                                        <Input type="text" placeholder="" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24}>
                                    <hr />
                                </Col>
                                <Col xs={24} lg={12}>
                                    <Form.Item
                                        hasFeedback
                                        validateStatus={okToSubmit? "warning" : ""}
                                        name="Plate_No"
                                        label="Plate No."
                                        rules={[
                                            { required: true, message: "Please fill in this field!" },
                                        ]}
                                    >
                                        <Input type="text" placeholder="" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} lg={12}>
                                    <Form.Item
                                        hasFeedback
                                        validateStatus={okToSubmit? "warning" : ""}
                                        name="Vehicle_Type"
                                        label="Vehicle Type"
                                        rules={[
                                            { required: true, message: "Please fill in this field!" },
                                        ]}
                                    >
                                        <Select
                                            style={{
                                                width: "100%",
                                            }}
                                            allowClear
                                            options={[
                                                {
                                                    label: 'Car',
                                                    value: 'Car',
                                                },
                                                {
                                                    label: 'Truck',
                                                    value: 'Truck',
                                                },
                                                {
                                                    label: 'Tricycle',
                                                    value: 'Tricycle',
                                                },
                                                {
                                                    label: 'Motorcycle',
                                                    value: 'Motorcycle',
                                                }
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} style={{ marginBottom: 20 }}>
                                {
                                    okToSubmit&&<Alert
                                    message="Please check the details above before submitting!"
                                    banner
                                    closable

                                />
                                }
                                </Col>
                                <Col xs={24}>
                                    <Button
                                        type="primary"
                                        style={{ width: "100%" }}
                                        disabled={!okToSubmit}
                                        loading={submitting}
                                        onClick={async () => {
                                            setsubmitting(true)
                                            form.submit()
                                        }}
                                    >
                                        {submitting ? "SUBMITTING" : "SUBMIT"}
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>
            </center>
            {/**Form End */}
            <GlobalStyle />
        </Row>
    );
}

