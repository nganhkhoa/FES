import React from "react";
import { connect } from "react-redux";
import { Table, Upload, Button, Icon } from "antd";

@connect(({ rpc }) => ({
  folderList: rpc.folderList
}))
class FileIndex extends React.Component {
  state = {
    columns: [
      {
        // string
        title: "File",
        dataIndex: "file",
        key: "file"
      },
      {
        // bool
        title: "Folder",
        dataIndex: "folder",
        key: "folder"
      },
      {
        // key index
        title: "Key",
        dataIndex: "key",
        key: "key"
      },
      {
        // encrypted status
        title: "Encrypted",
        dataIndex: "encrypted",
        key: "encrypted"
      }
    ]
  };

  render() {
    const { dataSource } = this.props;
    const { columns } = this.state;
    const onRemove = file => {
      const { dispatch } = this.props;
      dispatch({
        type: "rpc/removeFolder",
        payload: {
          file
        }
      });
    };
    const beforeUpload = file => {
      const { dispatch } = this.props;
      dispatch({
        type: "rpc/addFolder",
        payload: {
          file
        }
      });
      return false;
    };

    return (
      <div>
        <Upload
          onRemove={onRemove}
          beforeUpload={beforeUpload}
          // fileList={folderList}
          directory
          className="col-6"
        >
          <Button>
            <Icon type="upload" /> Choose Folder
          </Button>
        </Upload>

        <Upload
          onRemove={onRemove}
          beforeUpload={beforeUpload}
          // fileList={folderList}
          className="col-6"
        >
          <Button>
            <Icon type="upload" /> Choose File
          </Button>
        </Upload>

        <br />
        <Table dataSource={dataSource} columns={columns} bordered />
      </div>
    );
  }
}

export default FileIndex;
