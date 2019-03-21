import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';

const { Content, Sider } = Layout;

@connect(({ route }) => ({
  currentPage: route.current
}))
class BasicLayout extends React.Component {
  render() {
    const { currentPage } = this.props;
    return (
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={[currentPage]}
            style={{ height: '100%', borderRight: 0 }}
            onClick={({ item, key, keyPath }) => {
              const { dispatch } = this.props;
              dispatch({
                type: 'route/change',
                payload: { page: key }
              });
            }}
          >
            <Menu.Item key="Home">
              <Link to="/">
                <Icon type="home" />
                Home
              </Link>
            </Menu.Item>
            <Menu.Item key="Index">
              <Link to="/index">
                <Icon type="database" />
                File Index
              </Link>
            </Menu.Item>
            <Menu.Item key="Key">
              <Link to="/keys">
                <Icon type="key" />
                Keys Manager
              </Link>
            </Menu.Item>
            <Menu.Item key="Setting">
              <Link to="/settings">
                <Icon type="setting" />
                Settings
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>{currentPage}</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            style={{
              background: '#fff',
              padding: 24,
              margin: 0,
              minHeight: 280
            }}
          >
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default BasicLayout;
