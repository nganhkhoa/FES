import React from 'react';
import { Table } from 'antd';

class KeyManager extends React.Component {
  state = {
    columns: [
      {
        // number
        title: 'Index',
        dataIndex: 'id',
        key: 'id'
      },
      {
        // string
        title: 'Algorithm',
        dataIndex: 'algo',
        key: 'algo'
      },
      {
        // string
        title: 'Public Key',
        dataIndex: 'pubkey',
        key: 'pubkey'
      },
      {
        // Action
        title: 'Action',
        key: 'action'
      }
    ]
  };

  render() {
    const { dataSource } = this.props;
    const { columns } = this.state;
    return <Table dataSource={dataSource} columns={columns} />;
  }
}

export default KeyManager;
