import React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Collapse,
  Upload,
  Icon,
  Switch,
  Typography,
  Modal,
  message
} from 'antd';

const { Dragger } = Upload;
const { Paragraph } = Typography;
const { Panel } = Collapse;

@connect(({ rpc }) => ({
  fileList: rpc.fileList,
  pubkey: rpc.pubkey,
  prikey: rpc.prikey
}))
class MainForm extends React.Component {
  state = {
    encryptMode: true,
    folderMode: false,
    keyFile: [],
    showModal: false
  };

  onChange = info => {
    const status = info.file.status;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  beforeUpload = file => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rpc/addFile',
      payload: {
        file: file
      }
    });
    return false;
  };

  onRemove = file => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rpc/removeFile',
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

  createKey = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rpc/createKey',
      payload: {
        algo: 'RSA'
      }
    });
  };

  submit = () => {
    const { dispatch } = this.props;
    const { encryptMode, keyFile } = this.state;
    if (encryptMode)
      dispatch({
        type: 'rpc/encrypt',
        payload: {
          keyFile: keyFile,
          algo: 'RSA'
        }
      });
    else
      dispatch({
        type: 'rpc/decrypt',
        payload: {
          keyFile: keyFile,
          algo: 'RSA'
        }
      });
  };

  showModal = () => {
    this.setState({
      showModal: true
    });
  };

  hideModal = () => {
    this.setState({
      showModal: false
    });
  };

  render() {
    const { encryptMode, folderMode, keyFile, showModal } = this.state;
    const { fileList, pubkey, prikey } = this.props;
    return (
      <div>
        <Paragraph>
          Encrypt:{' '}
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
          Folder:{' '}
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
          {encryptMode ? 'encrypt' : 'decrypt'}
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

        <Paragraph>
          <Button onClick={this.createKey}>
            <Icon type="upload" /> Create key
          </Button>
          <Button onClick={this.showModal}>
            <Icon type="upload" /> Show keys
          </Button>
        </Paragraph>

        <Button type="primary" style={{ marginTop: 16 }} onClick={this.submit}>
          {encryptMode ? 'Encrypt' : 'Decrypt'}
        </Button>

        <Modal
          title="Basic Modal"
          visible={showModal}
          onOk={this.hideModal}
          onCancel={this.hideModal}
        >
          <Collapse accordion defaultActiveKey={['1']}>
            <Panel header="Public Key" key="1">
              <Paragraph ellipsis={{ rows: 3, expandable: true }} copyable>
                {pubkey}
              </Paragraph>
            </Panel>
            <Panel header="Private Key" key="2">
              <Paragraph ellipsis={{ rows: 3, expandable: true }} copyable>
                {prikey}
              </Paragraph>
            </Panel>
          </Collapse>
        </Modal>
      </div>
    );
  }
}

export default MainForm;
