import {Avatar, Button, Dropdown, Layout, Menu, Space} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {LogoutOutlined, SettingOutlined, UserOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../redux/store.ts";
import {useEffect} from "react";
import {fetchProfile} from "../redux/slices/user.slice.ts";
import {authActions, validateTokenExpireOrNot} from "../redux/slices/auth.slice.ts";

const {Header} = Layout;

export const HeaderBarComponent: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const isTokenValid = useSelector<RootState>((state) => state.auth.isTokenValid);

    const {profile} = useSelector((state: RootState) => state.user);
    useEffect(() => {
        dispatch(fetchProfile());
        dispatch(validateTokenExpireOrNot())

    }, [dispatch]);

    const handleMenuClick = ({key}: { key: string }) => {
        if (key === 'logout') {
            dispatch(authActions.logout());
            dispatch(validateTokenExpireOrNot())
            navigate('/');
        }
        if (key === 'profile') {
            // Navigate to profile if needed
            navigate('/profile');
        }
    };
    const userMenu = (
        <Menu
            onClick={handleMenuClick}
            items={
                [
                    {
                        key: 'profile',
                        label: 'Thông tin cá nhân',
                        icon: <SettingOutlined/>
                    },
                    {
                        key: 'logout',
                        label: 'Đăng xuất',
                        icon: <LogoutOutlined/>
                    }
                ]
            }>

        </Menu>
    );
    return (
        <Header
            style={{
                backgroundColor: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 24px',
            }}
        >
            <Link to="/" style={{
                fontSize: '24px',
                fontWeight: 'bold',
            }}>Shobee</Link>
            {/*<Menu*/}
            {/*    theme="light"*/}
            {/*    style={{*/}
            {/*        flex: 1,*/}
            {/*    }}*/}
            {/*    selectedKeys={[location.pathname]}*/}
            {/*    mode="horizontal"*/}
            {/*>*/}
            {/*    <Menu.Item*/}
            {/*        key="/"*/}
            {/*    >*/}
            {/*        <Link to={'/'}>Trang chủ</Link>*/}
            {/*    </Menu.Item>*/}
            {/*</Menu>*/}

            {isTokenValid ? (
                <Dropdown overlay={userMenu}>
                    <Space>
                        <Avatar icon={<UserOutlined/>}></Avatar>
                        <span>Xin chào {profile?.name}</span>
                    </Space>
                </Dropdown>
            ) : (
                <Menu
                    mode="horizontal"
                >
                    <div style={{
                        display: "flex",
                        gap: "8px",
                    }}>
                        <Button type={"primary"} href={"/login"}>
                            Đăng nhập
                        </Button>

                        <Button href={"/register"}>
                            Đăng ký
                        </Button>
                    </div>
                </Menu>
            )}

        </Header>
    )
}