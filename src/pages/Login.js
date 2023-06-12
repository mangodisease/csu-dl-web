import { Card, Col, Row, Form, Button, Input, notification } from "antd";
import { loginAPI } from "../api";
import { useHistory } from "react-router-dom";
import csucc from "../assets/images/csucc.png";
import { isMobile } from "react-device-detect";
import { useState } from "react";

export default function Login(props) {
    const {setuser} = props
    const [loading, setloading] = useState(false)
    const history = useHistory()
    return (
        <Row gutter={[24, 5]}>
            <Col xs={24}>
                <center>
                    <Col xs={isMobile? 24 : 15} style={{ marginTop: window.innerHeight * .20}}>
                    <Card
                    bordered
                    hoverable
                    title={<center>
                        
                        <img src={csucc} alt="" width={100}/> <br/>
                        <b>LOGIN</b>
                        
                    </center>}
                >
                    <Form
                        onFinish={async values => {
                            console.log(values)
                            setloading(true)
                            await loginAPI(values)
                            .then(res=>{
                                console.log(res.data)
                                if(res.data==="ok"){
                                    notification.success({ message: "Login Successfully!" })
                                    setuser(values)
                                    localStorage.setItem("user", JSON.stringify(values))
                                    history.push("/OCR")
                                    
                                }
                                setloading(false)
                            }).catch(err=>{
                                console.log(err.message)
                                setloading(false)
                            })
                        }}
                        onFinishFailed={err => {
                            console.log(err)
                        }}
                        layout="horizontal"
                        className="row-col"
                    >
                        <Form.Item
                            className="username"
                            label="Username"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your username!",
                                },
                            ]}
                        >
                            <Input placeholder="Username" />
                        </Form.Item>

                        <Form.Item
                            className="username"
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your password!",
                                },
                            ]}
                        >
                            <Input.Password placeholder="Password" />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                loading={loading}
                                type="primary"
                                htmlType="submit"
                                style={{ width: "100%" }}
                            >
                                SIGN IN
                            </Button>
                        </Form.Item>
                        
                    </Form>
                </Card>
                    </Col>
                </center>
            </Col>
        </Row>
    )
}