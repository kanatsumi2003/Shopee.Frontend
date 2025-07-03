import React from "react";
import { Typography, Row, Col, Card, Layout } from "antd";
import {
    RocketOutlined,
    SafetyCertificateOutlined,
    SmileOutlined,
} from "@ant-design/icons";
import {HeaderBarComponent} from "../components/header.bar.component.tsx";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

export const HomePage: React.FC = () => {

    return (
        <Layout>
           <HeaderBarComponent />
            <Content style={{ padding: "60px 40px" }}>
                {/* Hero Section */}
                <div style={{ textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
                    <Title level={1}>Welcome to Shobee</Title>
                </div>

                {/* Features Section */}
                <div style={{ marginTop: 80 }}>
                    <Row gutter={[24, 24]} justify="center">
                        <Col xs={24} md={8}>
                            <Card bordered={false} hoverable>
                                <RocketOutlined style={{ fontSize: 36, color: "#1890ff" }} />
                                <Title level={4}>Fast Setup</Title>
                                <Paragraph>Get your business online in minutes.</Paragraph>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card bordered={false} hoverable>
                                <SafetyCertificateOutlined
                                    style={{ fontSize: 36, color: "#1890ff" }}
                                />
                                <Title level={4}>Secure</Title>
                                <Paragraph>Enterprise-grade security built-in.</Paragraph>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card bordered={false} hoverable>
                                <SmileOutlined style={{ fontSize: 36, color: "#1890ff" }} />
                                <Title level={4}>User Friendly</Title>
                                <Paragraph>Clean and intuitive interface for all users.</Paragraph>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Content>
        </Layout>
    );
};