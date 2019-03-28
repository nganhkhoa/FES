import React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Upload,
  Checkbox,
  Icon,
  Input,
  Form,
  Select,
  message
} from 'antd';

const { Option } = Select;

const requirePassphrase = algo => ['AES', 'Blowfish'].includes(algo);

@connect(({ rpc }) => ({
  running: rpc.running
}))
@Form.create()
class MainForm extends React.Component {
  state = {
    keyFile: [],
    fileList: [],
    folderList: [],
    algorithm: ''
  };

  onRemove = (file, isFolder) => {
    if (isFolder) {
      this.setState(state => {
        const index = state.folderList.indexOf(file);
        const newFolderList = state.folderList.slice();
        newFolderList.splice(index, 1);
        return {
          folderList: newFolderList
        };
      });
    } else {
      this.setState(state => {
        const index = state.fileList.indexOf(file);
        const newFileList = state.fileList.slice();
        newFileList.splice(index, 1);
        return {
          fileList: newFileList
        };
      });
    }
  };
  beforeUpload = (file, isFolder) => {
    if (isFolder) {
      this.setState(state => ({
        folderList: [...state.folderList, file]
      }));
    } else {
      this.setState(state => ({
        fileList: [...state.fileList, file]
      }));
    }
    return false;
  };

  onRemoveKey = key => {
    this.setState({
      keyFile: []
    });
    return false;
  };
  onAddKey = key => {
    const { keyFile } = this.state;
    if (keyFile.length === 1) {
      message.error('Only one keyfile is needed to decrypt/encrypt');
      return false;
    }
    this.setState({
      keyFile: [key]
    });
    return false;
  };

  submit = e => {
    e.preventDefault();

    const { dispatch } = this.props;
    const { fileList, keyFile, folderList } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { algo, encrypt } = values;
        let key;

        // if (requirePassphrase(algo)) key = passphrase;
        key = keyFile[0].path;
        console.log(key);
        console.log(fileList);
        console.log(folderList);
        dispatch({
          type: 'rpc/invoke',
          payload: {
            fileList: fileList
              .map(f => f.path)
              .concat(folderList.map(f => f.path)),
            key,
            algo,
            task: encrypt ? 'encrypt' : 'decrypt'
          }
        });
      }
    });
  };

  render() {
    const { running } = this.props;
    const { keyFile, fileList, folderList } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.submit}>
        <Form.Item>
          {getFieldDecorator('fileList', {})(
            <Upload
              name="file"
              multiple={true}
              beforeUpload={file => this.beforeUpload(file, false)}
              onRemove={file => this.onRemove(file, false)}
              fileList={fileList}
            >
              <Button>
                <Icon type="upload" /> Select File
              </Button>
            </Upload>
          )}
        </Form.Item>

        <Form.Item>
          {getFieldDecorator('folderList', {})(
            <Upload
              name="file"
              multiple={true}
              beforeUpload={file => this.beforeUpload(file, true)}
              onRemove={file => this.onRemove(file, true)}
              fileList={folderList}
              directory={true}
            >
              <Button>
                <Icon type="upload" /> Select Folder
              </Button>
            </Upload>
          )}
        </Form.Item>

        <Form.Item>
          {getFieldDecorator('algo', {
            rules: [
              {
                required: true,
                message: 'Please select algorithm to encrypt/decrypt'
              }
            ]
          })(
            <Select
              placeholder="Select an algorithm"
              onChange={val => this.setState({ algorithm: val })}
            >
              <Option value="RSA">RSA</Option>
              <Option value="AES">AES</Option>
              <Option value="Blowfish">Blowfish</Option>
              <Option value="ECC" disabled>
                ECC
              </Option>
            </Select>
          )}
        </Form.Item>
        {/* <Form.Item
          label="Add key file"
        >
          {getFieldDecorator('switch', { valuePropName: 'checked' })(
            <Switch />
          )}
        </Form.Item> */}

        <Form.Item>
          {getFieldDecorator('keyFile', {
            rules: [
              {
                required: true,
                message: 'The algorithm chosen required a key file'
              }
            ]
          })(
            <Upload
              beforeUpload={this.onAddKey}
              onRemove={this.onRemoveKey}
              fileList={keyFile}
            >
              <Button
                type="primary"
                style={{ marginTop: 16 }}
                // disabled={requirePassphrase(algorithm)}
              >
                Add Key File
              </Button>
            </Upload>
          )}
        </Form.Item>

        <Form.Item>
          {getFieldDecorator('encrypt', {
            valuePropName: 'encrypt'
          })(<Checkbox>Encrypt</Checkbox>)}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={running > 0}>
            {running > 0 ? `${running} task(s) running` : `Submit`}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default MainForm;
