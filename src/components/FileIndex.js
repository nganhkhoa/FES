import React from 'react';
import { Table } from 'antd';

class FileIndex extends React.Component {
  state = {
    columns: [
      {
        // string
        title: 'File',
        dataIndex: 'file',
        key: 'file'
      },
      {
        // bool
        title: 'Folder',
        dataIndex: 'folder',
        key: 'folder'
      },
      {
        // key index
        title: 'Key',
        dataIndex: 'key',
        key: 'key'
      },
      {
        // encrypted status
        title: 'Encrypted',
        dataIndex: 'encrypted',
        key: 'encrypted'
      }
    ]
  };

  render() {
    const { dataSource } = this.props;
    const { columns } = this.state;
    return <Table dataSource={dataSource} columns={columns} />;
  }
}

export default FileIndex;
