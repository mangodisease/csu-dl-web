/* eslint-disable */
import React, { Fragment, useEffect, useState } from "react";
import { Camera } from "../camera";
import { Root, Preview, Footer, GlobalStyle } from "./styles";
import { Button, Col, Row, Form, notification, Input, Card } from "antd";
import { Process, ProcessID, ProcessImage } from "../api";

export default function OCR() {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [cardImage, setCardImage] = useState();
    const [processing, setprocessing] = useState(false)
    const [submitting, setsubmitting] = useState(false)
    const [result, setresult] = useState(null)
    const [form] = Form.useForm()
    const init = {
        "Name": "",
        "Nationality": "", "Sex": "", "Date_of_Birth": "",
        "Weight": "", "Height": "",
        "Address": "", "License_No": "", "Expiry_Date": "",
        "Plate_No": "", "Vehicle_Type": ""
    }
    function clear() {
        setresult(null)
        setsubmitting(false)
        setIsCameraOpen(true)
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
        setIsCameraOpen(true)
    },
        [])
    return (
        <Row gutter={[24, 5]}>
            {/**Camera */}
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
                                    const file_url =  await ProcessImage(formData)
                                    .then(res=>{
                                        console.log(res.data)
                                        return res.data
                                    }).catch(err=>{
                                        console.log(err.message)
                                        return null
                                    })
                                    console.log(file_url)
                                    const text = await Process(file_url)
                                    .then(res=>{
                                        console.log(res.data)
                                        return res.data
                                    }).catch(err=>{
                                        console.log(err.message)
                                        return null
                                    })
                                    console.log(text)
                                    setprocessing(false)
                                    /**
                                     * var formData = new FormData();
                                    formData.append("file", blob, "file.png");
                                    await ProcessID(formData)
                                    .then(res=>{
                                        console.log(res.data)
                                        setprocessing(false)
                                    }).catch(err=>{
                                        console.log(err.message)
                                    })
                                     */
                                    setTimeout(() => {
                                        //setprocessing(false)
                                        setresult({})
                                        //form.setFieldsValue()
                                    }, 1000)
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
                                Close Camera
                            </button>
                        </Footer>
                    </Root>

                </Fragment>
            </Col>
            {/**Camera End */}
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


                            }}
                            onFinishFailed={err => {
                                console.log(err)
                                notification.warn({
                                    message: "Please fill in the from completely!"
                                })
                            }}
                            alignment="horizontal"
                        >
                            <Row gutter={[24, 5]}>
                                <Col xs={24}>
                                    <Form.Item
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
                                        name="Date_of_Birth"
                                        label="Date of Birth"
                                        rules={[
                                            { required: true, message: "Please fill in this field!" },
                                        ]}
                                    >
                                        <Input type="text" placeholder="" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} lg={12}>
                                    <Form.Item
                                        name="Sex"
                                        label="Sex"
                                        rules={[
                                            { required: true, message: "Please fill in this field!" },
                                        ]}
                                    >
                                        <Input type="text" placeholder="" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} lg={12}>
                                    <Form.Item
                                        name="Weight"
                                        label="Weight"
                                        rules={[
                                            { required: true, message: "Please fill in this field!" },
                                        ]}
                                    >
                                        <Input type="text" placeholder="" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} lg={12}>
                                    <Form.Item
                                        name="Height"
                                        label="Height"
                                        rules={[
                                            { required: true, message: "Please fill in this field!" },
                                        ]}
                                    >
                                        <Input type="text" placeholder="" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24}>
                                    <Form.Item
                                        name="Address"
                                        label="Address"
                                        rules={[
                                            { required: true, message: "Please fill in this field!" },
                                        ]}
                                    >
                                        <Input.TextArea type="text" placeholder="" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} lg={12}>
                                    <Form.Item
                                        name="Expiry_Date"
                                        label="Expiry Date"
                                        rules={[
                                            { required: true, message: "Please fill in this field!" },
                                        ]}
                                    >
                                        <Input type="text" placeholder="" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} lg={12}>
                                    <Form.Item
                                        name="License_No"
                                        label="License No."
                                        rules={[
                                            { required: true, message: "Please fill in this field!" },
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
                                        name="Vehicle_Type"
                                        label="Vehicle Type"
                                        rules={[
                                            { required: true, message: "Please fill in this field!" },
                                        ]}
                                    >
                                        <Input type="text" placeholder="" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24}>
                                    <Button
                                        type="primary"
                                        style={{ width: "100%" }}
                                        disabled={result === null}
                                        loading={submitting}
                                        onClick={async () => {
                                            setsubmitting(true)
                                            //submitting process here
                                            setTimeout(() => {
                                                clear()
                                                notification.success({ message: "Submitted Successfully!" })
                                            }, 3000)
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

