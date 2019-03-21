import React from "react";
import { connect } from "react-redux";
import { Button, Upload, Icon, Switch, Typography, message } from "antd";

const { Dragger } = Upload;
const { Paragraph } = Typography;

@connect(({ rpc }) => ({
  fileList: rpc.fileList
}))
class MainForm extends React.Component {
  state = {
    encryptMode: true,
    folderMode: false,
    keyFile: []
  };

  onChange = info => {
    const status = info.file.status;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  beforeUpload = file => {
    const { dispatch } = this.props;
    dispatch({
      type: "rpc/addFile",
      payload: {
        file: file
      }
    });
    return false;
  };

  onRemove = file => {
    const { dispatch } = this.props;
    dispatch({
      type: "rpc/removeFile",
      payload: {
        file: file
      }
    });
    return false;
  };

  uploadKeyFile = file => {
    this.setState({
      keyFile: [file]
    });
    return false;
  };

  removeKeyFile = file => {
    this.setState({
      keyFile: []
    });
    return false;
  };

  submit = () => {
    const { dispatch } = this.props;
    const { encryptMode, keyFile } = this.state;
    if (encryptMode)
      dispatch({
        type: "rpc/encrypt",
        payload: {
          keyFile: keyFile,
          algo: "RSA"
        }
      });
    else
      dispatch({
        type: "rpc/decrypt",
        payload: {
          keyFile: keyFile,
          algo: "RSA"
        }
      });
  };

  render() {
    const { encryptMode, folderMode, keyFile } = this.state;
    const { fileList } = this.props;
    return (
      <div>
        <Paragraph>
          Encrypt:{" "}
          <Switch
            checked={encryptMode}
            onChange={status =>
              this.setState({
                encryptMode: status
              })
            }
          />
        </Paragraph>
        <Paragraph>
          Folder:{" "}
          <Switch
            checked={folderMode}
            onChange={status =>
              this.setState({
                folderMode: status
              })
            }
          />
        </Paragraph>
        <Dragger
          name="file"
          multiple={true}
          beforeUpload={this.beforeUpload}
          onRemove={this.onRemove}
          directory={folderMode}
          fileList={fileList}
        >
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to</p>
          {encryptMode ? "encrypt" : "decrypt"}
        </Dragger>
        <Upload
          name="keyfile"
          beforeUpload={this.uploadKeyFile}
          onRemove={this.removeKeyFile}
          fileList={keyFile}
          disabled={keyFile.length === 1}
        >
          <Button disabled={keyFile.length === 1}>
            <Icon type="upload" /> Select Key File
          </Button>
        </Upload>
        <Button type="primary" style={{ marginTop: 16 }} onClick={this.submit}>
          {encryptMode ? "Encrypt" : "Decrypt"}
        </Button>
      </div>
    );
  }
}

export default MainForm;
