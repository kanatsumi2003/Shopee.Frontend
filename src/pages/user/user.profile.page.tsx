import React, {useEffect} from "react";
import {Avatar, Button, Card, Descriptions} from "antd";
import {EditOutlined, UserOutlined} from "@ant-design/icons";
import {HeaderBarComponent} from "../../components/header.bar.component.tsx";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../../redux/store.ts";
import {fetchProfile} from "../../redux/slices/user.slice.ts";
import dayjs from "dayjs";

export const UserProfilePage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { profile } = useSelector((state: RootState)=> state.user);
    useEffect(() => {
        dispatch(fetchProfile())
    }, [dispatch])



    return (
        <>
            <HeaderBarComponent/>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <Card
                    style={{ width: 600 }}
                    actions={[
                        <Button icon={<EditOutlined />} type="link" key="edit">Chỉnh sửa</Button>,
                    ]}
                >
                    <Card.Meta
                        avatar={<Avatar size={64} icon={<UserOutlined />} />}
                        title={profile?.name}
                        description={profile?.email}
                    />

                    <Descriptions
                        title="Thông tin chi tiết"
                        bordered
                        column={1}
                        style={{ marginTop: '24px' }}
                    >
                        <Descriptions.Item label="Số điện thoại">{profile?.phoneNumber}</Descriptions.Item>
                        <Descriptions.Item label="Ngày sinh">
                            {profile?.dateOfBirth
                                ? dayjs(profile.dateOfBirth).isValid()
                                    ? dayjs(profile.dateOfBirth).format('DD-MM-YYYY')
                                    : 'Ngày không hợp lệ'
                                : null}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </div>
        </>

    );
}